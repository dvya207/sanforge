import React, { useState, useEffect } from "react";
// Import useNavigate for redirection
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { API } from "../api/api";
import Navbar from "../components/Navbar";
import { Mail, Lock, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  // Initialize navigate
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // === Mouse motion tracking ===
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [0, window.innerHeight], [15, -15]);
  const rotateY = useTransform(mouseX, [0, window.innerWidth], [-15, 15]);
  const glowX = useTransform(mouseX, x => x - 125);
  const glowY = useTransform(mouseY, y => y - 125);

  useEffect(() => {
    setMounted(true);
    const handleMove = e => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  const codeSnippets = [
    "const reset = usePassword();",
    "await API.post('/reset-password');",
    "toast.success('Password updated!');",
    "useEffect(() => init(), []);",
    "<Button text='Confirm' />",
  ];

  // === Step 1: Send OTP ===
  const handleSendOTP = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/send-otp", { email });
      toast.success(res.data.message || "OTP sent to your registered email!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // === Step 2: Reset Password ===
  const handleResetPassword = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      toast.success(res.data.message || "Password updated successfully!");

      // *** START: UPDATED LOGIC FOR REDIRECTION ***
      setStep(3); // Show success message briefly

      // Redirect after a short delay to allow the toast/success state to show
      setTimeout(() => {
        // Replace '/profile' with your actual profile route
        navigate("/profile");
      }, 1500); // 1.5 second delay
      // *** END: UPDATED LOGIC FOR REDIRECTION ***

      setEmail("");
      setOtp("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center font-inter">
        {/* === Floating Code Background === */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.15] select-none font-mono text-[11px] text-gray-200">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ y: [0, -50, 0], opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {codeSnippets[Math.floor(Math.random() * codeSnippets.length)]}
            </motion.div>
          ))}
        </div>

        {/* === Subtle Moving Gradient Background === */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.04),transparent_60%)]"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />

        {/* === Mouse Glow === */}
        <motion.div
          className="fixed top-0 left-0 w-[120px] h-[120px] rounded-full bg-white/10 blur-[60px] pointer-events-none z-30"
          style={{ x: glowX, y: glowY }}
        />

        {/* === Main Forgot Password Card === */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ rotateX, rotateY }}
          className="relative z-20 w-full max-w-md bg-[#111]/90 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 shadow-2xl"
        >
          {step === 1 && (
            <>
              <div className="flex flex-col items-center mb-6">
                <Mail className="w-10 h-10 text-gray-300 mb-2" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
                  Forgot Password
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                  Enter your registered email to receive an OTP ✉️
                </p>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-5">
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    loading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-gray-600 to-gray-400 hover:scale-[1.02]"
                  }`}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex flex-col items-center mb-6">
                <Lock className="w-10 h-10 text-gray-300 mb-2" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
                  Reset Password
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                  Enter the OTP sent to your email and set a new password 🔒
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    loading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-gray-600 to-gray-400 hover:scale-[1.02]"
                  }`}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}

          {/* Step 3 is now a temporary success message before redirection */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center text-center space-y-4"
            >
              <CheckCircle className="w-12 h-12 text-green-400" />
              <h2 className="text-2xl font-semibold text-gray-100">
                Password Reset Successful!
              </h2>
              <p className="text-gray-400">
                Redirecting you to the profile page... 🚀
              </p>
            </motion.div>
          )}
        </motion.div>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: "#111", color: "#fff" },
          }}
        />
      </div>
    </>
  );
}
