import React from "react";

const MyUI = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white  font-inter ">
      <div className="mt-18 ml-10 flex gap-6 bg-black h-full">
        {/* Card 1 */}
        <div className="bg-zinc-800 shadow-lg rounded-xl p-2 w-60 text-center ">
          <img
            src="https://imgs.search.brave.com/yK9AGIQ-w0eWcOFBtM6XZ-kcJLSsEurGMZ6wF-ADCG8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTA0/NzI1OTM3NC9waG90/by9wcm9ncmFtbWlu/Zy1zb3VyY2UtY29k/ZS1hYnN0cmFjdC1i/YWNrZ3JvdW5kLmpw/Zz9iPTEmcz02MTJ4/NjEyJnc9MCZrPTIw/JmM9dWpSUG9pYUps/bTVVM1dEV2NWVmEx/WVZsRkl0NkdjanIt/UnN0ek9FUGJJVT0"
            alt="Card"
            className="rounded-lg w-full h-36 object-cover"
          />
          <h2 className="text-lg font-semibold mt-3">Card Title</h2>
          <button className="mt-3 px-4 py-1 border rounded-lg hover:bg-black hover:text-white duration-200">
            View Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyUI;
