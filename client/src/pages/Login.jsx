import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import AppHeading from "../components/common/AppHeading";
import AppButton from "../components/common/AppButton";

function Login() {
    const { mergeGuestCart } = useCart();
    const { login } = useContext(AuthContext);

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation(); //  Now actually used

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(form.email, form.password);

            //  Merge cart BEFORE navigating so errors can be caught
            try {
                await mergeGuestCart();
            } catch {
                // Non-critical — don't block login if cart merge fails
            }

            //  Check both location.state (React Router) and sessionStorage
            const redirectPath =
                location.state?.from?.pathname ||           // from ProtectedRoute
                sessionStorage.getItem("redirectAfterLogin") || // from api.js
                "/";

            sessionStorage.removeItem("redirectAfterLogin");
            navigate(redirectPath, { replace: true }); //  replace so /login isn't in history

        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center py-20 bg-gray-100">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

                <AppHeading level={3} align="center" variant="primary" className="mb-8">
                    Login
                </AppHeading>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="example@email.com"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                            required
                        />
                    </div>

                    <AppButton
                        type="submit"
                        disabled={loading}
                        variant="primary"
                        fullWidth
                        className={`${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-slate-900 text-white hover:bg-slate-800"
                        }`}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </AppButton>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-slate-900 font-medium hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;