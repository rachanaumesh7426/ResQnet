const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Get all volunteers
router.get('/', protect, async (req, res) => {
  try {
    const { skill, available } = req.query;
    const filter = { role: 'responder' };
    if (skill) filter.skills = { $in: [skill] };
    if (available !== undefined) filter.isAvailable = available === 'true';
    const volunteers = await User.find(filter).select('-password');
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle availability
router.put('/availability', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isAvailable: req.body.isAvailable },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
