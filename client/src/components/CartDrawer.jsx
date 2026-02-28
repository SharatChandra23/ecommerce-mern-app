import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import AppButton from "./common/AppButton";

function CartDrawer({ isOpen, onClose }) {
    const { user } = useContext(AuthContext);
    const { cartItems, cartTotal, removeItem } = useCart();
    const navigate = useNavigate();

    const navigatoToSignup = () => {
        navigate("/signup?redirect=checkout");
        onClose();
    };

    const navigatoToCheckout = () => {
        navigate("/signup?redirect=checkout");
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black bg-opacity-40 z-40"
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-4 flex justify-between border-b">
                    <h2 className="font-bold text-lg">Your Cart</h2>
                    <AppButton onClick={onClose} variant="danger">Close</AppButton>
                </div>

                <div className="p-4 overflow-y-auto h-[70%]">
                    {cartItems.length === 0 ? (
                        <p className="text-gray-500">Cart is empty</p>
                    ) : (
                        cartItems.map((item) => (
                            <div
                                key={item._id}
                                className="flex justify-between items-center mb-4"
                            >
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-500">
                                        Qty: {item.quantity}
                                    </p>
                                </div>

                                <AppButton
                                    onClick={() => removeItem(item._id)}
                                    variant="danger"
                                    className="text-sm"
                                >
                                    Remove
                                </AppButton>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t">
                    <p className="font-bold mb-3">
                        Total: ${cartTotal}
                    </p>

                    {!user ? (
                        <AppButton
                            onClick={navigatoToSignup}
                            fullWidth
                        >
                            Checkout
                        </AppButton>
                    ) : (

                        <AppButton
                            onClick={navigatoToCheckout}
                            fullWidth
                        >
                            Checkout
                        </AppButton>
                    )}
                </div>
            </div>
        </>
    );
}

export default CartDrawer;