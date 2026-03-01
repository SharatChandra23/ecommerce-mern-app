import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import CartCouponDrawer from "../components/common/CartCouponDrawer";
import { FaMinus, FaPlus, FaTrash, FaCartPlus, FaShoppingBag, FaTicketAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import AppButton from "../components/common/AppButton";

function Cart() {
    const BASE_URL = import.meta.env.VITE_API_URL;
    const [animate, setAnimate] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [showDrawer, setShowDrawer] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [deliveryInstructions, setDeliveryInstructions] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");

    const emptyCartImage = "./images/empty-cart.png";

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        loadCart();
    }, []);

    useEffect(() => {
        if (appliedCoupon) {
            setAppliedCoupon(null);
            setDiscount(0);
        }
    }, [cartItems]);

    const loadCart = async () => {
        const { data } = await API.get("/cart");
        setCartItems(data?.items || []);
    };

    const handleIncrease = (item) => {
        setAnimate(true);
        increaseQty(item.product._id, item.quantity);
        setTimeout(() => setAnimate(false), 300);
    };

    // ---------------- Increase ----------------
    const increaseQty = async (productId, stock, quantity) => {
        if (quantity >= stock) {
            toast.error("Stock limit reached");
            return;
        }

        await API.put(`/cart/increase/${productId}`);
        loadCart();
    };

    // ---------------- Decrease ----------------
    const decreaseQty = async (productId, quantity) => {
        if (quantity === 1) {
            await removeItem(productId);
            return;
        }

        await API.put(`/cart/decrease/${productId}`);
        loadCart();
    };

    // ---------------- Remove ----------------
    const removeItem = async (productId) => {
        await API.delete(`/cart/${productId}`);
        loadCart();
    };

    // ---------------- Calculations ----------------
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


    const freeDeliveryThreshold = 1000;
    const remainingForFree =
        freeDeliveryThreshold - subtotal;

    // ---------------- Stock Validation ----------------
    const validateStock = async () => {
        const res = await API.post("/cart/validate");

        if (!res.data.success) {
            toast.error(res.data.message);
            return false;
        }

        return true;
    };

    const handleCheckout = async () => {
        const valid = await validateStock();
        if (!valid) return;

        navigate("/checkout", {
            state: {
                deliveryInstructions,
                appliedCoupon,
            },
        });
    };

    return (
        <>
            <CartCouponDrawer
                open={showDrawer}
                onClose={() => setShowDrawer(false)}
                subtotal={subtotal}
                onApply={(amount, code) => {
                    setDiscount(amount);
                    setAppliedCoupon(code);
                }}
            />

            <div className="max-w-7xl mx-auto p-6">

                {/* ---------------- EMPTY CART ---------------- */}
                {cartItems.length === 0 ? (
                    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 float-animation">
                        <img
                            src={emptyCartImage}
                            alt="Empty Cart"
                            className="w-72 mb-6"
                        />

                        <h2 className="text-3xl font-bold text-gray-800 mb-3">
                            Your Cart is{" "}
                            <span className="text-red-500">Empty!</span>
                        </h2>

                        <p className="text-gray-500 mb-6 max-w-md">
                            Looks like you haven't added anything to your cart yet.
                            Start shopping to fill it up.
                        </p>

                        <AppButton
                            variant="orange"
                            size="lg"
                            icon={<FaCartPlus />}
                            animateIcon
                            className="rounded-full shadow-xl"
                            onClick={() => navigate("/")}
                        >
                            Start Shopping
                        </AppButton>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold tracking-tight">
                                Your Cart
                            </h2>

                            <AppButton
                                onClick={() => navigate("/")}
                                variant="primary"
                                icon={<FaCartPlus size={16} />}
                            >
                                Add More Items
                            </AppButton>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                            {/* LEFT SIDE - ITEMS */}
                            <div className="lg:col-span-2 space-y-6">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.product._id}
                                        className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition"
                                    >
                                        <div className="flex items-center gap-6">
                                            <img
                                                src={`${BASE_URL}${item.product.image}`}
                                                alt={item.product.name}
                                                className="w-24 h-24 object-cover rounded-lg"
                                            />

                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {item.product.name}
                                                </h3>

                                                <p className="text-gray-500 text-sm">
                                                    ₹{item.product.price}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3 mt-4">

                                                    <AppButton
                                                        circle
                                                        variant="outline"
                                                        size="md"
                                                        disabled={item.quantity <= 1}
                                                        icon={<FaMinus size={12} />}
                                                        onClick={() =>
                                                            decreaseQty(item.product._id, item.quantity)
                                                        }
                                                        className="hover:bg-red-500 hover:text-white hover:border-red-500 shadow-sm"
                                                    />

                                                    <span className={`text-lg font-semibold px-4 transition-transform duration-200 
                                                        ${animate ? "scale-125 text-emerald-600" : ""
                                                        }`}>
                                                        {item.quantity}
                                                    </span>

                                                    <AppButton
                                                        circle
                                                        variant="outline"
                                                        size="md"
                                                        icon={<FaPlus size={12} />}
                                                        onClick={() => handleIncrease(item)}
                                                        className="hover:bg-green-500 hover:text-white hover:border-red-500 shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-bold text-lg">
                                                ₹
                                                {(
                                                    (item.product.discountPrice ||
                                                        item.product.price) *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </p>

                                            <AppButton
                                                onClick={() => removeItem(item.product._id)}
                                                variant="primary"
                                                icon={<FaTrash size={12} />}>
                                                Remove
                                            </AppButton>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* RIGHT SIDE - SUMMARY */}
                            <div className="bg-white p-6 rounded-xl shadow-md border sticky top-24 h-fit">
                                <h3 className="font-semibold text-xl mb-6">
                                    Order Summary
                                </h3>

                                <div className="space-y-3 text-sm">

                                    {(subtotal < freeDeliveryThreshold) && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-600 mb-2">
                                                Add ₹{remainingForFree.toFixed(2)} more to get
                                                <span className="text-green-600 font-semibold">
                                                    Free Delivery
                                                </span>
                                            </p>

                                            <div className="w-full bg-gray-200 h-2 rounded-full">
                                                <div className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${Math.min((subtotal / freeDeliveryThreshold) * 100, 100)}%`
                                                    }}>
                                                </div>
                                            </div>
                                        </div>
                                    )}

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
                                        <div className="flex justify-between items-center bg-green-50 border border-green-200 p-3 rounded-lg text-green-700">
                                            <div>
                                                <p className="font-semibold">
                                                    Coupon Applied: {appliedCoupon}
                                                </p>
                                                <p className="text-sm">
                                                    You saved ₹{discount.toFixed(2)}
                                                </p>
                                            </div>

                                            <AppButton
                                                onClick={() => {
                                                    setAppliedCoupon(null);
                                                    setDiscount(0);
                                                }}
                                                variant="primary"
                                            >
                                                Remove
                                            </AppButton>
                                        </div>
                                    )}

                                    <hr />

                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total Payable</span>
                                        <span>₹{finalAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                <AppButton
                                    onClick={() => setShowDrawer(true)}
                                    variant="yellow"
                                    icon={<FaTicketAlt size={16} />}
                                >
                                    Apply Coupon
                                </AppButton>

                                <textarea
                                    placeholder="Delivery instructions (optional)"
                                    value={deliveryInstructions}
                                    onChange={(e) =>
                                        setDeliveryInstructions(e.target.value)
                                    }
                                    className="w-full border rounded-lg p-3 mt-4"
                                />

                                <AppButton
                                    onClick={handleCheckout}
                                    variant="primary"
                                    icon={<FaShoppingBag size={16} />}
                                    fullWidth
                                >
                                    Proceed to Checkout
                                </AppButton>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default Cart;