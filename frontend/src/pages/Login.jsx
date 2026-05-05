import React, { useState, useEffect } from "react";
import { API } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { IoMdLogIn } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { Mail, Lock, X } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotForm, setForgotForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP/Password
  const [forgotLoading, setForgotLoading] = useState(false);

  // Mouse motion & glow effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 25 });
  const rotateX = useTransform(mouseY, [0, window.innerHeight], [15, -15]);
  const rotateY = useTransform(mouseX, [0, window.innerWidth], [-15, 15]);

  useEffect(() => {
    const handleMove = e => {
      mouseX.set(e.clientX - 60);
      mouseY.set(e.clientY - 60);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  // Login submit handler
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form, {
        withCredentials: true,
      });
      if (res.data?.user) window.dispatchEvent(new Event("authChange"));
      toast.success("Login successful!");
      navigate("/Uigen");
    } catch (err) {
      const status = err.response?.status;
      const apiMessage = err.response?.data?.message;

      if (status === 401 || apiMessage) {
        toast.error(apiMessage || "Username or password incorrect");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Forgot password: Send OTP
  const handleSendOtp = async e => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const res = await API.post("/auth/send-otp", { email: forgotForm.email });
      toast.success(res.data.message);
      setForgotStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setForgotLoading(false);
    }
  };

  // Forgot password: Reset password
  const handleResetPassword = async e => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const res = await API.post("/auth/reset-password", forgotForm);
      toast.success(res.data.message || "Password reset successful!");
      setIsForgotModalOpen(false);
      setForgotStep(1);
      setForgotForm({ email: "", otp: "", newPassword: "" });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Password reset failed. Check OTP/email."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  // Random background code lines
  const codeLines = [
    "const magic = useAI();",
    "return <UIForge power='limitless' />;",
    "const glow = useMotionEffect();",
    "let creativity = infinite;",
    "while(true) { buildUI(); }",
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white font-inter flex items-center justify-center">
      {/* Animated code background */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.15] select-none font-mono text-[11px] text-gray-200">
        {Array.from({ length: 35 }).map((_, i) => (
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
            {codeLines[Math.floor(Math.random() * codeLines.length)]}
          </motion.div>
        ))}
      </div>

      {/* Gradient background */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.04),transparent_60%)]"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* Mouse glow */}
      <motion.div
        className="fixed top-0 left-0 w-[120px] h-[120px] rounded-full bg-white/10 blur-[60px] pointer-events-none z-30"
        style={{ x: smoothX, y: smoothY }}
      />

      {/* Center floating glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-gray-700/10 via-white/10 to-gray-700/10 blur-[120px] rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Login Card */}
      <motion.div
        style={{ rotateX, rotateY }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 w-full max-w-md bg-[#111]/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-800 hover:border-gray-600 transition-all duration-300"
      >
        <AnimatePresence>
          <motion.h2
            key="title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent"
          >
            Login
          </motion.h2>
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.input
            whileFocus={{ scale: 1.03 }}
            type="email"
            placeholder="Email"
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/60 transition"
          />

          <motion.input
            whileFocus={{ scale: 1.03 }}
            type="password"
            placeholder="Password"
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/60 transition"
          />

          {/* Forgot Password Link */}
          <button
            type="button"
            onClick={() => setIsForgotModalOpen(true)}
            className="text-sm text-gray-400 hover:text-white transition block text-right w-full"
          >
            Forgot Password?
          </button>

          <motion.button
            whileHover={{
              scale: 1,
              boxShadow: "0px 0px 20px skyblue",
              border: "1px solid skyblue",
              background: "rgba(135, 206, 235, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full mt-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-gray-600 to-gray-400 hover:shadow-gray-400/40 shadow-md"
            }`}
          >
            <IoMdLogIn className="text-lg" />
            {loading ? "Logging in..." : "Login"}
          </motion.button>

          <p className="text-sm text-center text-gray-400 mt-4">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-gray-300 hover:text-white underline transition"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="w-full max-w-sm bg-[#151515] border border-gray-700 rounded-lg p-6 shadow-xl relative"
            >
              <button
                onClick={() => {
                  setIsForgotModalOpen(false);
                  setForgotStep(1);
                  setForgotForm({ email: "", otp: "", newPassword: "" });
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-bold mb-4 text-center text-gray-200 flex items-center justify-center gap-2">
                <Lock className="w-6 h-6" /> Password Reset
              </h3>

              <p className="text-sm text-gray-400 text-center mb-6">
                {forgotStep === 1
                  ? "Enter your email to receive a password reset OTP."
                  : "Check your inbox for the OTP and set a new password."}
              </p>

              {forgotStep === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Registered Email"
                      value={forgotForm.email}
                      onChange={e =>
                        setForgotForm({ ...forgotForm, email: e.target.value })
                      }
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/60 transition"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={forgotLoading}
                    whileHover={{ scale: 1.01 }}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                      forgotLoading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-700 to-blue-500 hover:shadow-blue-500/50 shadow-md"
                    }`}
                  >
                    {forgotLoading ? "Sending OTP..." : "Send Reset Link"}
                  </motion.button>
                </form>
              )}

              {forgotStep === 2 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <input
                    type="text"
                    placeholder="6-Digit OTP"
                    value={forgotForm.otp}
                    onChange={e =>
                      setForgotForm({ ...forgotForm, otp: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/60 transition"
                  />

                  <input
                    type="password"
                    placeholder="New Password (min 6 chars)"
                    value={forgotForm.newPassword}
                    onChange={e =>
                      setForgotForm({
                        ...forgotForm,
                        newPassword: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/60 transition"
                  />

                  <motion.button
                    type="submit"
                    disabled={forgotLoading}
                    whileHover={{ scale: 1.01 }}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                      forgotLoading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-700 to-blue-500 hover:shadow-blue-500/50 shadow-md"
                    }`}
                  >
                    {forgotLoading ? "Resetting Password..." : "Reset Password"}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="absolute bottom-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} SanForge UI Generator
      </footer>

      <Toaster />
    </div>
  );
};

export default Login;
