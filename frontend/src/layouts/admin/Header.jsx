import { useContext } from "react";
import UserContext from "../../context/UserContext";

import { RiMenuLine, RiNotification3Line, RiSearchLine } from "@remixicon/react";
import "../../styles/DashbroadAdmin.css";

function HeaderAdmin({ onToggleSidebar }) {
  const { user } = useContext(UserContext);

  return (
    <>
      <header className="w-full sticky top-0 z-50 h-16 bg-white/95 backdrop-blur border-b border-slate-200 px-4 lg:pl-60 lg:pr-8 flex items-center justify-between">
        <div className="flex items-center gap-3 w-full lg:w-[50%]">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100"
            aria-label="Toggle sidebar"
          >
            <RiMenuLine />
          </button>
          <div className="w-full relative">
            <input type="text" 
            className="bg-gray-300/50 w-full py-2 px-9 rounded-sm outline-0"
            placeholder="Search for..."
          />
          <RiSearchLine className="absolute top-0 left-0 h-full ml-1"/>
          </div>
        </div>

        <div className="user_container flex justify-center items-center gap-5">
          <div className="cursor-pointer">
            <RiNotification3Line />
          </div>
          <div className="flex justify-center items-center gap-2 cursor-pointer">
            <img
              src="../../../assets/491510680_18002017331672055_5308144228321480053_n.jpg"
              className="w-11 rounded-[50%] object-cover"
            />
          </div>
        </div>
      </header>
    </>
  );
}

export default HeaderAdmin;
