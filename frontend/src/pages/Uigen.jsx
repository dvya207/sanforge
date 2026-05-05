import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import { IoCloseSharp, IoCopy } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { FiRefreshCcw } from "react-icons/fi";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import axios from "axios";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { API } from "../api/api";
import { Link } from "react-router-dom";

const Uigen = () => {
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind CSS" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" },
    { value: "html-css-js", label: "HTML + CSS + JS" },
    { value: "html-tailwind-bootstrap", label: "HTML + Tailwind + Bootstrap" },
    { value: "react-tailwind", label: "React + Tailwind" },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [upgradePrompt, setUpgradePrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [genCode, setGenCode] = useState(false);
  const [loading, setLoading] = useState(false); // Used for GENERATE
  const [upgradeLoading, setUpgradeLoading] = useState(false); // NEW: Used for UPGRADE
  const [refreshKey, setRefreshKey] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [history, setHistory] = useState([]); // version history for undo

  const genAI = useMemo(
    () => new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY),
    []
  );

  //fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/profile", { withCredentials: true });
        if (res.data?.user) setUser(res.data.user);
        console.log(res.data.user?.name);
      } catch {
        setUser(null);
      }
    };
    fetchUser();

    const handleAuthChange = () => fetchUser();
    window.addEventListener("authChange", handleAuthChange);

    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  const codeSnippets = [
    "const Button = ({ label }) => <button>{label}</button>;",
    "useEffect(() => fetchData(), []);",
    "const [count, setCount] = useState(0);",
    "return <div className='app-container'></div>;",
    "const handleClick = () => console.log('clicked');",
  ];

  const extractCode = response => {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  };

  const fileToBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const uploadToCloudinary = async file => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    return res.data.secure_url;
  };

  const generateContentWithRetry = async (
    model,
    contents,
    retries = 3,
    delay = 2000
  ) => {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await model.generateContent({ contents });
        return result;
      } catch (err) {
        if (
          err?.message?.includes("503") ||
          err?.message?.includes("overloaded")
        ) {
          if (i < retries - 1) {
            toast.warn("Model overloaded, retrying...");
            await new Promise(res => setTimeout(res, delay * (i + 1)));
          } else {
            throw new Error(
              "Model is currently overloaded. Please try again later."
            );
          }
        } else {
          throw err;
        }
      }
    }
  };

  const getResponse = async () => {
    if (!prompt.trim())
      return toast.error("Please describe your component first");

    try {
      setLoading(true);
      let imageData = null;

      if (imageFile) {
        // upload image to cloudinary (keeps existing flow)
        await uploadToCloudinary(imageFile);
        const base64 = await fileToBase64(imageFile);
        imageData = {
          inlineData: { mimeType: imageFile.type, data: base64.split(",")[1] },
        };
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const contentParts = [
        {
          role: "user",
          parts: [
            {
              text: `
You are an expert UI/UX developer.
Generate a ${frameWork.label} component for:
${prompt}
It should be responsive, aesthetic, and include smooth transitions. 
Return only clean code.`,
            },
          ],
        },
      ];

      if (imageData) contentParts[0].parts.push(imageData);

      const result = await generateContentWithRetry(model, contentParts);
      const responseText = result.response.text();
      const extracted = extractCode(responseText);

      // push previous code to history if any
      setHistory(prev => (code.trim() ? [...prev, code] : prev));
      setCode(extracted);
      setOutputScreen(true);
      setGenCode(true);
      toast.success("Code generated.");
    } catch (error) {
      console.error("Gemini API Error:", error);
      toast.error(
        error?.message || "Error generating UI. Check your API key or image."
      );
    } finally {
      setLoading(false);
    }
  };

  const upgradeCode = async () => {
    if (!upgradePrompt.trim())
      return toast.error("Enter instructions to upgrade code!");
    if (!code.trim()) return toast.error("No existing code to upgrade!");

    try {
      setUpgradeLoading(true); // <-- Use upgradeLoading
      // setLoading(true); // OLD: This caused the main button to spin

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Add explicit instructions to only modify necessary parts and preserve structure
      const upgradeContent = [
        {
          role: "user",
          parts: [
            {
              text: `
You are a world-class UI engineer.
Below is an existing component code. Upgrade or modify ONLY what is required.

User Upgrade Request:
${upgradePrompt}

Existing Code:
\`\`\`
${code}
\`\`\`

Rules:
- Update only the minimum necessary parts to satisfy the request.
- Preserve structure, variable names, and comments where possible.
- Keep responsiveness intact.
- Return only the updated code block (no explanations).
              `,
            },
          ],
        },
      ];

      const result = await generateContentWithRetry(model, upgradeContent);
      const responseText = result.response.text();
      const updated = extractCode(responseText);

      if (!updated.trim()) {
        toast.error("Upgrade returned no code. Try a clearer prompt.");
        return;
      }

      // Save previous code to history for undo
      setHistory(prev => [...prev, code]);
      setCode(updated);
      setUpgradePrompt("");
      setOutputScreen(true);
      setRefreshKey(prev => prev + 1); // refresh preview
      toast.success("Code upgraded successfully!");
    } catch (err) {
      console.error("Upgrade Error:", err);
      toast.error("Failed to upgrade code. Try again.");
    } finally {
      setUpgradeLoading(false); // <-- Use upgradeLoading
      // setLoading(false); // OLD: This caused the main button to spin
    }
  };

  const undoChange = () => {
    if (!history.length) return toast.info("Nothing to undo");
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setCode(last);
    setRefreshKey(prev => prev + 1);
    toast.success("Reverted to previous version");
  };

  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    await navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  const downloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Generated_UI_Code.html";
    link.click();
  };

  const handleSave = async () => {
    if (!saveTitle.trim()) return toast.error("Enter a title");
    if (!code.trim()) return toast.error("Nothing to save");

    try {
      let imageUrl = "";

      // Upload image to Cloudinary if exists
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );
        imageUrl = res.data.secure_url;
      }

      await API.post(
        "/saved/save",
        { title: saveTitle, code, image: imageUrl },
        { withCredentials: true }
      );

      toast.success("Code saved successfully!");
      setShowModal(false);
      setSaveTitle("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save code");
    }
  };

  // prepare Sandpack files and activeFile depending on selected framework
  const filesAndActive = useMemo(() => {
    if (frameWork.value.includes("react")) {
      return {
        files: {
          "/App.js": code || `export default function App(){ return <div /> }`,
          "/index.js": `
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./tailwind.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
`,
          "/tailwind.css": `
@import "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
`,
        },
        activeFile: "/App.js",
        template: "react",
      };
    } else if (frameWork.value.includes("js")) {
      return {
        files: {
          "/index.html": code || "<!doctype html><html><body></body></html>",
          "/style.css": "",
          "/script.js": "",
        },
        activeFile: "/index.html",
        template: "vanilla",
      };
    } else {
      // static default
      return {
        files: {
          "/index.html": code || "<!doctype html><html><body></body></html>",
          "/style.css": "",
          "/script.js": "",
        },
        activeFile: "/index.html",
        template: "static",
      };
    }
  }, [frameWork, code, refreshKey]);

  return (
    <>
      <Navbar />
      {!user ? (
        <h1 className="text-center mt-10 text-white">not logged in</h1>
      ) : (
        <div className="relative min-h-screen overflow-hidden pt-7 bg-black text-white font-inter">
          {/* Floating Code Background */}
          <div className="absolute inset-0 overflow-hidden opacity-[0.08] font-mono text-[11px] text-gray-300 select-none">
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
                  duration: 12 + Math.random() * 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {codeSnippets[Math.floor(Math.random() * codeSnippets.length)]}
              </motion.div>
            ))}
          </div>

          {/* Gradient motion background */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.04),transparent_60%)]"
            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />

          {/* Main UI Section */}
          <motion.div
            className="relative z-10 grid grid-cols-1 lg:grid-cols-2 mt-8 gap-6 px-6 lg:px-16 h-[calc(100vh-80px)]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Left Panel */}
            <div className="flex flex-col justify-between bg-[#111]/90 backdrop-blur-lg rounded-xl p-6 h-full border border-gray-800 shadow-lg">
              <div>
                <h3 className="text-2xl font-bold mb-2">SanForge</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Describe your idea, pick a framework, and let AI create it
                  instantly.
                </p>

                <p className="text-sm font-semibold mb-2">Framework</p>
                <Select
                  className="mb-4"
                  options={options}
                  value={frameWork}
                  onChange={setFrameWork}
                  styles={{
                    control: base => ({
                      ...base,
                      backgroundColor: "#0d0d0d",
                      borderColor: "#333",
                      color: "#fff",
                      boxShadow: "none",
                    }),
                    singleValue: base => ({ ...base, color: "#fff" }),
                    menu: base => ({ ...base, backgroundColor: "#111" }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? "#333"
                        : state.isFocused
                        ? "#222"
                        : "#111",
                      color: "#fff",
                    }),
                  }}
                />

                <p className="text-sm font-semibold mb-2">
                  Describe your component
                </p>
                <textarea
                  onChange={e => setPrompt(e.target.value)}
                  value={prompt}
                  className="w-full min-h-[120px] rounded-xl bg-[#09090B] mt-2 p-3 text-white outline-none focus:ring-2 focus:ring-gray-500 resize-none"
                  placeholder="Describe your component in detail..."
                ></textarea>

                <div className="mt-5">
                  <p className="text-sm font-semibold">
                    Upload wireframe (optional)
                  </p>

                  <label className="mt-2 inline-flex items-center px-4 py-2 bg-gradient-to-r from-zinc-600 to-zinc-400 text-white rounded-lg cursor-pointer hover:scale-105 transition-all shadow-md">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          setImageFile(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>

                  {imagePreview && (
                    <div className="relative mt-3 w-80">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-auto rounded-lg border border-gray-700"
                      />
                      <button
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md transition"
                        title="Remove image"
                      >
                        <IoCloseSharp size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-5">
                <p className="text-gray-400 text-sm">
                  Click Generate to get your code
                </p>
                <button
                  onClick={getResponse}
                  disabled={loading || upgradeLoading} // Also disabled during upgrade
                  className="flex items-center p-3 rounded-lg bg-gradient-to-r from-gray-600 to-gray-400 px-5 gap-2 transition-all hover:scale-105"
                >
                  {loading ? (
                    <ClipLoader color="white" size={18} />
                  ) : (
                    <BsStars />
                  )}
                  Generate
                </button>
              </div>
            </div>

            {/* Right Panel */}
            <div className="relative w-full bg-[#141319] rounded-xl overflow-hidden h-full">
              {!outputScreen ? (
                <div className="w-full h-full flex flex-col bg-[#141319] items-center justify-center relative overflow-hidden">
                  {/* Animated floating icons */}
                  {Array.from({ length: 40 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-zinc-600 text-2xl"
                      style={{
                        top: `${Math.random() * 90}%`,
                        left: `${Math.random() * 90}%`,
                      }}
                      animate={{
                        y: [0, -30, 0],
                        x: [0, 20, 0],
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 4 + Math.random() * 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2,
                      }}
                    >
                      <HiOutlineCode />
                    </motion.div>
                  ))}

                  <div className="p-5 w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-full bg-gradient-to-r from-zinc-300 to-zinc-500 animate-pulse">
                    <HiOutlineCode />
                  </div>
                  <p className="text-[20px] text-gray-100 mt-3 text-center px-4">
                    Your generated code will appear here.
                  </p>
                </div>
              ) : (
                <>
                  {/* Tabs */}
                  <div className="bg-[#17171C] w-full h-[50px] flex items-center justify-between px-3">
                    <div className="flex gap-2 w-1/2">
                      <button
                        onClick={() => setTab(1)}
                        className={`flex-1 py-2 rounded-lg transition-all ${
                          tab === 1
                            ? "bg-gradient-to-r from-zinc-600 to-zinc-400 text-white rounded-lg cursor-pointer hover:scale-105 transition-all shadow-md"
                            : "bg-zinc-800 text-gray-300"
                        }`}
                      >
                        Code
                      </button>
                      <button
                        onClick={() => setTab(2)}
                        className={`flex-1 py-2 rounded-lg transition-all ${
                          tab === 2
                            ? "bg-gradient-to-r from-zinc-600 to-zinc-400 text-white rounded-lg cursor-pointer hover:scale-105 transition-all shadow-md"
                            : "bg-zinc-800 text-gray-300"
                        }`}
                      >
                        Preview
                      </button>
                    </div>

                    {/* ✅ Copy, Upgrade & Download Controls */}
                    <div className="flex gap-3 items-center">
                      {/* Inline Upgrade Input + Button */}

                      {outputScreen && (
                        <button
                          onClick={() => setShowModal(true)}
                          className="bg-gradient-to-r from-zinc-600 to-zinc-400 p-2 text-white rounded-lg cursor-pointer hover:scale-105 transition-all shadow-md"
                        >
                          Save Code
                        </button>
                      )}

                      <button
                        onClick={copyCode}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-200 transition-all flex items-center gap-1"
                      >
                        <IoCopy />{" "}
                        <span className="hidden md:inline">Copy</span>
                      </button>
                      <button
                        onClick={downloadFile}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-200 transition-all flex items-center gap-1"
                      >
                        <PiExportBold />{" "}
                        <span className="hidden md:inline">Download</span>
                      </button>
                      <button
                        onClick={() => setRefreshKey(prev => prev + 1)}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-200 transition-all"
                        title="Refresh Preview"
                      >
                        <FiRefreshCcw />
                      </button>
                    </div>
                  </div>

                  {/* Editor / Preview */}
                  <div className="min-h-[75vh] h-full">
                    <SandpackProvider
                      key={refreshKey}
                      theme="dark"
                      template={filesAndActive.template}
                      files={filesAndActive.files}
                    >
                      <SandpackLayout style={{ height: "77vh" }}>
                        {tab === 1 ? (
                          <SandpackCodeEditor
                            showTabs
                            showLineNumbers
                            activeFile={filesAndActive.activeFile}
                            style={{
                              height: "100%",
                              overflow: "auto",
                              backgroundColor: "#1a1a1a",
                            }}
                            // keep editor edits synced to code state (preserve user edits)
                            onChange={newCode => {
                              // newCode will contain the code content for the active file
                              // we only sync to `code` for the primary file (App.js or index.html)
                              setCode(newCode || "");
                            }}
                          />
                        ) : (
                          <SandpackPreview
                            showOpenInCodeSandbox={false}
                            showRefreshButton={false}
                            style={{
                              height: "100%",
                              background: "white",
                            }}
                          />
                        )}
                      </SandpackLayout>
                      <div className="flex justify-center h-10 gap-4 mt-4">
                        <input
                          type="text"
                          placeholder="Upgrade (e.g. add animations, dark mode...)"
                          className="px-3 py-2 rounded-md bg-[#222] text-white text-sm w-96 outline-none border border-gray-700"
                          value={upgradePrompt}
                          onChange={e => setUpgradePrompt(e.target.value)}
                        />
                        <div>
                          <button
                            onClick={upgradeCode}
                            disabled={upgradeLoading || loading} // <-- Use upgradeLoading here
                            className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm transition-all"
                            title="Upgrade code based on prompt"
                          >
                            {upgradeLoading ? "Processing..." : "Upgrade Code"}
                          </button>
                          <button
                            onClick={undoChange}
                            disabled={upgradeLoading || loading} // Also disable undo while processing
                            className="px-3 py-2 bg-zinc-800 text-gray-200 rounded-md ml-5 hover:bg-zinc-700 text-sm transition-all"
                            title="Undo last change"
                          >
                            Undo
                          </button>
                        </div>
                      </div>
                    </SandpackProvider>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {showModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-[#111] p-6 rounded-xl w-96 shadow-xl border border-gray-700">
                <h2 className="text-xl font-semibold mb-3 text-white text-center">
                  Save Generated Code
                </h2>
                <input
                  type="text"
                  placeholder="Enter a title"
                  className=" p-2 w-full mb-4 rounded bg-black text-white"
                  value={saveTitle}
                  onChange={e => setSaveTitle(e.target.value)}
                />
                <button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-zinc-600 to-zinc-400 text-white cursor-pointer hover:scale-105 transition-all shadow-md px-4 py-2 rounded-md w-full"
                >
                  Save
                </button>
                <button
                  className="text-red-500 mt-3 w-full"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="text-center text-gray-500 py-8 border-t border-gray-800/50 relative z-10">
            © {new Date().getFullYear()} SanForge UI Generator.
          </footer>
        </div>
      )}
    </>
  );
};

export default Uigen;
