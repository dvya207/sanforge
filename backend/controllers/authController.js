import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

// ✅ New Controller: Send OTP for Signup
// ✅ New Controller: Send OTP for Signup
export const sendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });

    // Check if the email is already registered as a complete user (has a name/password)
    // If user exists AND has a name (meaning it's a fully signed-up user), reject.
    if (user && user.name) {
      return res.status(400).json({ message: "User already exists" });
    }

    // If the user doesn't exist (is null), create a new temporary record.
    if (!user) {
      // Use isTemp: true to bypass name/password validation
      user = await User.create({ email, isTemp: true });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP and expiry (5 minutes)
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    // Ensure isTemp is true in case we found an old temporary record
    user.isTemp = true;

    await user.save();

    console.log(`🔑 [OTP GENERATED] for ${email}: ${otp}`);

    await sendEmail(
      email,
      "Email Verification OTP - SanForge Signup",
      `
        <h2>Verify Your Email</h2>
        <p>Your OTP for signing up is:</p>
        <h1 style="letter-spacing:4px;">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      `
    );


    res.json({
      message: "OTP sent to your email successfully",
      otp,
    });
  } catch (err) {

    console.error("Error sending signup OTP:", err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

// ✅ New Controller: Change Password for Logged-in Users
export const changePassword = async (req, res) => {
  try {
    // The user ID is obtained from the token via the authMiddleware
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } // 1. Verify Current Password

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    } // 2. Hash New Password

    const hashedPassword = await bcrypt.hash(newPassword, 10); // 3. Update Password

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({
      message: "Server error during password change.",
      error: err.message,
    });
  }
};

// ✅ Updated Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, profileImage, otp } = req.body; // Expect OTP here

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Email not found or OTP not requested" });
    }

    // Check OTP
    if (user.otp !== otp || Date.now() > user.otpExpiry) {
      // If OTP fails, remove the invalid OTP
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP is valid, proceed with final signup data
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the existing (possibly temporary) user record with final details
    user.name = name;
    user.password = hashedPassword;
    user.profileImage = profileImage;
    user.otp = undefined; // Clear OTP fields
    user.otpExpiry = undefined;

    // If you used a temporary flag, clear it here:
    // user.isTemp = undefined;

    await user.save();

    res.status(201).json({ message: "Signup successful", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(404).json({ message: "User not found or account setup incomplete" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// ✅ Get Profile (Existing code - NO CHANGES)
export const getProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Update Profile (Existing code - NO CHANGES)
export const updateProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, profileImage } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { name, profileImage },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

// ✅ Send OTP (Forgot Password) (Existing code - NO CHANGES)
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body; // 1. Input Validation

    if (!email || typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({ message: "Valid email is required." });
    } // 2. Check User Existence (Security-Enhanced)

    const user = await User.findOne({ email }); // Return success message even if user not found to prevent enumeration attacks
    if (!user) {
      console.log(`INFO: OTP request for non-existent email: ${email}`);
      return res.json({
        message: "If the email is registered, you will receive an OTP shortly.",
      });
    } // 3. Generate and Store OTP

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
    await user.save(); // 4. Send Email

    console.log(`🔑 [RESET OTP GENERATED] for ${email}: ${otp}`);

    await sendEmail(
      email,
      "Password Reset OTP - SanForge",
      `
        <h2>Reset Your Password</h2>
        <p>Your OTP for resetting your password is:</p>
        <h1 style="letter-spacing:4px;">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      `
    );


    res.json({
      message: "If the email is registered, you will receive an OTP shortly.",
      otp,
    });
  } catch (err) {

    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

// ✅ Reset Password (Existing code - NO CHANGES)
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res
      .status(500)
      .json({ message: "Failed to reset password", error: err.message });
  }
};
