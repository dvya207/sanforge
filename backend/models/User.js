import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: function () {
        // Name is only required if the document is NOT a temporary OTP record
        return !this.isTemp;
      },
    },
    password: {
      type: String,
      required: function () {
        // Password is only required if the document is NOT a temporary OTP record
        return !this.isTemp;
      },
    },
    profileImage: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    // ✅ New Field: Flag to mark temporary records for OTP verification
    isTemp: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
