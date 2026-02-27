import { createContext, useState, useEffect } from "react";
import API from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user on app start
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Restore instantly from localStorage
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }

                // Always validate with backend
                const csrfRes = await API.get("/auth/csrf-token");
                sessionStorage.setItem("csrfToken", csrfRes.data.csrfToken);

                const res = await API.get("/auth/me");

                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));

            } catch {
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        const res = await API.post("/auth/login", { email, password });

        const { accessToken, user } = res.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user); // backend returns user object
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
        try {
            await API.post("/auth/logout");
        } catch { }

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};