import { NavLink, useNavigate } from "react-router-dom";
import { RiAddLargeLine } from "@remixicon/react";

import { useContext } from "react";
import UserContext from "../../context/UserContext";

function Header() {

    const {user, logout} = useContext(UserContext);
    const navigate = useNavigate();
    console.log("user.branch_id:", user?.branch_id);
  return (
    <>
      <header className="sticky top-0 shadow-2xl z-300 rounded-md flex justify-between items-center w-full bg-white">
        <div className="flex justify-center items-center text-center ml-20">
          <h2 className="font-bold text-2xl text-green-800">HASEBOOKING</h2>
        </div>
        <nav className="flex justify-center items-center gap-5">
          <div className="flex justify-center items-center gap-7">
            <NavLink
              to="/branch_owner"
              end
              className={({ isActive }) =>
                `font-bold text-[#20ad84] text-sm px-4 py-0.5 rounded-2xl cursor-pointer hover:bg-[#28ad84] hover:text-white ${isActive ? "bg-[#20ad84] text-white" : ""}`
              }
            >
              Dashbroad
            </NavLink>
            <NavLink
              to={`/branch_owner/bookings/${user.branch_id}`}
              className={({ isActive }) =>
                `font-bold text-[#20ad84] text-sm px-4 py-0.5 rounded-2xl cursor-pointer hover:bg-[#28ad84] hover:text-white ${isActive ? "bg-[#20ad84] text-white" : ""}`
              }
            >
              Bookings
            </NavLink>
            <NavLink
            to='/fields-branch_owner'
              className={({ isActive }) =>
                `font-bold text-[#20ad84] text-sm px-4 py-0.5 rounded-2xl cursor-pointer hover:bg-[#28ad84] hover:text-white ${isActive ? "bg-[#20ad84] text-white" : ""}`
              }
            >
              Sân bóng
            </NavLink>
            <NavLink
            to='/services'
              className={({ isActive }) =>
                `font-bold text-[#20ad84] text-sm px-4 py-0.5 rounded-2xl cursor-pointer hover:bg-[#28ad84] hover:text-white ${isActive ? "bg-[#20ad84] text-white" : ""}`
              }
            >
              Dịch vụ
            </NavLink>
            <NavLink
            to='/contact'
              className={({ isActive }) =>
                `font-bold text-[#20ad84] text-sm px-4 py-0.5 rounded-2xl cursor-pointer hover:bg-[#28ad84] hover:text-white ${isActive ? "bg-[#20ad84] text-white" : ""}`
              }
            >
              Liên hệ
            </NavLink>
          </div>
          <div className="bg-[#20ad84] text-white">
            <button className="flex w-full h-full cursor-pointer px-5 py-4" onClick={logout}>
              <RiAddLargeLine className="font-bold" /> Thêm sân bóng
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
