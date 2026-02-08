import { Outlet } from "react-router-dom";
import Header from "./Header";
import FooterBranches from "./Footer";
import Notifications from "../../components/branch_owner/Notifications";
function BranchOwnerLayout() {
    return(
        <>
            <Header />
            <Notifications />
            <main>
                <Outlet />
            </main>
           <FooterBranches />

        </>
    );
}

export default BranchOwnerLayout;
