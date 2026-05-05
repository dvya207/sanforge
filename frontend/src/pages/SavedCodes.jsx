import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function SavedCodes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const codeLines = [
    "const magic = useAI();",
    "return <UIForge power='limitless' />;",
    "const glow = useMotionEffect();",
    "let creativity = infinite;",
    "while(true) { buildUI(); }",
  ];

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/saved/my-codes", {
        withCredentials: true,
      })
      .then(res => setItems(res.data))
      .catch(err => console.error("Failed to fetch saved codes:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <p className="text-white p-6 text-center text-xl animate-pulse">
        Loading...
      </p>
    );

  if (!items.length)
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white pt-20 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.12] select-none font-mono text-[11px] text-gray-200">
          {Array.from({ length: 35 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -45, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              NoCodeFound();
            </motion.div>
          ))}
        </div>

        {/* UI/Logo Glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-gray-700/20 via-white/10 to-gray-700/20 blur-[100px] rounded-full"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent text-center">
            No UI’s Created Yet
          </h2>

          <p className="text-gray-400 text-lg text-center max-w-sm">
            Start creating stunning UI templates using our builder!
          </p>

          <Link to={`/uigen`} className="w-full max-w-xs">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 20px skyblue",
                border: "1px solid skyblue",
                background: "rgba(135, 206, 235, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-gray-600 to-gray-400 shadow-md text-white text-lg"
            >
              Create Now
            </motion.button>
          </Link>
        </motion.div>

        {/* Footer */}
        <footer className="absolute bottom-6 text-center text-gray-500 text-sm z-10">
          © {new Date().getFullYear()} SanForge UI Generator
        </footer>
      </div>
    );

  return (
    <div className="relative min-h-screen overflow-hidden pt-20 bg-black text-white font-inter flex flex-col items-center p-6 ">
      {/* === Animated Background Code === */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.12] select-none font-mono text-[11px] text-gray-200 ">
        {Array.from({ length: 35 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.6, 1, 0.6],
            }}
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

      {/* === Subtle Gradient Movement Background === */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.04),transparent_60%)]"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* === Center Glow === */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-gray-700/10 via-white/10 to-gray-700/10 blur-[120px] rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* === Page Title === */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent"
      >
        My UI's
      </motion.h2>

      {/* === Cards Grid === */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl ">
        {items.map(item => (
          <motion.div
            key={item._id}
            className="relative bg-[#111]/90 backdrop-blur-md rounded-2xl shadow-2xl border-gray-400 hover:border-gray-600 transition-all duration-300 overflow-hidden cursor-pointer border-1 p-2 "
            // whileHover={{ scale: 1.05, rotateZ: 1 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {item.image ? (
              <motion.img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover overflow-hidden rounded-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-gray-400 text-lg">
                SanForge UI
              </div>
            )}
            <div className="p-5">
              <h3 className="font-semibold text-xl text-white mb-3">
                {item.title}
              </h3>
              <Link to={`/view/${item._id}`}>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 0px 20px skyblue ",
                    border: "1px solid skyblue",
                    background: "rgba(135, 206, 235, 0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full py-2 rounded-xl font-semibold bg-gradient-to-r from-gray-600 to-gray-400 shadow-md text-white"
                >
                  View Code
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* === Footer === */}
      <footer className="absolute bottom-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} SanForge UI Generator
      </footer>
    </div>
  );
}
