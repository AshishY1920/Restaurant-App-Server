const mongoose = require('mongoose');

const connection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connection;
