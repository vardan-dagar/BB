const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: [
      'pending', 
      'shipped', 
      'delivered', 
      'return-requested', 
      'return-in-progress', 
      'return-completed',
      'return-delayed'
    ], 
    required: true 
  },
  daysLeft: { type: Number, default: 7 },
  updates: [{
    status: String,
    date: { type: Date, default: Date.now },
    notes: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tracking', trackingSchema);