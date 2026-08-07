import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../api/api";
import { useParams } from "react-router-dom";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { MoveLeft } from "lucide-react";
import { Undo2 } from "lucide-react";

export default function ViewCode() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(1); // 1 = Code, 2 = Preview

  useEffect(() => {
    API
      .get(`/saved/${id}`)
      .then(res => setItem(res.data))
      .catch(err => console.error("Failed to fetch saved code:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <p className="text-center mt-10 text-white">Loading...</p>;
  if (!item)
    return <p className="text-center mt-10 text-white">Code not found.</p>;

  // Detect if the code is React
  const isReact =
    /from ['"]react['"]/.test(item.code) || /React/.test(item.code);

  // Files for Sandpack
  const files = isReact
    ? {
        "/App.js": item.code,
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
        "/index.html": item.code,
        "/style.css": "",
        "/script.js": "",
      };

  return (
    <div className="px-6 bg-[#111] h-screen text-white pt-14 overflow-hidden">
      <h2 className="text-2xl mb-3 font-bold text-center uppercase flex justify-baseline gap-180 items-center ">
        <Link to={"/saved"}>
          <div className="flex items-center gap-4 ">
            <Undo2 size={30} /> <h1 className="capitalize font-semibold "></h1>
          </div>
        </Link>

        {item.title}
      </h2>

      {/* Tabs */}
      <div className="flex  bg-[#17171C] rounded-lg overflow-hidden w-max">
        <button
          onClick={() => setTab(1)}
          className={`px-4 py-2 transition-all ${
            tab === 1
              ? "bg-gradient-to-r from-gray-600 to-gray-400 shadow-md text-white text-white"
              : "bg-zinc-800 text-gray-300"
          }`}
        >
          Code
        </button>
        <button
          onClick={() => setTab(2)}
          className={`px-4 py-2 transition-all ${
            tab === 2
              ? "bg-gradient-to-r from-gray-600 to-gray-400 shadow-md text-white"
              : "bg-zinc-800 text-gray-300"
          }`}
        >
          Preview
        </button>
      </div>

      {/* Sandpack Area */}
      <div className="min-h-[60vh] border border-gray-800 rounded-lg overflow-hidden">
        <SandpackProvider
          template={isReact ? "react" : "static"}
          files={files}
          theme="dark"
        >
          <SandpackLayout style={{ height: "80vh" }}>
            {tab === 1 ? (
              <SandpackCodeEditor
                showTabs
                showLineNumbers
                style={{ height: "100%", backgroundColor: "#1a1a1a" }}
              />
            ) : (
              <SandpackPreview
                showOpenInCodeSandbox={false}
                showRefreshButton={true}
                style={{
                  height: "100%",
                  backgroundColor: isReact ? "#f9fafb" : "white", // light bg for Tailwind
                }}
              />
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>
      <footer className=" bottom-6 text-center text-gray-500 text-sm ">
        © {new Date().getFullYear()} SanForge UI Generator
      </footer>
    </div>
  );
}
