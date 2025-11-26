const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Listing = require('../models/Listing');

const router = express.Router();

// Använder samma standard som auth.js och messages.js
const JWT_SECRET = process.env.JWT_SECRET || 'superhemlig_nyckel';

// --- Middleware ---
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Ingen token angiven' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Ogiltig token' });
  }
}

// --- GET /api/favorites ---
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    if (!user) return res.status(404).json({ message: 'Användare hittades ej' });

    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).json({ error: 'Serverfel: ' + err.message });
  }
});

// --- POST /api/favorites/:listingId ---
router.post('/:listingId', auth, async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Annons hittades ej' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Användare hittades ej' });

    if (!user.favorites.includes(listingId)) {
      user.favorites.push(listingId);
      await user.save();
    }

    const updated = await User.findById(req.user.id).populate('favorites');

    res.json({ 
      message: 'Favorit tillagd',
      favorites: updated.favorites 
    });

  } catch (err) {
    res.status(500).json({ error: 'Serverfel: ' + err.message });
  }
});

// --- DELETE /api/favorites/:listingId ---
router.delete('/:listingId', auth, async (req, res) => {
  try {
    const { listingId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Användare hittades ej' });

    user.favorites = user.favorites.filter(
      id => id.toString() !== listingId
    );
    await user.save();

    const updated = await User.findById(req.user.id).populate('favorites');

    res.json({
      message: 'Favorit borttagen',
      favorites: updated.favorites
    });

  } catch (err) {
    res.status(500).json({ error: 'Serverfel: ' + err.message });
  }
});

module.exports = router;