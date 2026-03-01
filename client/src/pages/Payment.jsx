import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/api";
import { useCart } from "../context/CartContext";
import AppButton from "../components/common/AppButton";
import { FaCreditCard } from "react-icons/fa";
import toast from "react-hot-toast";

function Payment() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        try {
            setLoading(true);

            await API.post("/payments", {
                orderId,
                status: "success",
            });
            // trigger the clear cart in UI cart context
            clearCart();
            navigate("/orders");
        } catch (error) {
            console.error(error);
            toast.error("Payment failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Fake Payment Gateway</h2>

            <div className="border p-6 rounded shadow">
                <p className="mb-4">Card Number: 4242 4242 4242 4242</p>

                <AppButton
                    onClick={handlePayment}
                    disabled={loading}
                    variant="orange"
                    icon={<FaCreditCard size={16} />}
                >
                    {loading ? "Processing..." : "Pay Now"}
                </AppButton>
            </div>
        </div>
    );
}

export default Payment;