import React from "react";
import {
  RiGiftLine,
  RiStore2Line,
  RiSettings5Line,
  RiGamepadLine,
  RiSunLine,
  RiMoonClearLine,
} from "react-icons/ri";

const SideMenu = ({ isDarkTheme, setIsDarkTheme }) => {
  return (
    <div>
      <div className="bg-primary h-[250px] px-4 rounded-[50px] flex flex-col justify-center items-center gap-4">
        <div
          className={`h-[60px] p-1 rounded-[50px] flex justify-center items-start cursor-pointer transition-colors duration-300 ${
            isDarkTheme ? "bg-black" : "bg-white"
          }`}
          onClick={() => setIsDarkTheme(!isDarkTheme)}
        >
          <div
            className={`bg-primary w-[20px] h-[20px] rounded-full flex justify-center items-center text-white transition-transform duration-300 ${
              isDarkTheme ? "translate-y-[30px]" : "translate-y-0"
            }`}
          >
            {isDarkTheme ? (
              <RiMoonClearLine className="text-sm text-white" />
            ) : (
              <RiSunLine className="text-sm text-white" />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 text-xl text-white mt-4">
          {[RiGamepadLine, RiStore2Line, RiGiftLine, RiSettings5Line].map(
            (Icon, i) => (
              <Icon key={i} className="cursor-pointer" />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
