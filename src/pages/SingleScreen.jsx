import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SideMenu from "../components/SideMenu";
import images from "../assets/images/images";
import Screen from "../components/Screen";

const SingleScreen = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <div className="relative min-h-screen w-full">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center -z-10 transition-all duration-500"
        style={{
          backgroundImage: `url(${
            isDarkTheme ? images.QA_DARK : images.QA_LIGHT
          })`,
        }}
      />

      <div className="relative z-10 flex flex-col h-full p-6">
        <Navbar isDarkTheme={isDarkTheme} />
        <div className="flex flex-1 items-center justify-center gap-8 mt-10">
          <SideMenu isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
          <Screen className="h-full" isDarkTheme={isDarkTheme} />
        </div>
      </div>
    </div>
  );
};

export default SingleScreen;
