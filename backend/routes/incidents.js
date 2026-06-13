const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const { protect, authorize } = require('../middleware/auth');

// Get all incidents
router.get('/', async (req, res) => {
  try {
    const { status, type, severity } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (severity) filter.severity = severity;
    const incidents = await Incident.find(filter)
      .populate('reportedBy', 'name email role')
      .populate('assignedResponders', 'name email role')
      .sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single incident
router.get('/:id', async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('assignedResponders', 'name email phone');
    if (!incident) return res.status(404).json({ message: 'Incident not found' });
    res.json(incident);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create incident
router.post('/', protect, async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.isAnonymous) data.reportedBy = req.user._id;
    const incident = await Incident.create(data);
    const populated = await Incident.findById(incident._id).populate('reportedBy', 'name email');
    // Emit real-time event
    req.io.emit('incident:new', populated);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update incident
router.put('/:id', protect, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ message: 'Incident not found' });
    const updates = req.body;
    if (updates.status === 'resolved') updates.resolvedAt = new Date();
    // Add update log
    if (req.body.updateMessage) {
      incident.updates.push({ message: req.body.updateMessage, updatedBy: req.user._id });
      delete updates.updateMessage;
    }
    Object.assign(incident, updates);
    await incident.save();
    const populated = await Incident.findById(incident._id).populate('reportedBy', 'name email').populate('assignedResponders', 'name email');
    req.io.emit('incident:updated', populated);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete incident (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Incident.findByIdAndDelete(req.params.id);
    req.io.emit('incident:deleted', { id: req.params.id });
    res.json({ message: 'Incident deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SOS - Quick incident report
router.post('/sos', protect, async (req, res) => {
  try {
    const { coordinates, address } = req.body;
    const incident = await Incident.create({
      title: `🆘 SOS - ${req.user.name}`,
      description: 'Emergency SOS signal sent. Immediate assistance required.',
      type: 'other',
      severity: 'critical',
      status: 'active',
      location: { type: 'Point', coordinates, address },
      reportedBy: req.user._id,
    });
    req.io.emit('sos:new', { incident, user: { name: req.user.name, phone: req.user.phone } });
    res.status(201).json(incident);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
