import { Outlet } from "react-router-dom";
import HeaderAdmin from "./Header";
import Sidebar from "./Sidebar";

function AdminLayout() {
    return (
        <>    
            <HeaderAdmin />
            <Sidebar />
            <main className="ml-60 p-8">
                <Outlet />
            </main>
        </>
    );
}

export default AdminLayout;
