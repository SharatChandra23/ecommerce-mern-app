import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const setAuthToken = (token) => {
        if (token) {
            localStorage.setItem("token", token);
            axiosInstance.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token}`;
        } else {
            localStorage.removeItem("token");
            delete axiosInstance.defaults.headers.common["Authorization"];
        }
    };

    const refreshAccessToken = async () => {
        try {
            const res = await axiosInstance.post("/auth/refresh");
            const newToken = res.data.accessToken;
            setAuthToken(newToken);

            return newToken;
        } catch (err) {
            logout();
            throw err;
        }
    };

    useEffect(() => {
        const interceptor = axiosInstance.interceptors.response.use(
            (res) => res,
            async (error) => {
                const originalRequest = error.config;

                if (
                    error.response?.status === 401 &&
                    !originalRequest._retry &&
                    !originalRequest.url.includes("/auth/refresh")
                ) {
                    originalRequest._retry = true;

                    try {
                        const newToken = await refreshAccessToken();
                        originalRequest.headers[
                            "Authorization"
                        ] = `Bearer ${newToken}`;
                        return axiosInstance(originalRequest);
                    } catch {
                        logout();
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.response.eject(interceptor);
        };
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            setAuthToken(token);

            try {
                const res = await axiosInstance.get("/auth/me");
                setUser(res.data);
            } catch (err) {
                logout();
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        const res = await axiosInstance.post("/auth/login", {
            email,
            password,
        });

        const { accessToken, user } = res.data;
        setAuthToken(accessToken);
        setUser(user);

        return user;
    };

    const signup = async (formData) => {
        const res = await axiosInstance.post("/auth/signup", formData);

        const { accessToken, user } = res.data;
        setAuthToken(accessToken);
        setUser(user);

        return user; // important
    };

    const logout = () => {
        setAuthToken(null);
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