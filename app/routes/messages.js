const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET || 'superhemlig_nyckel';

// Middleware för att verifiera token
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Ingen token angiven' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Ogiltig token' });
  }
}

/* ============================================================
   POST /api/messages/send
============================================================ */
router.post('/send', auth, async (req, res) => {
  try {
    const { receiverId, adId, content } = req.body;

    if (!receiverId || !adId || !content) {
      return res.status(400).json({ error: 'Alla fält måste fyllas i' });
    }

    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      adId,
      content
    });

    await message.save();
    res.json({ message: 'Meddelandet har skickats!' });

  } catch (err) {
    console.error('Fel vid skickande av meddelande:', err);
    res.status(500).json({ error: 'Serverfel vid skickande av meddelande' });
  }
});

/* ============================================================
   GET /api/messages/inbox
============================================================ */
router.get('/inbox', auth, async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user.id })
      .populate('sender', 'name email')
      .populate('adId', 'title')
      .sort({ timestamp: -1 });

    res.json(messages);

  } catch (err) {
    console.error('Fel vid hämtning av inkorg:', err);
    res.status(500).json({ error: 'Serverfel vid hämtning av inkorg' });
  }
});

/* ============================================================
   GET /api/messages/sent
============================================================ */
router.get('/sent', auth, async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user.id })
      .populate('receiver', 'name email')
      .populate('adId', 'title')
      .sort({ timestamp: -1 });

    res.json(messages);

  } catch (err) {
    console.error('Fel vid hämtning av skickade meddelanden:', err);
    res.status(500).json({ error: 'Serverfel vid hämtning av skickade meddelanden' });
  }
});

/* ============================================================
   GET /api/messages/conversations
============================================================ */
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { receiver: userId }
          ]
        }
      },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: {
            adId: "$adId",
            otherUser: {
              $cond: [
                { $eq: ["$sender", userId] },
                "$receiver",
                "$sender"
              ]
            }
          },
          lastMessage: { $first: "$content" },
          timestamp: { $first: "$timestamp" },
          adId: { $first: "$adId" }
        }
      }
    ]);

    const populated = await Message.populate(conversations, [
      { path: "_id.otherUser", select: "name email" },
      { path: "adId", select: "title images price address" }
    ]);

    res.json(populated);

  } catch (err) {
    console.error("Fel vid hämtning av konversationer:", err);
    res.status(500).json({ error: "Serverfel vid hämtning av konversationer" });
  }
});

/* ============================================================
   GET /api/messages/thread/:otherUserId/:adId
============================================================ */
router.get('/thread/:otherUserId/:adId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId, adId } = req.params;

    const messages = await Message.find({
      adId,
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    })
      .sort({ timestamp: 1 })
      .populate('sender', 'name')
      .populate('receiver', 'name');

    res.json(messages);

  } catch (err) {
    console.error("Fel vid hämtning av chattråd:", err);
    res.status(500).json({ error: "Serverfel vid hämtning av chattråd" });
  }
});

module.exports = router;