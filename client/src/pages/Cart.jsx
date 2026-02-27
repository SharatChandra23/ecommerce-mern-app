import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { getGuestCart, saveGuestCart } from "../utils/cartUtils";
import CartCouponDrawer from "../components/common/CartCouponDrawer";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");

    const [showDrawer, setShowDrawer] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [deliveryInstructions, setDeliveryInstructions] = useState("");

    useEffect(() => {
        loadCart();
    }, [token]);

    useEffect(() => {
        if (appliedCoupon) {
            // If subtotal changes after applying coupon → remove coupon
            setAppliedCoupon(null);
            setDiscount(0);
        }
    }, [cartItems]);

    const loadCart = async () => {
        if (!token) {
            const guestCart = getGuestCart();
            setCartItems(guestCart);
        } else {
            const { data } = await API.get("/cart");
            setCartItems(data.items || []);
        }
    };

    // Increase Quantity
    const increaseQty = async (productId) => {
        if (!token) {
            const updated = cartItems.map(item =>
                item.product._id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            setCartItems(updated);
            saveGuestCart(updated);
        } else {
            await API.put(`/cart/increase/${productId}`);
            loadCart();
        }
    };

    // Decrease Quantity
    const decreaseQty = async (productId) => {
        if (!token) {
            const updated = cartItems
                .map(item =>
                    item.product._id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter(item => item.quantity > 0);

            setCartItems(updated);
            saveGuestCart(updated);
        } else {
            await API.put(`/cart/decrease/${productId}`);
            loadCart();
        }
    };

    // Remove Item
    const removeItem = async (productId) => {
        if (!token) {
            const updated = cartItems.filter(
                item => item.product._id !== productId
            );
            setCartItems(updated);
            saveGuestCart(updated);
        } else {
            await API.delete(`/cart/${productId}`);
            loadCart();
        }
    };

    const subtotal = cartItems.reduce(
        (acc, item) =>
            acc +
            (item.product.discountPrice || item.product.price) *
            item.quantity,
        0
    );

    const tax = subtotal * 0.05;
    const deliveryCharge = subtotal > 1000 ? 0 : 50;

    const finalAmount =
        subtotal + tax + deliveryCharge - discount;

    const handleCheckout = () => {
        if (!token) {
            navigate("/login");
        } else {
            navigate("/checkout");
        }
    };

    return (
        <>
            <CartCouponDrawer
                open={showDrawer}
                onClose={() => setShowDrawer(false)}
                subtotal={subtotal}
                onApply={(discountAmount, code) => {
                    setDiscount(discountAmount);
                    setAppliedCoupon(code);
                }}
            />

            <div className="max-w-6xl mx-auto p-6">
                <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20">
                        <img
                            src="/empty-cart.png"
                            className="w-60 mx-auto mb-4"
                        />
                        <p className="text-lg font-semibold">
                            No items in cart
                        </p>
                    </div>
                ) : (
                    <>
                        {cartItems.map((item) => (
                            <div
                                key={item.product._id}
                                className="flex justify-between items-center border-b py-4"
                            >
                                <div>
                                    <h3 className="font-semibold">
                                        {item.product.name}
                                    </h3>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3 mt-2">
                                        <button
                                            onClick={() => decreaseQty(item.product._id)}
                                            className="px-2 py-1 bg-gray-200 rounded"
                                        >
                                            -
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            onClick={() => increaseQty(item.product._id)}
                                            className="px-2 py-1 bg-gray-200 rounded"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p>${item.product.price}</p>

                                    <button
                                        onClick={() => removeItem(item.product._id)}
                                        className="text-red-500 text-sm mt-2"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="mt-6 bg-gray-50 rounded-xl p-6 shadow-sm">

                            <h3 className="font-semibold text-lg mb-4">
                                Order Summary
                            </h3>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (5%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span>₹{deliveryCharge}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between items-center text-green-600">
                                        <p>
                                            Coupon ({appliedCoupon}) Applied: -₹{discount.toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setAppliedCoupon(null);
                                                setDiscount(0);
                                            }}
                                            className="text-red-500 text-sm underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}

                                <hr />

                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total Payable</span>
                                    <span>₹{finalAmount.toFixed(2)}</span>
                                </div>

                            </div>

                            <button
                                onClick={() => setShowDrawer(true)}
                                className="text-indigo-600 underline mt-4">
                                Apply Coupon
                            </button>

                            <textarea
                                placeholder="Delivery instructions (optional)"
                                value={deliveryInstructions}
                                onChange={(e) =>
                                    setDeliveryInstructions(e.target.value)
                                }
                                className="w-full border rounded p-2 mt-4" />

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-slate-900 text-white py-3 rounded-lg mt-4 hover:bg-slate-700 transition">
                                Proceed to Checkout
                            </button>

                        </div>

                    </>
                )}
            </div>
        </>
    );
}

export default Cart;