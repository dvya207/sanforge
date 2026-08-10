import mongoose from "mongoose";
import dns from "dns";

const connectDB = async () => {
  try {
    try {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (e) {
      console.warn("Could not set DNS servers:", e.message);
    }
    dns.setDefaultResultOrder("ipv4first");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("⚠️ MongoDB connection warning:", err.message);
  }
};

export default connectDB;
