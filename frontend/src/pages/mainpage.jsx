import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import Editor from "@monaco-editor/react";
import { IoCloseSharp, IoCopy } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { FiRefreshCcw } from "react-icons/fi";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import axios from "axios";
import { Sandpack } from "@codesandbox/sandpack-react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

const mainpage = () => {
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
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  // ✅ Extract code from Gemini response
  const extractCode = response => {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  };

  // ✅ Convert image to base64
  const fileToBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // ✅ Upload image to Cloudinary
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

  // ✅ Check if code is React
  const isReactCode = code => {
    return code.includes("import React") || code.includes("export default");
  };

  // ✅ Generate code
  async function getResponse() {
    if (!prompt.trim())
      return toast.error("Please describe your component first");

    try {
      setLoading(true);
      let imageData = null;

      if (imageFile) {
        await uploadToCloudinary(imageFile);
        const base64 = await fileToBase64(imageFile);
        imageData = {
          inlineData: {
            mimeType: imageFile.type,
            data: base64.split(",")[1],
          },
        };
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const contentParts = [
        {
          role: "user",
          parts: [
            {
              text: `
You are an expert web developer and UI designer.

Task: Generate a responsive, modern, and animated web UI component.
Component Description: ${prompt}
Framework: ${frameWork.label}

Requirements:
- Clean and optimized ${frameWork.label} code
- Responsive and accessible design
- High-quality hover effects and transitions
- Return ONLY the code, no explanation.
              `,
            },
          ],
        },
      ];

      if (imageData) {
        contentParts[0].parts.push(imageData);
      }

      const result = await model.generateContent({ contents: contentParts });
      const responseText = result.response.text();

      setCode(extractCode(responseText));
      setOutputScreen(true);
    } catch (error) {
      console.error("Gemini API Error:", error);
      toast.error("Error generating UI. Check API key or image.");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Copy Code
  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    await navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  // ✅ Download Code
  const downloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Generated_UI_Code.html";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <>
      <Navbar />

      <div className="grid grid-cols-1 lg:grid-cols-2 mt-8 gap-6 px-6 lg:px-16 h-[calc(100vh-80px)]">
        {/* Left Panel */}
        <div className="flex flex-col justify-between bg-[#141319] rounded-xl p-5 h-full overflow-hidden">
          <div>
            <h3 className="text-[25px] font-semibold sp-text">
              AI Component Generator
            </h3>
            <p className="text-gray-400 mt-2 text-[16px]">
              Describe your component and (optionally) upload a wireframe image.
            </p>

            <p className="text-[15px] font-[700] mt-4">Framework</p>
            <Select
              className="mt-2"
              options={options}
              value={frameWork}
              onChange={setFrameWork}
              styles={{
                control: base => ({
                  ...base,
                  backgroundColor: "#111",
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

            <p className="text-[15px] font-[700] mt-5">
              Describe your component
            </p>
            <textarea
              onChange={e => setPrompt(e.target.value)}
              value={prompt}
              className="w-full min-h-[120px] rounded-xl bg-[#09090B] mt-3 p-3 text-white outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Describe your component in detail..."
            ></textarea>

            <div className="mt-5">
              <p className="text-[15px] font-[700]">
                Upload wireframe (optional)
              </p>
              <input
                type="file"
                accept="image/*"
                className="mt-2 text-white"
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
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
              disabled={loading}
              className="flex items-center p-3 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 px-5 gap-2 transition-all hover:scale-105"
            >
              {loading ? <ClipLoader color="white" size={18} /> : <BsStars />}
              Generate
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="relative w-full bg-[#141319] rounded-xl overflow-hidden h-full">
          {!outputScreen ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="p-5 w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600">
                <HiOutlineCode />
              </div>
              <p className="text-[16px] text-gray-400 mt-3">
                Your generated code will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              {/* Tabs */}
              <div className="bg-[#17171C] w-full h-[50px] flex items-center justify-between px-3">
                <div className="flex gap-2 w-1/2">
                  <button
                    onClick={() => setTab(1)}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      tab === 1
                        ? "bg-purple-600 text-white"
                        : "bg-zinc-800 text-gray-300"
                    }`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setTab(2)}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      tab === 2
                        ? "bg-purple-600 text-white"
                        : "bg-zinc-800 text-gray-300"
                    }`}
                  >
                    Preview
                  </button>
                </div>

                {/* ✅ Copy & Download Controls */}
                <div className="flex gap-3 items-center">
                  <button
                    onClick={copyCode}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-200 transition-all flex items-center gap-1"
                  >
                    <IoCopy /> <span className="hidden md:inline">Copy</span>
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
              {/* Editor / Preview */}
              <div className="min-h-[75vh] h-full">
                <SandpackProvider
                  key={refreshKey}
                  theme="dark"
                  template={
                    frameWork.value.includes("react")
                      ? "react"
                      : frameWork.value.includes("js")
                      ? "vanilla"
                      : "static"
                  }
                  files={
                    frameWork.value.includes("react")
                      ? {
                          "/App.js": code,
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
                        }
                      : {
                          "/index.html": code,
                          "/style.css": "",
                          "/script.js": "",
                        }
                  }
                >
                  <SandpackLayout style={{ height: "75vh" }}>
                    {tab === 1 ? (
                      <SandpackCodeEditor
                        showTabs
                        showLineNumbers
                        style={{
                          height: "100%",
                          overflow: "auto",
                          backgroundColor: "#1a1a1a",
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
                </SandpackProvider>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Preview */}
      {isNewTabOpen && (
        <div className="absolute inset-0 bg-white w-screen h-screen overflow-auto">
          <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100">
            <p className="font-bold">Preview</p>
            <button
              onClick={() => setIsNewTabOpen(false)}
              className="w-10 h-10 rounded-xl border border-zinc-300 flex items-center justify-center hover:bg-gray-200"
            >
              <IoCloseSharp />
            </button>
          </div>
          <iframe
            srcDoc={code}
            className="w-full h-[calc(100vh-60px)]"
          ></iframe>
        </div>
      )}
    </>
  );
};

export default mainpage;
