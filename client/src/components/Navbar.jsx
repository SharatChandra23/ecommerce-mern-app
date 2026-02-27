import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import { FaCartPlus } from "react-icons/fa";

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
            <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold tracking-wide">
                    Online Store
                </Link>

                <div className="flex items-center gap-6 relative">

                    {/* Cart Icon */}
                    <div
                        onClick={() => !user ? setCartOpen(true) : openPage("/cart")}
                        className="relative cursor-pointer hover:text-gray-300 transition"
                    >
                        <FaCartPlus size={30} />  {/* Cart Icon */}
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                                {cartCount > 99 ? "99+" : cartCount}
                            </span>
                        )}
                    </div>

                    {!user ? (
                        <>
                            <Link to="/login" className="hover:text-gray-300">
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                className="bg-white text-slate-900 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                            >
                                Signup
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/orders"
                                className="block px-4 py-2 hover:bg-gray-100"
                            >
                                Orders
                            </Link>

                            <div className="relative">

                                <button
                                    onClick={() => setOpen(!open)}
                                    className="bg-white text-slate-900 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                                >
                                    {user.name}
                                </button>

                                {open && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg overflow-hidden z-50">

                                        {user.role == 'user' && (
                                            <>
                                                <Link
                                                    to="/profile"
                                                    className="block px-4 py-2 hover:bg-gray-100"
                                                >
                                                    Profile
                                                </Link>
                                                <Link
                                                    to="/address"
                                                    className="block px-4 py-2 hover:bg-gray-100"
                                                >
                                                    Addresses
                                                </Link>
                                            </>
                                        )}

                                        {user.role == 'admin' && (
                                            <>
                                                <div className="px-4 py-2 text-sm font-semibold text-gray-500 border-b">
                                                    Admin Panel
                                                </div>

                                                <Link
                                                    to="/admin/coupons"
                                                    onClick={() => setOpen(false)}
                                                    className="block px-4 py-2 hover:bg-gray-100"
                                                >
                                                    Manage Coupons
                                                </Link>

                                                <Link
                                                    to="/admin/products"
                                                    onClick={() => setOpen(false)}
                                                    className="block px-4 py-2 hover:bg-gray-100"
                                                >
                                                    Manage Products
                                                </Link>

                                                <Link
                                                    to="/admin/add-product"
                                                    onClick={() => setOpen(false)}
                                                    className="block px-4 py-2 hover:bg-gray-100"
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
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 border-t"
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