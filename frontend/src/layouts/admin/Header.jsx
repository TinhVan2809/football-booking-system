import "../../styles/DashbroadAdmin.css";
import { RiNotification3Line } from "@remixicon/react";
import { useContext } from "react";
import UserContext from "../../context/UserContext";

function Header() {
  const { user } = useContext(UserContext);

  return (
    <>
      <header className="header-container w-full flex sticky top-0 px-10 py-2 bg-white justify-between items-center">
        <div className="flex justify-center items-end">
          <img
            src="../../../assets/Screenshot 2026-01-18 022408-Photoroom.png"
            title="HASEKi"
            className="w-10"
          />
        </div>
        <div className="">
          <input type="text" 
            className="bg-white w-100 py-2 rounded-sm px-3 outline-0"
          />
        </div>

        <div className="user_container flex justify-center items-center gap-10">
          <div className="cursor-pointer">
            <RiNotification3Line />
          </div>
          <div className="flex justify-center items-center gap-2 cursor-pointer">
            <img
              src="../../../assets/491510680_18002017331672055_5308144228321480053_n.jpg"
              className="w-11 rounded-[50%] object-cover"
            />
            <div className="flex flex-col">
              <p className="font-bold text-sm">{user?.full_name || user?.username}</p>
              <span className="text-sm text-gray-500 capitalize">{user?.role || "Admin"}</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
