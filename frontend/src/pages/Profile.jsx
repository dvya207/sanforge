import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { API } from "../api/api";
import toast, { Toaster } from "react-hot-toast";
import { UploadCloud, Save, UserCircle2, Lock, X } from "lucide-react";
import Navbar from "../components/Navbar";

const Profile = () => {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // 3D tilt motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [0, window.innerHeight], [15, -15]);
  const rotateY = useTransform(mouseX, [0, window.innerWidth], [-15, 15]);
  const glowX = useTransform(mouseX, x => x - 125);
  const glowY = useTransform(mouseY, y => y - 125);

  const codeSnippets = [
    "const user = getUser();",
    "updateProfile(user);",
    "toast.success('Profile updated!');",
    "return <ProfileCard />;",
    "const [saving, setSaving] = useState(false);",
  ];

  useEffect(() => {
    setMounted(true);
    const handleMove = e => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile", { withCredentials: true });
        setUser(res.data.user);
        setName(res.data.user.name);
      } catch {
        toast.error("Failed to load profile.");
      }
    };
    fetchProfile();
  }, []);

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
        { method: "POST", body: data }
      );
      const uploaded = await res.json();
      setNewImage(uploaded.secure_url);
      toast.success("Profile image uploaded!");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) return toast.error("Name cannot be empty.");
    setSaving(true);
    try {
      const res = await API.put(
        "/auth/update-profile",
        { name, profileImage: newImage || user.profileImage },
        { withCredentials: true }
      );
      setUser(res.data.user);
      setNewImage(null);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("authChange"));
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async e => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return toast.error("New passwords do not match.");
    if (newPassword.length < 6)
      return toast.error("New password must be at least 6 characters.");
    setPasswordLoading(true);
    try {
      const res = await API.put(
        "auth/change-password",
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Password change failed. Check your current password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!mounted) return null;
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading profile...
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden bg-black text-white font-inter flex items-center justify-center">
        {/* Floating Code Background */}
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
              {codeSnippets[Math.floor(Math.random() * codeSnippets.length)]}
            </motion.div>
          ))}
        </div>

        {/* Gradient Background */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.04),transparent_60%)]"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />

        {/* Cursor Glow */}
        <motion.div
          className="fixed top-0 left-0 w-[120px] h-[120px] rounded-full bg-white/10 blur-[60px] pointer-events-none z-30"
          style={{ x: glowX, y: glowY }}
        />

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ rotateX, rotateY }}
          className="relative z-20 w-full max-w-md bg-[#111]/90 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 shadow-2xl text-center"
        >
          <div className="flex flex-col items-center mb-6">
            {/* <UserCircle2 className="w-10 h-10 text-gray-300 mb-2" /> */}
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
              {user.name}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Update your profile details.
            </p>
          </div>

          {/* Profile Image */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <img
              src={newImage || user.profileImage}
              alt="Profile"
              className="w-full h-full object-cover rounded-full ring-2 ring-gray-600"
            />
            <label className="absolute bottom-0 right-0 bg-gray-700 hover:bg-gray-600 p-2 rounded-full cursor-pointer transition">
              <UploadCloud className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Name Input */}
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-700 placeholder-gray-400 text-center focus:ring-2 focus:ring-gray-400 focus:outline-none"
          />

          {/* Email */}
          <div className="flex justify-between items-center my-4">
            Email:<p className="text-gray-400 ml-2"> {user.email}</p>
            {/* Change Password Button */}
            <button
              onClick={() => setIsChangingPassword(true)}
              className="w-full rounded-xl font-semiboldtransition-all duration-300 cursor-pointer text-blue-400 font-bold"
            >
              Change Password
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleUpdate}
            disabled={uploading || saving}
            className={`mt-3 w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              saving
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-gray-600 to-gray-400 hover:shadow-md"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </motion.div>

        {/* Password Modal */}
        {isChangingPassword && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm bg-[#151515] border border-gray-700 rounded-lg p-6 shadow-xl relative"
            >
              <button
                onClick={() => setIsChangingPassword(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold mb-5 text-center text-gray-200">
                Change Password
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="New Password (min 6 chars)"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    passwordLoading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-gray-600 to-gray-400 hover:shadow-md"
                  }`}
                >
                  {passwordLoading ? "Updating..." : "Confirm New Password"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        <Toaster
          position="bottom-right"
          toastOptions={{ style: { background: "#111", color: "#fff" } }}
        />
      </div>
    </>
  );
};

export default Profile;
