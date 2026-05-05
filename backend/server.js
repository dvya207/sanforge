import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import savedRoutes from "./routes/savedRoutes.js";

dotenv.config();
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

// ✅ Allow credentials (important!)
app.use(
  cors({
    origin: "http://localhost:5173", // adjust if your frontend runs elsewhere
    credentials: true,
  })
);

// ✅ Connect DB
connectDB();

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/saved", savedRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
