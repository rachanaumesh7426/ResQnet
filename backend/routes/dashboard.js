const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const Resource = require('../models/Resource');
const User = require('../models/User');
const ReliefCamp = require('../models/ReliefCamp');
const Alert = require('../models/Alert');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, async (req, res) => {
  try {
    const [
      totalIncidents,
      activeIncidents,
      resolvedIncidents,
      criticalIncidents,
      totalVolunteers,
      availableVolunteers,
      totalResources,
      activeCamps,
      activeAlerts,
    ] = await Promise.all([
      Incident.countDocuments(),
      Incident.countDocuments({ status: { $in: ['active', 'responding'] } }),
      Incident.countDocuments({ status: 'resolved' }),
      Incident.countDocuments({ severity: 'critical' }),
      User.countDocuments({ role: 'responder' }),
      User.countDocuments({ role: 'responder', isAvailable: true }),
      Resource.countDocuments(),
      ReliefCamp.countDocuments({ status: 'active' }),
      Alert.countDocuments({ isActive: true }),
    ]);

    // Incidents by type
    const incidentsByType = await Incident.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Incidents over last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const incidentsOverTime = await Incident.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Resource availability
    const resourcesByType = await Resource.aggregate([
      { $group: { _id: '$type', total: { $sum: '$quantity' }, count: { $sum: 1 } } }
    ]);

    res.json({
      overview: {
        totalIncidents, activeIncidents, resolvedIncidents, criticalIncidents,
        totalVolunteers, availableVolunteers, totalResources, activeCamps, activeAlerts
      },
      incidentsByType,
      incidentsOverTime,
      resourcesByType
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
