import { Outlet } from "react-router-dom";
import { useState } from "react";
import HeaderAdmin from "./Header";
import Sidebar from "./Sidebar";
import FooterAdmin from "./Footer";

function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <HeaderAdmin onToggleSidebar={handleToggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
            <main className="pt-16 lg:ml-60 lg:px-8 pb-8">
                <Outlet />
            </main>
            <FooterAdmin />
        </div>
    );
}

export default AdminLayout;
