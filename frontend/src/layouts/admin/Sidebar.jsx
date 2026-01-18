import { RiBookmarkLine, RiMegaphoneLine, RiColorFilterAiLine, RiUserLine, RiUser2Line, RiSettings2Line, RiEditBoxLine, RiLogoutBoxLine } from "@remixicon/react";
import { useContext } from "react";
import UserContext from "../../context/UserContext";

function Sidebar() {
    const { user, logout } = useContext(UserContext);
    return (
        <>
            <div className="sidebar-container fixed left-0  h-screen w-fit flex flex-col items-center py-5 gap-11">
                <div className="flex justify-center items-center gap-2">
                    <img src="../../../assets/491510680_18002017331672055_5308144228321480053_n.jpg" className="w-10 rounded-[50%] object-cover" alt="Avatar"/>
                    <span className="text-gray-500 text-sm">{user?.full_name}</span>
                </div>
                <div className="px-15">
                    <nav>
                        <ul className="flex flex-col gap-7.5">
                            <li className="flex text-md items-center gap-2.5 cursor-pointer"><RiBookmarkLine /> Lịch đặt</li>
                            <li className="flex text-md items-center gap-2.5 cursor-pointer"><RiColorFilterAiLine /> Dịch vụ</li>
                            <li className="flex text-md items-center gap-2.5 cursor-pointer"><RiMegaphoneLine /> Thông báo</li>
                            <li className="flex text-md items-center gap-2.5 cursor-pointer"><RiEditBoxLine /> Sân bóng</li>
                            <li className="flex text-md items-center gap-2.5 cursor-pointer"><RiUserLine /> Customers</li>
                            <li className="flex text-md items-center gap-2.5 cursor-pointer"><RiUser2Line /> Admin</li>
                            <li className="flex text-md items-center gap-2.5 cursor-pointer"><RiSettings2Line /> Cài đặt</li>
                            <li className="flex text-md items-center gap-2.5 cursor-pointer mt-15"  onClick={logout} ><RiLogoutBoxLine color="red"/> Đăng xuất</li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}

export default Sidebar;