import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Uigen from "./pages/Uigen";
import MyUI from "./pages/MyUI";
import SavedCodes from "./pages/SavedCodes";
import ViewCode from "./pages/ViewCode";
import Spline from "@splinetool/react-spline";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{ style: { background: "#111", color: "#fff" } }}
      />
      {/* <div className="absolute inset-0 w-full h-full -z-10">
        <Spline scene="https://prod.spline.design/pTxUyPD0bVVv9yxM/scene.splinecode" />
      </div> */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/uigen" element={<Uigen />} />
        <Route path="/myui" element={<MyUI />} />
        <Route path="/saved" element={<SavedCodes />} />
        <Route path="/view/:id" element={<ViewCode />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
