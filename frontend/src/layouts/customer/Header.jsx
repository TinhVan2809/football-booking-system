import { RiNotification2Line, RiUser3Line } from "@remixicon/react";
import { useNavigate, NavLink } from "react-router-dom";
import { useContext, useState } from "react";

import UserContext from "../../context/UserContext";

import {RiMapPinTimeLine, RiListCheck, RiCloseLine} from '@remixicon/react'; 

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full sticky top-0 flex justify-between  md:px-10 lg:px-30 py-2 z-300 bg-white">
        <div className="flex gap-1 lg:gap-3 justify-center items-center cursor-pointer" onClick={() => navigate('/')}>
          <img
            src="../../../assets/HASEBOOKING-Photoroom.png"
            alt="logo"
            className="w-10 lg:w-16"
          />
          <span className="text-sm lg:text-lg font-bold text-green-800">HASEBOOKING</span>
        </div>
        <nav className="hidden lg:flex justify-center items-center gap-5.5">
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
    
        </nav>

        {user ? (
          <div className="hidden lg:flex justify-center items-center gap-4">
            <div className="relative py-1 px-1 cursor-pointer">
              <RiNotification2Line color="#272727" />
              <sup className="absolute top-0 right-0 bg-red-500 w-4 h-3.5 rounded-2xl flex justify-center items-center text-white">
                1
              </sup>
            </div>
            <div className="flex justify-center items-center gap-1 cursor-pointer" onClick={() => navigate(`/profile/${user.user_id}`)}>
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
          <div className="hidden lg:flex justify-center items-center gap-3">
            <button className="px-5 py-2 rounded-[20px] cursor-pointer bg-[#221f23] text-white text-sm duration-200 hover:opacity-90">Đặt lịch ngay</button>
            <button className="px-5 py-2 rounded-2xl cursor-pointer border border-gray-200 text-sm duration-200 hover:bg-gray-200" onClick={logout}>Khám phá thêm</button>
          </div>
        ) : (
          <div className="hidden lg:flex justify-center items-center gap-2">
            <button className="px-4 py-1.5 rounded-2xl bg-green-700 text-white flex gap-1 items-center cursor-pointer"><RiMapPinTimeLine size={19}/> Đặt lịch dùng thử</button>
            <button className="px-4 py-1.5 rounded-2xl bg-green-700 text-white cursor-pointer">Learn more</button>
          </div>
        )}

         {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="cursor-pointer p-2 text-gray-700">
            {isMenuOpen ? <RiCloseLine size={24} /> : <RiListCheck size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`absolute top-full left-0 w-full bg-white shadow-lg flex flex-col gap-4 lg:hidden border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-125 opacity-100 p-4" : "max-h-0 opacity-0 p-0 pointer-events-none"}`}>
            <nav className="flex flex-col gap-2">
              <NavLink 
                to="/" 
                end 
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `font-[450] px-3 py-2 rounded-lg duration-300 hover:bg-green-50 ${isActive ? "bg-green-100 text-green-800" : ""}`}
              >
                Home
              </NavLink>
              <NavLink 
                to="/fields" 
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `font-[450] px-3 py-2 rounded-lg duration-300 hover:bg-green-50 ${isActive ? "bg-green-100 text-green-800" : ""}`}
              >
                Sân bóng
              </NavLink>
              <NavLink 
                to="/search" 
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `font-[450] px-3 py-2 rounded-lg duration-300 hover:bg-green-50 ${isActive ? "bg-green-100 text-green-800" : ""}`}
              >
                Tìm kiếm
              </NavLink>
              <NavLink 
                to="/contact" 
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `font-[450] px-3 py-2 rounded-lg duration-300 hover:bg-green-50 ${isActive ? "bg-green-100 text-green-800" : ""}`}
              >
                Liên hệ
              </NavLink>
              <NavLink 
                to="/blogs" 
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `font-[450] px-3 py-2 rounded-lg duration-300 hover:bg-green-50 ${isActive ? "bg-green-100 text-green-800" : ""}`}
              >
                Blogs
              </NavLink>
            </nav>

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3">
                    <RiUser3Line /> <span className="font-[450]">{user.username}</span>
                  </div>
                  <button className="w-full px-5 py-2 rounded-lg bg-[#221f23] text-white text-sm hover:opacity-90">Đặt lịch ngay</button>
                  <button className="w-full px-5 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50" onClick={logout}>Khám phá thêm</button>
                </>
              ) : (
                <>
                  <button className="w-full px-5 py-2 rounded-lg bg-[#221f23] text-white text-sm" onClick={() => navigate("/login")}>Đăng nhập</button>
                  <button className="w-full px-4 py-2 rounded-lg bg-green-700 text-white flex justify-center gap-1 items-center"><RiMapPinTimeLine size={19}/> Đặt lịch dùng thử</button>
                  <button className="px-4 py-1.5 rounded-2xl bg-green-700 text-white cursor-pointer">Learn more</button>
                </>
              )}
            </div>
        </div>

      </header>
    </>
  );
}

export default Header;
