require("dotenv").config();

const mongoose = require("mongoose");

async function testDatabase() {
  try {
    console.log("🔌 Testing MongoDB connection...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB authentication and connection successful");

    await mongoose.disconnect();
  } catch (error) {
    console.error("\n❌ MongoDB connection failed");
    console.error("Name:", error.name);
    console.error("Message:", error.message);

    if (error.reason?.servers) {
      console.error("\n🔍 Server details:");

      for (const [address, server] of error.reason.servers) {
        console.error(`\n${address}`);
        console.error("Type:", server.type);
        console.error("Error:", server.error?.message || "No server error");
      }
    }
  }
}

testDatabase();