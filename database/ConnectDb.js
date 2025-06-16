
const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ DB Connected Successfully");
  } catch (error) {
    console.error("❌ DB Connection Failed");
    console.error("Reason :", error.message);
  }
};

module.exports = connectDb;
