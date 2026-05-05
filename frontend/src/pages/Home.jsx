import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, Sparkles, Code2, Layers, Zap } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // === Mouse Tracking Motion Values ===
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // === Derived Motion Values ===
  const rotateX = useTransform(mouseY, [0, window.innerHeight], [15, -15]);
  const rotateY = useTransform(mouseX, [0, window.innerWidth], [-15, 15]);
  const glowX = useTransform(mouseX, x => x - 125);
  const glowY = useTransform(mouseY, y => y - 125);

  // === Mouse Move Event ===
  useEffect(() => {
    setMounted(true);
    const handleMouseMove = e => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  const codeSnippets = [
    "const Button = ({ label }) => <button>{label}</button>;",
    "useEffect(() => fetchData(), []);",
    "const [count, setCount] = useState(0);",
    "return <div className='app-container'></div>;",
    "const handleClick = () => console.log('clicked');",
    "const theme = useTheme();",
    "const { data, error } = useFetch('/api');",
  ];

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden bg-black text-white font-inter">
        {/* === Subtle Animated Code Background === */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.15] select-none font-mono text-[11px] text-gray-200">
          {Array.from({ length: 40 }).map((_, i) => (
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
              {codeSnippets[Math.floor(Math.random() * codeSnippets.length)]}
            </motion.div>
          ))}
        </div>

        {/* === Soft Gradient Light for Depth === */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.04),transparent_60%)]"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />

        {/* === Mouse Follow Glow Effect (Fixed Hook Order) === */}
        <motion.div
          className="fixed top-0 left-0 w-[120px] h-[120px] rounded-full bg-white/10 blur-[60px] pointer-events-none z-30"
          style={{ x: glowX, y: glowY }}
          transition={{ type: "spring", stiffness: 120, damping: 25 }}
        />

        {/* === Floating Center Glow === */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-gray-700/10 via-white/10 to-gray-700/10 blur-[120px] rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        {/* === Hero Section === */}
        <motion.main
          className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20"
          style={{ rotateX, rotateY }}
        >
          <AnimatePresence>
            <motion.h2
              key="title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent leading-tight"
            >
              Generate Stunning UIs <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  transition: { duration: 3, repeat: Infinity },
                }}
              >
                in Seconds ✨
              </motion.span>
            </motion.h2>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 max-w-2xl text-lg text-gray-400"
          >
            Design smarter, not harder. Build production-ready interfaces using
            AI-powered generation, just like coding magic.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-4 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            // transition={{ delay: 0.6 }}
            whileHover={{
              scale: 1,
              boxShadow: "0px 0px 20px skyblue ",
              border: "1px solid skyblue",
              background: "rgba(135, 206, 235, 0.2)",
            }}
          >
            <Link to="/signup">
              {/* className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-300
              rounded-2xl text-lg font-semibold shadow-lg
              hover:shadow-gray-400/30" */}
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-black rounded-2xl text-lg font-semibold shadow-lg hover:shadow-gray-400/30 hover:bg-black hover:text-white">
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </motion.main>

        {/* === Features Section === */}
        <section className="relative z-10 grid md:grid-cols-3 gap-6 px-8 py-15 max-w-6xl mx-auto">
          {[
            {
              icon: <Sparkles className="w-7 h-7 text-gray-300" />,
              title: "AI-Powered Generation",
              desc: "Instantly craft layouts, components, and pages using smart prompts.",
            },
            {
              icon: <Code2 className="w-7 h-7 text-gray-300" />,
              title: "Clean, Editable Code",
              desc: "Export fully responsive React + Tailwind code that’s developer-friendly.",
            },
            {
              icon: <Layers className="w-7 h-7 text-gray-300" />,
              title: "Modular & Scalable",
              desc: "Every component is structured, modular, and ready to scale effortlessly.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1,
                boxShadow: "0px 0px 20px skyblue ",
                border: "1px solid skyblue",
                background: "rgba(135, 206, 235, 0.2)",
                rotateY: 5,
              }}
              className="p-6 bg-[#111]/90 rounded-2xl backdrop-blur-md border border-gray-800 hover:border-gray-600 transition group"
            >
              <div className="mb-4">{card.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-400 text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </section>
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative z-10 flex justify-center py-10 px-6"
        >
          <motion.div
            className="max-w-5xl w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-100 mr-110"
            // style={{ rotateX, rotateY }} // ⭐ same tilt as Hero
            animate={{ scale: [1, 1.02, 1] }} // ⭐ gentle floating
            transition={{ duration: 6, repeat: Infinity }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 20px skyblue ",
              border: "1px solid skyblue",
              background: "rgba(135, 206, 235, 0.2)",
            }}
          >
            <h1 className="text-2xl font-bold text-blue-400 text-center my-4 ">
              Generate UI Section
            </h1>
            <motion.img
              src="/images/UI.png" // your image path
              alt="AI Agent Showcase"
              className="w-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4 }}
            />
          </motion.div>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative z-10 flex justify-center pb-10 ml-110"
        >
          <motion.div
            className="max-w-5xl w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
            // style={{ rotateX, rotateY }} // ⭐ same tilt as Hero
            animate={{ scale: [1, 1.02, 1] }} // ⭐ gentle floating
            transition={{ duration: 6, repeat: Infinity }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 20px skyblue ",
              border: "1px solid skyblue",
              background: "rgba(135, 206, 235, 0.2)",
            }}
          >
            <h1 className="text-2xl font-bold text-blue-400 text-center my-4">
              Generated Components
            </h1>
            <motion.img
              src="/images/UI2.png" // your image path
              alt="AI Agent Showcase"
              className="w-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4 }}
            />
          </motion.div>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative z-10 flex justify-center pb-10  mr-110"
        >
          <motion.div
            className="max-w-5xl w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
            // style={{ rotateX, rotateY }} // ⭐ same tilt as Hero
            animate={{ scale: [1, 1.02, 1] }} // ⭐ gentle floating
            transition={{ duration: 6, repeat: Infinity }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 20px skyblue ",
              border: "1px solid skyblue",
              background: "rgba(135, 206, 235, 0.2)",
            }}
          >
            <h1 className="text-2xl font-bold text-blue-400 text-center my-4">
              Generated Code
            </h1>
            <motion.img
              src="/images/UI3.png" // your image path
              alt="AI Agent Showcase"
              className="w-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4 }}
            />
          </motion.div>
        </motion.section>

        {/* === CTA Section === */}

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="relative z-10 flex flex-col items-center justify-center text-center py-24"
        >
          <h3 className="text-3xl md:text-4xl font-extrabold mb-6 text-white">
            Start Creating Beautiful UIs Today
          </h3>
          <p className="max-w-xl text-gray-400 mb-8">
            No setup, no hassle — just pure creation. Let your imagination build
            the next big thing.
          </p>
          <Link to="/signup">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 20px skyblue ",
                border: "1px solid skyblue",
                background: "rgba(0, 0, 0, 0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4  text-white rounded-2xl text-lg font-semibold border-1 hover:shadow-gray-400/30 hover:bg-black hover:text-white"
            >
              Launch Generator <Zap className="inline-block ml-2 w-5 h-5" />
            </motion.button>
          </Link>
        </motion.section>

        {/* === Footer === */}
        <footer className="text-center text-gray-500 py-10 border-t border-gray-800/50 relative z-10">
          © {new Date().getFullYear()} SanForge UI Generator
        </footer>
      </div>
    </>
  );
}
