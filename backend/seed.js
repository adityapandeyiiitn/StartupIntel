require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('./models/Company');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/startup-intelligence';

const companiesPart1 = require('./data/companiesPart1');
const companiesPart2 = require('./data/companiesPart2');
const companiesPart3 = require('./data/companiesPart3');
const companiesPart4 = require('./data/companiesPart4');
const companiesPart5 = require('./data/companiesPart5');

const seedCompanies = [...companiesPart1, ...companiesPart2, ...companiesPart3, ...companiesPart4, ...companiesPart5];

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Seeding data...');
    await Company.deleteMany({});
    await Company.insertMany(seedCompanies);
    console.log('Successfully seeded companies!');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error seeding data:', err);
    mongoose.connection.close();
  });
