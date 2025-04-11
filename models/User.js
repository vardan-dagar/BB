const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  preferences: {
    theme: { type: String, default: 'light' },
    notificationEnabled: { type: Boolean, default: true },
    language: { type: String, default: 'english' }
  },
  booksShared: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  booksBorrowed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);