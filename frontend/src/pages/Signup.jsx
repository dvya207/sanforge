import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../api/api";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import { UserPlus, Upload, CheckCircle, Mail, Key } from "lucide-react"; // Added Mail and Key icons

export default function Signup() {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: "",
  });
  const [otp, setOtp] = useState(""); // New state for OTP
  const [otpSent, setOtpSent] = useState(false); // New state to control OTP flow
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // === Mouse motion tracking (Existing code) ===
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
    "const form = useForm();",
    "axios.post('/signup', data);",
    "const [user, setUser] = useState(null);",
    "toast.success('Welcome!');",
    "return <Button label='Create' />;",
  ];

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "UI_generator");
    data.append("cloud_name", "dp2zvg5ze");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dp2zvg5ze/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const uploaded = await res.json();
      setForm(prev => ({ ...prev, profileImage: uploaded.secure_url }));
      toast.success("Profile image uploaded!");
    } catch {
      toast.error("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ New Handler: Send OTP for Signup
  const handleSendOtp = async () => {
    if (!form.email || uploading) return;

    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return toast.error("Please enter a valid email address.");
    }

    setUploading(true); // Reusing uploading state for OTP sending
    try {
      const res = await API.post(
        "/auth/send-signup-otp", // New endpoint
        { email: form.email }
      );
      if (res.data.otp) {
        setOtp(res.data.otp);
        toast.success(`OTP Sent! Code: ${res.data.otp}`);
      } else {
        toast.success(res.data.message || "OTP sent to your email!");
      }
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
      setOtpSent(false); // In case of failure
    } finally {
      setUploading(false);
    }

  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.profileImage)
      return toast.error("Please upload a profile image.");
    if (!otpSent) return toast.error("Please send and enter the OTP first.");
    if (otp.length !== 6) return toast.error("Please enter the 6-digit OTP.");

    try {
      // ✅ Updated submission: Send form data AND OTP for verification
      const res = await API.post(
        "/auth/signup",
        { ...form, otp } // Pass OTP with the form data
      );
      toast.success(res.data.message || "Signup successful!");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  if (!mounted) return null;

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden bg-black text-white font-inter flex items-center justify-center">
        {/* === Background Animated Code (Existing code) === */}
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

        {/* === Depth Gradients (Existing code) === */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.04),transparent_60%)]"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />

        {/* === Mouse Glow (Existing code) === */}
        <motion.div
          className="fixed top-0 left-0 w-[120px] h-[120px] rounded-full bg-white/10 blur-[60px] pointer-events-none z-30"
          style={{ x: glowX, y: glowY }}
        />

        {/* === Signup Card (Existing code structure) === */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ rotateX, rotateY }}
          className="relative z-20 w-full max-w-md bg-[#111]/90 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 shadow-2xl"
        >
          {!success ? (
            <>
              <div className="flex flex-col items-center mb-6">
                <UserPlus className="w-10 h-10 text-gray-300 mb-2" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
                  Create Account
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                  Join the new generation of UI creators ✨
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                />

                {/* ✅ Updated Email/OTP Section */}
                <div className="flex items-center space-x-2">
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    disabled={otpSent} // Disable email input once OTP is sent
                    className={`px-4 py-3 rounded-lg bg-white/10 border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none ${
                      otpSent ? "opacity-70" : "w-2/3"
                    }`}
                  />
                  {!otpSent && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={uploading || !form.email}
                      className="flex-1 px-4 py-3 rounded-lg bg-indigo-600 text-sm font-semibold hover:bg-indigo-700 transition duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                    >
                      {uploading ? (
                        "Sending..."
                      ) : (
                        <>
                          <Mail className="w-4 h-4" /> Send OTP
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* ✅ New OTP Input Field */}
                {otpSent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center relative"
                  >
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="6-digit OTP"
                      required
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      maxLength={6}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp("");
                      }} // Allow re-sending OTP
                      className="absolute right-3 text-xs text-red-400 hover:text-red-500"
                    >
                      Change Email
                    </button>
                  </motion.div>
                )}

                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                />

                {/* === Image Upload (Existing code) === */}
                {!form.profileImage ? (
                  <label className="flex items-center justify-center gap-2 py-3 w-full rounded-lg border border-dashed border-gray-600 text-gray-300 hover:text-white cursor-pointer hover:bg-white/5 transition">
                    <Upload className="w-4 h-4" />
                    {uploading ? "Uploading..." : "Upload Profile Image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex flex-col items-center">
                    <img
                      src={form.profileImage}
                      alt="profile"
                      className="w-20 h-20 object-cover rounded-full ring-2 ring-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, profileImage: "" })}
                      className="text-sm text-red-400 mt-2 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <motion.button
                  whileHover={{
                    scale: 1,
                    boxShadow: "0px 0px 20px skyblue",
                    border: "1px solid skyblue",
                    background: "rgba(135, 206, 235, 0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={uploading || !otpSent || otp.length !== 6} // Disable if not ready for signup
                  className={`w-full mt-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    uploading || !otpSent || otp.length !== 6
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-gray-600 to-gray-400 hover:shadow-gray-400/40 shadow-md"
                  }`}
                >
                  {uploading ? "Please wait..." : "Verify & Sign Up"}
                </motion.button>

                <p className="text-sm text-gray-400 text-center mt-4">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-gray-300 underline hover:text-white"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center text-center space-y-4"
            >
              <CheckCircle className="w-12 h-12 text-green-400" />
              <h2 className="text-2xl font-semibold text-gray-100">
                Signup Successful!
              </h2>
              <p className="text-gray-400">Redirecting to login...</p>
            </motion.div>
          )}
        </motion.div>

        <Toaster
          position="bottom-right"
          toastOptions={{ style: { background: "#111", color: "#fff" } }}
        />
      </div>
    </>
  );
}
