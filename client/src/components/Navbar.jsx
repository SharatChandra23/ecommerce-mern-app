import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

import { FaShoppingBag, FaCartPlus, FaChevronDown, FaShoppingCart } from "react-icons/fa";
import AppButton from "./common/AppButton";

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
            <nav className="outlinesticky top-0 z-50
      bg-white/80 backdrop-blur-md
      shadow-sm
      px-8 py-4
      flex justify-between items-center">

                {/* ================= LOGO ================= */}
                <div
                    onClick={() => navigate("/")}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="
                        bg-gradient-to-r from-orange-500 to-red-500
                        p-2 rounded-xl shadow-md
                        group-hover:scale-105 transition
                        ">
                        <FaShoppingBag className="text-white text-lg" />
                    </div>

                    <span className="text-xl font-semibold tracking-wide text-slate-800">
                        Online <span className="text-orange-500 font-bold">Store</span>
                    </span>
                </div>

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

                    {/* <AppButton
                        variant="ghost"
                        circle
                        icon={<FaCartPlus size={30} />}
                        className="relative cursor-pointer group"
                        onClick={() => !user ? setCartOpen(true) : openPage("/cart")}
                    >
                        <span
                            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs 
                            w-5 h-5 flex items-center justify-center rounded-full
                            shadow-md animate-pulse">
                            {cartCount > 99 ? "99+" : cartCount}
                        </span>
                    </AppButton> */}


                    {!user ? (
                        <>
                            <AppButton
                                onClick={() => navigate("/login")}
                                variant="outline"
                            >
                                Login
                            </AppButton>

                            <AppButton
                                onClick={() => navigate("/signup")}
                                variant="primary"
                            >
                                Signup
                            </AppButton>
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

                                <AppButton
                                    onClick={() => setOpen(!open)}
                                    icon={<FaChevronDown size={12} />}
                                    variant="orange">
                                    <span className="font-medium">
                                        {user.name}
                                    </span>
                                </AppButton>

                                {open && (
                                    <div
                                        className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border 
                                        overflow-hidden animate-fadeIn z-50">

                                        {user.role === "user" && (
                                            <>
                                                <AppButton
                                                    onClick={() => { navigate("/profile"); setOpen(false); }}
                                                    variant="outline"
                                                    fullWidth
                                                >
                                                    Profile
                                                </AppButton>

                                                <AppButton
                                                    onClick={() => { navigate("/address"); setOpen(false); }}
                                                    variant="outline"
                                                    fullWidth
                                                >
                                                    Addresses
                                                </AppButton>
                                            </>
                                        )}

                                        {user.role === "admin" && (
                                            <>
                                                <div className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase border-b">
                                                    Admin Panel
                                                </div>

                                                <AppButton
                                                    onClick={() => { navigate("/admin/coupons"); setOpen(false); }}
                                                    variant="outline"
                                                    fullWidth
                                                >
                                                    Manage Coupons
                                                </AppButton>

                                                <AppButton
                                                    onClick={() => { navigate("/admin/products"); setOpen(false); }}
                                                    variant="outline"
                                                    fullWidth
                                                >
                                                    Manage Products
                                                </AppButton>


                                                <AppButton
                                                    onClick={() => { navigate("/admin/add-product"); setOpen(false); }}
                                                    variant="outline"
                                                    fullWidth
                                                >
                                                    Add Product
                                                </AppButton>
                                            </>
                                        )}

                                        <AppButton
                                            onClick={() => {
                                                logout();
                                                setOpen(false);
                                            }}
                                            variant="outline"
                                            fullWidth
                                        >
                                            Logout
                                        </AppButton>

                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </nav >

            {/* Cart Drawer */}
            < CartDrawer
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)
                }
            />
        </>
    );
}

export default Navbar;