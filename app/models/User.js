const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  // Favoriter – referenser till Listing-objekt
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);