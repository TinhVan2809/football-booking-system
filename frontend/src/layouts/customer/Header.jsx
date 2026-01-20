import { RiNotification2Line, RiUser3Line } from "@remixicon/react";
import { useNavigate, NavLink } from "react-router-dom";
import { useContext } from "react";

import UserContext from "../../context/UserContext";

import {RiMapPinTimeLine} from '@remixicon/react'; 

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  return (
    <>
      <header className="w-full sticky top-0 flex justify-between px-30 z-300 bg-white">
        <div className="flex gap-3 justify-center items-center">
          <img
            src="../../../assets/HASEBOOKING-Photoroom.png"
            alt="logo"
            className="w-16"
          />
          <span className="text-lg font-bold text-green-800">HASEBOOKING</span>
        </div>
        <nav className="flex justify-center items-center gap-5.5">
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => `font-[450] hover:cursor-pointer px-3 py-1 rounded-[20px] duration-300 hover:bg-green-700 hover:text-white ${isActive ? "bg-green-700 text-white" : ""}`}
          >
            Home
          </NavLink>
          <NavLink 
            to="/fields" 
            className={({ isActive }) => `font-[450] hover:cursor-pointer px-3 py-1 rounded-[20px] duration-300 hover:bg-green-700 hover:text-white ${isActive ? "bg-green-700 text-white" : ""}`}
          >
            Sân bóng
          </NavLink>
          <NavLink 
            to="/search" 
            className={({ isActive }) => `font-[450] hover:cursor-pointer px-3 py-1 rounded-[20px] duration-300 hover:bg-green-700 hover:text-white ${isActive ? "bg-green-700 text-white" : ""}`}
          >
            Tìm kiếm
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => `font-[450] hover:cursor-pointer px-3 py-1 rounded-[20px] duration-300 hover:bg-green-700 hover:text-white ${isActive ? "bg-green-700 text-white" : ""}`}
          >
            Liên hệ
          </NavLink>
          <NavLink 
            to="/blogs" 
            className={({ isActive }) => `font-[450] hover:cursor-pointer px-3 py-1 rounded-[20px] duration-300 hover:bg-green-700 hover:text-white ${isActive ? "bg-green-700 text-white" : ""}`}
          >
            Blogs
          </NavLink>
        </nav>

        {user ? (
          <div className="flex justify-center items-center gap-4">
            <div className="relative py-1 px-1 cursor-pointer">
              <RiNotification2Line color="#272727" />
              <sup className="absolute top-0 right-0 bg-red-500 w-4 h-3.5 rounded-2xl flex justify-center items-center text-white">
                1
              </sup>
            </div>
            <div className="flex justify-center items-center gap-1">
              <RiUser3Line /> <span className="font-[450]">{user.username}</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <button
              className="px-5 py-2 rounded-[20px] cursor-pointer bg-[#221f23] text-white text-sm"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
          </div>
        )}

        {user ? (
          <div className="flex  justify-center items-center gap-3">
            <button className="px-5 py-2 rounded-[20px] cursor-pointer bg-[#221f23] text-white text-sm duration-200 hover:opacity-90">Đặt lịch ngay</button>
            <button className="px-5 py-2 rounded-2xl cursor-pointer border border-gray-200 text-sm duration-200 hover:bg-gray-200" onClick={logout}>Khám phá thêm</button>
          </div>
        ) : (
          <div className="flex justify-center items-center gap-2">
            <button className="px-4 py-1.5 rounded-2xl bg-green-700 text-white flex gap-1 items-center cursor-pointer"><RiMapPinTimeLine size={19}/> Đặt lịch dùng thử</button>
            <button className="px-4 py-1.5 rounded-2xl bg-green-700 text-white cursor-pointer">Learn more</button>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
