const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { protect, authorize } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find({ isActive: true }).populate('issuedBy', 'name').sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const alert = await Alert.create({ ...req.body, issuedBy: req.user._id });
    req.io.emit('alert:new', alert);
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/deactivate', protect, authorize('admin'), async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    req.io.emit('alert:deactivated', alert);
    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
