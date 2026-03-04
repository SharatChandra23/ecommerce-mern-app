import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AppHeading from "../components/common/AppHeading";
import AppButton from "../components/common/AppButton";
import { getGuestCart } from "../utils/cartStorage";
import { useCart } from "../context/CartContext";
function Signup() {

  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useContext(AuthContext);
  const { mergeGuestCart } = useCart();

  const redirect =
    new URLSearchParams(location.search).get("redirect") || "/";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await signup(form);   // sets token + user properly
      if (res && res.role != 'admin') {
        const guestCart = getGuestCart();
        if (guestCart.length > 0) {
          // Merge immediately after signup before navigating
          try {
            await mergeGuestCart();
          } catch (err) {
            console.warn("Cart merge failed:", err);
            // non-critical — still navigate to cart
          }
          navigate("/cart");
        } else {
          navigate("/");
        }
      } else {
        navigate("/admin/products");
      }
    } catch (error) {
      console.error(error.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center py-20 bg-gray-100">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

        <AppHeading
          level={3}
          align="center"
          variant="primary"
          className="mb-8"
        >
          Create Account
        </AppHeading>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number (Optional)"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
              required
            />
          </div>

          {/* Submit Button */}
          <AppButton
            type="submit"
            variant="primary"
            fullWidth
          >
            Sign Up
          </AppButton>

        </form>

        {/* Login Redirect */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-slate-900 font-medium hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;