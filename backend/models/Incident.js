const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['flood', 'fire', 'earthquake', 'cyclone', 'landslide', 'tsunami', 'drought', 'other'],
    required: true
  },
  severity: { type: String, enum: ['low', 'moderate', 'high', 'critical'], default: 'moderate' },
  status: { type: String, enum: ['reported', 'active', 'responding', 'resolved'], default: 'reported' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
    address: { type: String }
  },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedResponders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  affectedPeople: { type: Number, default: 0 },
  photo: { type: String },
  isAnonymous: { type: Boolean, default: false },
  resolvedAt: { type: Date },
  updates: [{
    message: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

incidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', incidentSchema);
