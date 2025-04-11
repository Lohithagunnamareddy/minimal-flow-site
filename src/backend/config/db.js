
// backend/config/db.js
const mongoose = require('mongoose');

/**
 * Connect to MongoDB
 * Establishes connection to the MongoDB database
 * @returns {Promise} - MongoDB connection promise
 */
const connectDB = async () => {
  try {
    // MongoDB connection string - in production would be in environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campus_bridge', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
