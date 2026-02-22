import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold tracking-wide">
        Online Store
      </Link>

      <div className="flex items-center gap-6 relative">
        <Link to="/cart" className="hover:text-gray-300 transition">
          Cart ({cart.length})
        </Link>

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
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="bg-white text-slate-900 px-4 py-2 rounded-md hover:bg-gray-200 transition"
            >
              {user.email}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg overflow-hidden z-50">

                {/* Normal User Menu */}
                {!user.isAdmin && (
                  <>
                    <Link
                      to="/orders"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                  </>
                )}

                {/* Admin Menu */}
                {user.isAdmin && (
                  <>
                    <div className="px-4 py-2 text-sm font-semibold text-gray-500 border-b">
                      Admin Panel
                    </div>

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

                {/* Logout */}
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
        )}
      </div>
    </nav>
  );
}

export default Navbar;