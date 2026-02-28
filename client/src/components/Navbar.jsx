import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

import { FaShoppingBag, FaCartPlus, FaChevronDown } from "react-icons/fa";

function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useCart();

    const [open, setOpen] = useState(false); // user dropdown
    const [cartOpen, setCartOpen] = useState(false); // cart drawer

    const openPage = (page) => {
        navigate(page);
    };

    return (
        <>
            <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50 px-8 py-4 flex justify-between items-center">

                {/* ================= LOGO ================= */}
                <Link
                    to="/"
                    className="flex items-center gap-3 text-2xl font-bold text-slate-900 hover:opacity-80 transition"
                >
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl shadow-md">
                        <FaShoppingBag className="text-white text-lg" />
                    </div>

                    <span className="tracking-wide">
                        Online <span className="text-orange-500">Store</span>
                    </span>
                </Link>

                {/* ================= RIGHT SIDE ================= */}
                <div className="flex items-center gap-8 relative">

                    {/* ================= CART ICON ================= */}
                    <div
                        onClick={() => !user ? setCartOpen(true) : openPage("/cart")}
                        className="relative cursor-pointer group"
                    >
                        <div className="p-2 rounded-full bg-gray-100 group-hover:bg-orange-100 transition">
                            <FaCartPlus size={22} className="text-slate-800 group-hover:text-orange-600 transition" />
                        </div>

                        {cartCount > 0 && (
                            <span
                                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs 
          w-5 h-5 flex items-center justify-center rounded-full
          shadow-md animate-pulse"
                            >
                                {cartCount > 99 ? "99+" : cartCount}
                            </span>
                        )}
                    </div>

                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                className="text-slate-700 hover:text-orange-500 transition font-medium"
                            >
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                className="bg-gradient-to-r from-orange-500 to-red-500 
                                text-white px-5 py-2 rounded-full shadow-md
                                hover:scale-105 transition-all"
                            >
                                Signup
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/orders"
                                className="text-slate-700 hover:text-orange-500 transition font-medium"
                            >
                                Orders
                            </Link>

                            {/* ================= USER DROPDOWN ================= */}
                            <div className="relative">

                                <button
                                    onClick={() => setOpen(!open)}
                                    className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition"
                                >
                                    <span className="font-medium text-slate-800">
                                        {user.name}
                                    </span>
                                    <FaChevronDown size={12} />
                                </button>

                                {open && (
                                    <div
                                        className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border 
              overflow-hidden animate-fadeIn z-50"
                                    >

                                        {user.role === "user" && (
                                            <>
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setOpen(false)}
                                                    className="block px-5 py-3 hover:bg-gray-100 transition"
                                                >
                                                    Profile
                                                </Link>

                                                <Link
                                                    to="/address"
                                                    onClick={() => setOpen(false)}
                                                    className="block px-5 py-3 hover:bg-gray-100 transition"
                                                >
                                                    Addresses
                                                </Link>
                                            </>
                                        )}

                                        {user.role === "admin" && (
                                            <>
                                                <div className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase border-b">
                                                    Admin Panel
                                                </div>

                                                <Link
                                                    to="/admin/coupons"
                                                    onClick={() => setOpen(false)}
                                                    className="block px-5 py-3 hover:bg-gray-100 transition"
                                                >
                                                    Manage Coupons
                                                </Link>

                                                <Link
                                                    to="/admin/products"
                                                    onClick={() => setOpen(false)}
                                                    className="block px-5 py-3 hover:bg-gray-100 transition"
                                                >
                                                    Manage Products
                                                </Link>

                                                <Link
                                                    to="/admin/add-product"
                                                    onClick={() => setOpen(false)}
                                                    className="block px-5 py-3 hover:bg-gray-100 transition"
                                                >
                                                    Add Product
                                                </Link>
                                            </>
                                        )}

                                        <button
                                            onClick={() => {
                                                logout();
                                                setOpen(false);
                                            }}
                                            className="w-full text-left px-5 py-3 hover:bg-red-50 text-red-600 border-t transition"
                                        >
                                            Logout
                                        </button>

                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </nav>

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
            />
        </>
    );
}

export default Navbar;