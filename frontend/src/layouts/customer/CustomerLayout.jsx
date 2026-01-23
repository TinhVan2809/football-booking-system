import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function CustomerLayout() {
    return (
        <>
            <Header />
            <main >
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export default CustomerLayout;
