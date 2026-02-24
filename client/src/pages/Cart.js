import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { getGuestCart } from "../utils/cartUtils";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const loadCart = async () => {
            if (!token) {
                // Guest Cart
                const guestCart = getGuestCart();
                setCartItems(guestCart);
            } else {
                // Logged-in cart
                const { data } = await axiosInstance.get("/cart");
                setCartItems(data.items || []);
            }
        };

        loadCart();
    }, [token]);

    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

            {cartItems.length === 0 ? (
                <p>No items in cart</p>
            ) : (
                <>
                    {cartItems.map((item) => (
                        <div
                            key={item._id}
                            className="flex justify-between border-b py-4"
                        >
                            <div>
                                <h3 className="font-semibold">{item.name}</h3>
                                <p>Qty: {item.quantity}</p>
                            </div>
                            <p>${item.price}</p>
                        </div>
                    ))}

                    <div className="mt-6 text-right font-bold">
                        Total: ${totalPrice}
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;