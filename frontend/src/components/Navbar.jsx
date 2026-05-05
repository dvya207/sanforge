import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../api/api";
import { HiSun } from "react-icons/hi";
import { RiSettings3Fill } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  CircleUserRound,
  ChartNoAxesGantt,
  RotateCcwKey,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/profile", { withCredentials: true });
        if (res.data?.user) setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();

    const handleAuthChange = () => fetchUser();
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      window.dispatchEvent(new Event("authChange"));
      toast.success("Logged out successfully!");
      navigate("/");
    } catch {
      toast.error("Logout failed!");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/10 border-b mb-6 border-white/20 text-white shadow-lg">
      <div className="flex items-center justify-between px-10 py-2">
        {/* Logo */}
        {!user ? (
          <Link
            to="/"
            className="text-2xl font-bold tracking-wider text-blue-200 hover:text-blue-400 transition"
          >
            SanForge
          </Link>
        ) : (
          <Link
            to="/Uigen"
            className="text-2xl font-bold tracking-wider text-white hover:text-blue-400 transition"
          >
            SanForge
          </Link>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-8">
          {!user ? (
            <>
              <Link
                to="/signup"
                className="text-gray-300 hover:text-blue-400 transition font-medium"
              >
                Signup
              </Link>
              <Link
                to="/login"
                className="text-gray-300 hover:text-blue-400 transition font-medium"
              >
                Login
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {/* Profile button */}
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className="flex items-center gap-3 group"
              >
                <img
                  src={user.profileImage}
                  alt="profile"
                  className="w-9 h-9 rounded-full border border-blue-400 group-hover:ring-2 ring-blue-500 transition-all duration-200"
                />
                <span className="font-medium text-gray-200 group-hover:text-blue-400 transition">
                  {user.name}
                </span>
              </button>

              {/* Animated dropdown */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-48 bg-black border border-white/20 rounded-xl shadow-lg backdrop-blur-xl overflow-hidden"
                  >
                    <Link
                      to="/profile"
                      className="px-3 pt-3 pb-2 text-gray-200 hover:bg-gradient-to-r from-gray-600 to-gray-400 shadow-md text-white transition flex gap-2 font-bold"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <CircleUserRound /> Profile
                    </Link>
                    <Link
                      to="/saved"
                      className="px-3 pt-3 pb-2 text-gray-200 hover:bg-gradient-to-r from-gray-600 to-gray-400 shadow-md text-white transition flex gap-2 font-bold"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <ChartNoAxesGantt /> My UI's
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-gray-200 hover:bg-red-600/60 transition font-bold flex items-center gap-2"
                    >
                      <LogOut /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Theme + Settings */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
