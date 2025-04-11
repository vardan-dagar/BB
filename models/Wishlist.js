const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  genre: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  format: { 
    type: String, 
    enum: ['any', 'hardcover', 'paperback', 'ebook'], 
    default: 'any' 
  },
  reason: String,
  recommendedBy: String,
  fulfilled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wishlist', wishlistSchema);