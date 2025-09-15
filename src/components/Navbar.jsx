import React from "react";
import images from "../assets/images/images";
import { RiNotification2Line, RiArrowDownSLine } from "react-icons/ri";

const Navbar = ({ isDarkTheme }) => {
  return (
    <div className="flex items-center justify-between">
      <img
        src={isDarkTheme ? images.LOGO_COLOR_W_COLOR : images.LOGO_COLOR_B}
        alt="Logo"
        className="h-[45px]"
      />

      <div className="flex items-center gap-4">
        <div className="bg-primary w-13 h-13 flex items-center justify-center rounded-full text-white text-2xl cursor-pointer">
          <RiNotification2Line />
        </div>

        <div
          className={`flex items-center justify-between gap-4 px-2 py-2 rounded-[50px] transition-colors duration-300 ${
            isDarkTheme
              ? "bg-black text-white"
              : "bg-gradient-to-r from-primary to-secondary text-white"
          }`}
        >
          <div className="bg-purple w-10 h-10 flex items-center justify-center rounded-full text-white">
            <p>FA</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <p className="text-sm font-light">Simon Holloway</p>
            <RiArrowDownSLine className="text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
