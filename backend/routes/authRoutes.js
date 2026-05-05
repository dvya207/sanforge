import express from "express";
import {
  signup,
  login,
  getProfile,
  logout,
  updateProfile,
  sendOtp,
  resetPassword,
  sendSignupOtp, // ✅ Import the new controller
  changePassword,
} from "../controllers/authController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ New Route for Signup OTP
router.post("/send-signup-otp", sendSignupOtp);

// ✅ Signup (Updated controller handles OTP validation now)
router.post("/signup", signup);

// Existing routes (NO CHANGES)
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile); // Added middleware for profile access
router.post("/logout", logout);
router.put("/update-profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

// OTP routes (Forgot Password - Existing)
router.post("/send-otp", sendOtp); // authMiddleware removed as it's for unauthenticated password reset
router.post("/reset-password", resetPassword); // authMiddleware removed as it's for unauthenticated password reset

export default router;
