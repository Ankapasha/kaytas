const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  // Titel
  title: { 
    type: String, 
    required: true 
  },

  // Beskrivning
  description: { 
    type: String, 
    required: true 
  },

  // Typ av bostad
  type: { 
    type: String, 
    default: 'apartment' // matchar frontend-select
  },

  // Pris
  price: { 
    type: Number, 
    required: true 
  },

  // Storlek, våning, hiss
  size: Number,
  floor: Number,
  hasElevator: { 
    type: Boolean, 
    default: false 
  },

  // Adress (viktigt! tidigare hette detta location)
  address: { 
    type: String, 
    required: true,
    index: true
  },

  // Bilder
  images: { 
    type: [String], 
    default: [] 
  },

  // Ägare av annonsen
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },

  // Tidsstämpel
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Listing', listingSchema);