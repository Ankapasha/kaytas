const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Samma nyckel som i favorites.js
const JWT_SECRET = process.env.JWT_SECRET || 'superhemlig_nyckel';

// Middleware – verifiera JWT
function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Ingen token angiven' });

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;  // ENHETLIGT för hela systemet
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Ogiltig eller utgången token' });
  }
}

/* -------------------- REGISTRERING -------------------- */
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Alla fält krävs' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ error: 'E-postadressen används redan' });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashed
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registrering lyckades',
      token,
      user: {
        id: newUser._id,
        email: newUser.email
      }
    });

  } catch (err) {
    console.error('Fel vid registrering:', err);
    res.status(500).json({ error: 'Serverfel vid registrering' });
  }
});

/* -------------------- LOGIN -------------------- */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Fel e-post eller lösenord' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Fel e-post eller lösenord' });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Inloggning lyckades',
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Fel vid inloggning:', err);
    res.status(500).json({ error: 'Serverfel vid inloggning' });
  }
});

/* -------------------- HÄMTA PROFIL -------------------- */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user)
      return res.status(404).json({ error: 'Användaren hittades inte' });

    res.json(user);

  } catch (err) {
    console.error('Fel vid hämtning av användardata:', err);
    res.status(500).json({ error: 'Serverfel vid hämtning av data' });
  }
});

module.exports = router;