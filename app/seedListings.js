// seedListings.js
const mongoose = require('mongoose');
const Listing = require('./models/Listing');

const MONGO_URI = 'mongodb://kaytas-mongo:27017/kaytas';

const exampleListings = [
  {
    title: 'Modern lägenhet i Stockholm',
    description: 'Nyrenoverad 2:a i Vasastan med balkong och utsikt över innergården.',
    price: 14500,
    location: 'Stockholm',
    image: '/uploads/apartment1.jpg'
  },
  {
    title: 'Charmigt hus i Skåne',
    description: 'Ett mysigt torp på landet med stor trädgård och fruktträd.',
    price: 9800,
    location: 'Lund',
    image: '/uploads/house1.jpg'
  },
  {
    title: 'Studio nära havet i Göteborg',
    description: 'Perfekt för studenter. Gångavstånd till centrum och hamnen.',
    price: 8700,
    location: 'Göteborg',
    image: '/uploads/studio1.jpg'
  },
  {
    title: 'Exklusiv villa i Danderyd',
    description: 'Stor villa med pool, bastu och dubbla garage. För den kräsne.',
    price: 42000,
    location: 'Danderyd',
    image: '/uploads/villa1.jpg'
  },
  {
    title: 'Studentrum i Uppsala',
    description: 'Billigt och bra studentboende, nära universitetet.',
    price: 5600,
    location: 'Uppsala',
    image: '/uploads/room1.jpg'
  }
];

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Ansluten till MongoDB');
  await Listing.deleteMany({});
  await Listing.insertMany(exampleListings);
  console.log('Exempelannonser skapade!');
  mongoose.connection.close();
})
.catch(err => console.error('Fel vid anslutning:', err));