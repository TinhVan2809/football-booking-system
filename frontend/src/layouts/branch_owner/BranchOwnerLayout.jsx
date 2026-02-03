import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Notifications from "../../pages/branch_owner/Notifications";
function BranchOwnerLayout() {
    return(
        <>
            <Header />
            <Notifications />
            <main>
                <Outlet />
            </main>
            {/* <Footer /> */}

        </>
    );
}

export default BranchOwnerLayout;
