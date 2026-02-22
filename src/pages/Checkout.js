import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [navigate, user]);

    return (
        <div className="p-10">
            <h2 className="text-2xl font-bold">
                Checkout Page
            </h2>
        </div>
    );
}

export default Checkout;