const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// === Sökväg för uppladdade filer ===
const uploadDir = path.join(__dirname, '../../app/public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// === Multer-inställningar ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { files: 5, fileSize: 5 * 1024 * 1024 }, // max 5 filer, 5 MB vardera
});

// === POST /api/uploads (en bild) ===
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Ingen fil mottagen' });
  const filePath = '/uploads/' + req.file.filename;
  res.json({ message: 'Uppladdning lyckades', filePath });
});

// === POST /api/uploads/multiple (flera bilder) ===
router.post('/multiple', upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0)
    return res.status(400).json({ error: 'Inga filer mottagna' });

  const filePaths = req.files.map(f => '/uploads/' + f.filename);
  res.json({ message: 'Flera uppladdningar lyckades', filePaths });
});

// === GET /api/uploads/:filename (visa bild direkt) ===
router.get('/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Filen hittades inte' });
  }
  res.sendFile(filePath);
});

module.exports = router;