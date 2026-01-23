import { Outlet } from "react-router-dom";
import Header from "./Header";

function CustomerLayout() {
    return (
        <>
            <Header />
            <main >
                <Outlet />
            </main>
        </>
    );
}

export default CustomerLayout;
