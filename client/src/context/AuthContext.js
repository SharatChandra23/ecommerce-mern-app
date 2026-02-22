import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshAccessToken = async () => {
        try {
            const res = await axiosInstance.post("/auth/refresh");
            const newToken = res.data.accessToken;

            localStorage.setItem("token", newToken);
            axiosInstance.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${newToken}`;

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
                    !originalRequest._retry
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
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        axiosInstance.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${token}`;

        axiosInstance
            .get("/auth/me")
            .then((res) => setUser(res.data))
            .catch(() => logout())
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        const res = await axiosInstance.post("/auth/login", {
            email,
            password,
        });

        const { accessToken, user } = res.data;

        localStorage.setItem("token", accessToken);
        axiosInstance.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${accessToken}`;

        setUser(user); // includes isAdmin
    };

    const logout = () => {
        localStorage.removeItem("token");
        delete axiosInstance.defaults.headers.common["Authorization"];
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
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};