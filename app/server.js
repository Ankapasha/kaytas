const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

/* ROUTES */
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const messageRoutes = require('./routes/messages');
const favoritesRoutes = require('./routes/favorites');

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* STATIC FRONTEND */
app.use(express.static(path.join(__dirname, 'public')));

/* DATABASE CONNECTION */
const MONGO_URI = process.env.MONGO_HOST || 'mongodb://kaytas-mongo:27017/kaytas';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Ansluten till MongoDB'))
.catch(err => {
    console.error('MongoDB-fel:', err);
    process.exit(1);
});

/* BACKEND API ROUTES */
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/favorites', favoritesRoutes);

/* WILDCARD ROUTE */
app.get('*', (req, res) => {
    const requested = path.join(__dirname, 'public', req.path);

    if (fs.existsSync(requested) && fs.lstatSync(requested).isFile()) {
        res.sendFile(requested);
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

/* START SERVER */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server körs på port ${PORT}`));