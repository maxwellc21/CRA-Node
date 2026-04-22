const mongoose = require('mongoose');

module.exports = async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongo connected for ${process.env.SERVICE_NAME}`);
  } catch (error) {
    console.error('Mongo connection error:', error.message);
    process.exit(1);
  }
};
