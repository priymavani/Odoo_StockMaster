const mongoose = require('mongoose');

async function connectDB() {
  if(process.env.NODE_ENV ?console.log('Environment:', process.env.NODE_ENV) : false) ;
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI environment variable is required');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    autoIndex: true,
  });

  console.log('Connected to MongoDB');
}

module.exports = connectDB;
