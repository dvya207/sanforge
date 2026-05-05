import React from "react";
import Spline from "@splinetool/react-spline";

const spline = () => {
  return (
    <div>
      <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none">
        <Spline scene="https://prod.spline.design/pTxUyPD0bVVv9yxM/scene.splinecode" />
      </div>
    </div>
  );
};

export default spline;
