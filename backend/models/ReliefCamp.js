const mongoose = require('mongoose');

const reliefCampSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
    address: { type: String }
  },
  capacity: { type: Number, required: true },
  currentOccupancy: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'full', 'closed'], default: 'active' },
  facilities: [{
    type: String,
    enum: ['food', 'water', 'medical', 'sanitation', 'electricity', 'internet', 'childcare']
  }],
  managedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contactPhone: { type: String },
  relatedIncident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' }
}, { timestamps: true });

reliefCampSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('ReliefCamp', reliefCampSchema);
