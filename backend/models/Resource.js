const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['food', 'water', 'medicine', 'shelter', 'vehicle', 'equipment', 'clothing', 'other'],
    required: true
  },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, default: 'units' },
  status: { type: String, enum: ['available', 'in-use', 'depleted'], default: 'available' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] },
    address: { type: String }
  },
  managedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
  notes: { type: String }
}, { timestamps: true });

resourceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Resource', resourceSchema);
