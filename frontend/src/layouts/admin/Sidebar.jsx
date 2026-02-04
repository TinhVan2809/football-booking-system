import { RiBookmarkLine, RiMegaphoneLine, RiColorFilterAiLine, RiUserLine, RiUser2Line, RiSettings2Line, RiEditBoxLine, RiLogoutBoxLine } from "@remixicon/react";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();
    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}
            <div
                className={`sidebar-container fixed left-0 top-16 h-[calc(100vh-4rem)] w-60 bg-white shadow-md flex flex-col items-center pt-6 pb-5 gap-8 overflow-y-auto z-50 transform transition-transform duration-200 ease-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
            >
                <div className="flex justify-center items-center gap-2 px-4">
                    <img src="../../../assets/491510680_18002017331672055_5308144228321480053_n.jpg" className="w-10 rounded-[50%] object-cover" alt="Avatar"/>
                    <span className="text-gray-500 text-sm">{user?.full_name}</span>
                </div>
                <div className="px-15">
                    <nav>
                        <ul className="flex flex-col gap-7.5">
                            <li className="flex text-md items-center gap-2.5 cursor-pointer" onClick={() => navigate('/admin')}><RiBookmarkLine /> Bảng điều khiển</li>
                            <li className="flex text-md items-center gap-2.5 cursor-pointer"><RiColorFilterAiLine /> Dịch vụ</li>
                            <li className="flex text-md items-center gap-2.5 cursor-pointer"><RiMegaphoneLine /> Thông báo</li>
                            <li className="flex text-md items-center gap-2.5 cursor-pointer" onClick={() => navigate('/admin/fields')}><RiEditBoxLine /> Sân bóng</li>
                            <li className="flex text-md items-center gap-2.5 cursor-pointer" onClick={() => navigate('/admin/users')}><RiUserLine /> Khách hàng</li>
                            <li className="flex text-md items-center gap-2.5 cursor-pointer" onClick={() => navigate('/admin/branches')}><RiUserLine/> Chủ sân</li>
                            <li className="flex text-md items-center gap-2.5 cursor-pointer"><RiUser2Line /> Admin</li>
                            <li className="flex text-md items-center gap-2.5 cursor-pointer"><RiSettings2Line /> Cài đặt</li>
                            <li className="flex text-md items-center gap-2.5 cursor-pointer"  onClick={logout} ><RiLogoutBoxLine color="red"/> Đăng xuất</li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
