import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function MainLayout() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100">
                <Outlet />
            </div>
        </>
    );
}

export default MainLayout;