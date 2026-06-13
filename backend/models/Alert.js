const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['sos', 'evacuation', 'warning', 'info', 'resolved'], default: 'warning' },
  severity: { type: String, enum: ['low', 'moderate', 'high', 'critical'], default: 'moderate' },
  region: { type: String },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  relatedIncident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] },
    address: { type: String }
  },
  expiresAt: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
