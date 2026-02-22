import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";

function Cart() {
    const { cart } = useContext(CartContext);

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto p-8 flex flex-col md:flex-row gap-10">

                <div className="flex-1">
                    {cart.map(item => (
                        <CartItem key={item.id} item={item} />
                    ))}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md w-full md:w-1/3 h-fit">
                    <h3 className="text-xl font-semibold mb-4">
                        Order Summary
                    </h3>

                    <p className="flex justify-between">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </p>

                    <Link to="/checkout">
                        <button className="mt-6 w-full bg-slate-900 text-white py-3 rounded-md">
                            Proceed to Checkout
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Cart;