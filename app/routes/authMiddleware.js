const jwt = require('jsonwebtoken');
const JWT_SECRET = 'superhemlig_nyckel'; // samma som i auth.js

module.exports = function (req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: 'Ingen token angiven' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Ogiltig token' });
  }
};