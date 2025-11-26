const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'superhemlig_nyckel';

/* ------------------- AUTH MIDDLEWARE ------------------- */
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Ingen token angiven' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: 'Ogiltig token' });
  }
}

/* ------------------- SKAPA ANNONS ------------------- */
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, type, price, size, floor, hasElevator, address, images } = req.body;

    let imageArray = [];
    if (Array.isArray(images)) {
      imageArray = images;
    } else if (typeof images === 'string' && images.trim() !== '') {
      imageArray = images.split(',').map(i => i.trim());
    }

    const listing = new Listing({
      title,
      description,
      type,
      price,
      size,
      floor,
      hasElevator,
      address,          // <-- FIX HERE (tidigare location)
      images: imageArray,
      owner: req.userId
    });

    await listing.save();
    res.json({ message: 'Annons skapad', listing });

  } catch (err) {
    console.error('Fel vid skapande av annons:', err);
    res.status(500).json({ error: 'Serverfel vid skapande av annons' });
  }
});

/* ------------------- UPPDATERA ANNONS ------------------- */
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, type, price, size, floor, hasElevator, address, images } = req.body;

    let imageArray = [];
    if (Array.isArray(images)) {
      imageArray = images;
    } else if (typeof images === 'string' && images.trim() !== '') {
      imageArray = images.split(',').map(i => i.trim());
    }

    const updated = await Listing.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId }, // endast dina egna
      {
        title,
        description,
        type,
        price,
        size,
        floor,
        hasElevator,
        address,
        images: imageArray
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Annons hittades ej eller så äger du den inte' });

    res.json({ message: 'Annons uppdaterad', listing: updated });

  } catch (err) {
    console.error('Fel vid uppdatering:', err);
    res.status(500).json({ error: 'Serverfel vid uppdatering' });
  }
});

/* ------------------- MINA ANNONSER ------------------- */
router.get('/mine', auth, async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    console.error('Fel vid hämtning av mina annonser:', err);
    res.status(500).json({ error: 'Serverfel vid hämtning av mina annonser' });
  }
});

/* ------------------- HÄMTA ALLA ANNONSER ------------------- */
router.get('/', async (req, res) => {
  try {
    const { type, minPrice, maxPrice, address } = req.query;

    let query = {};

    if (type) query.type = type;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (address) {
      const regex = new RegExp(address, 'i');
      query.$or = [
        { address: regex },   // <-- FIX HERE
        { title: regex },
        { description: regex }
      ];
    }

    const listings = await Listing.find(query)
      .populate('owner', 'email')
      .sort({ createdAt: -1 });

    res.json(listings);

  } catch (err) {
    console.error('Fel vid hämtning av annonser:', err);
    res.status(500).json({ error: 'Serverfel vid hämtning' });
  }
});

/* ------------------- HÄMTA SPECIFIK ANNONS ------------------- */
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'email');

    if (!listing) return res.status(404).json({ error: 'Annonsen hittades inte' });

    res.json(listing);

  } catch (err) {
    console.error('Fel vid hämtning av annons:', err);
    res.status(500).json({ error: 'Serverfel vid hämtning av annons' });
  }
});

/* ------------------- TA BORT ANNONS ------------------- */
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Listing.findOneAndDelete({ _id: req.params.id, owner: req.userId });

    if (!deleted) {
      return res.status(404).json({ message: 'Annonsen hittades inte eller så äger du den inte' });
    }

    res.json({ message: 'Annons borttagen' });

  } catch (err) {
    console.error('Fel vid borttagning:', err);
    res.status(500).json({ error: 'Serverfel vid borttagning' });
  }
});

module.exports = router;