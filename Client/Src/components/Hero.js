import React from "react";
import Hero1 from "../assets/hero.jpg";

function Hero() {
  return (
    <div className="max-w-[1640px] p-4 mx-auto">
      <div className="max-h-[500px] relative">
        {/* overlay */}
        <div className="absolute w-full h-full text-gray-200 max-h-[500px] bg-black/40 flex flex-col justify-center">
          {/* <h1 className="px-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            The <span className="text-orange-400">E - Computers</span>{" "}
          </h1>
          <h1 className="px-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            {" "}
            <span className="text-orange-400 ">Foods</span> Delivered
          </h1> */}
        </div>
        <img
          className="w-full max-h-[500px] object-cover"
          src={Hero1}
        />
      </div>
    </div>
  );
}

export default Hero;
