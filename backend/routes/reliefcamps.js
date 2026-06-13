const express = require('express');
const router = express.Router();
const ReliefCamp = require('../models/ReliefCamp');
const { protect, authorize } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const camps = await ReliefCamp.find(filter).populate('managedBy', 'name phone');
    res.json(camps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, authorize('admin', 'responder'), async (req, res) => {
  try {
    const camp = await ReliefCamp.create({ ...req.body, managedBy: req.user._id });
    req.io.emit('camp:new', camp);
    res.status(201).json(camp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, authorize('admin', 'responder'), async (req, res) => {
  try {
    const camp = await ReliefCamp.findByIdAndUpdate(req.params.id, req.body, { new: true });
    req.io.emit('camp:updated', camp);
    res.json(camp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
