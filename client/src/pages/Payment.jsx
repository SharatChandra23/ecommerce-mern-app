import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/api";

function Payment() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        try {
            setLoading(true);

            await API.post("/payments", {
                orderId,
                status: "success",
            });

            navigate("/orders");
        } catch (error) {
            console.error(error);
            alert("Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Fake Payment Gateway</h2>

            <div className="border p-6 rounded shadow">
                <p className="mb-4">Card Number: 4242 4242 4242 4242</p>

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded"
                >
                    {loading ? "Processing..." : "Pay Now"}
                </button>
            </div>
        </div>
    );
}

export default Payment;