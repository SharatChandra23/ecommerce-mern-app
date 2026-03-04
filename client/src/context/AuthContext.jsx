import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const navigate = useNavigate();

    const clearAuth = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
    }, []);

    const handleUnauthorized = useCallback(() => {
        clearAuth();
        sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
        navigate("/login", { replace: true });
    }, [clearAuth, navigate]);

    //  Listen for unauthorized events fired by api.js
    useEffect(() => {
        window.addEventListener("unauthorized", handleUnauthorized);
        return () => window.removeEventListener("unauthorized", handleUnauthorized);
    }, [handleUnauthorized]);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Always fetch CSRF first, regardless of login state
                const csrfRes = await API.get("/auth/csrf-token", { skipAuth: true });
                sessionStorage.setItem("csrfToken", csrfRes.data.csrfToken);

                //  Restore user instantly from localStorage
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }

                const storedToken = localStorage.getItem("accessToken");

                //  If no token at all, don't even call /auth/me
                if (!storedToken) {
                    setLoading(false);
                    return;
                }

                //  Now validate session with backend
                const res = await API.get("/auth/me");
                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));

            } catch (err) {
                //  Only clear auth on actual 401 — not network/server errors
                if (err.response?.status === 401) {
                    clearAuth(); // silently clear, don't redirect
                    // ProtectedRoute will handle navigation
                } else {
                    // Network error / 500 — keep stored user, don't log out
                    console.warn("Auth check failed (non-401), keeping session:", err.message);
                }
            } finally {
                setLoading(false); //  Always unblock the app
            }
        };

        initializeAuth();
    }, [clearAuth]);

    const login = async (email, password) => {
        const res = await API.post("/auth/login", { email, password });
        const { accessToken, user } = res.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        return user;
    };

    const signup = async (formData) => {
        const res = await API.post("/auth/signup", formData);
        const { accessToken, user } = res.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        return user;
    };

    const logout = async () => {
        if (logoutLoading) return; // prevent double-clicks
        setLogoutLoading(true);
        try {
            await API.post("/auth/logout");
        } catch (err) {
            console.warn("Server logout failed:", err); // non-critical, always proceed
        }

        // Clean up any stale redirect from previous session
        sessionStorage.removeItem("redirectAfterLogin");

        clearAuth();
        window.location.href = "/login"; // navigates + reloads in one step
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, handleUnauthorized }}>
            {children}
        </AuthContext.Provider>
    );
};