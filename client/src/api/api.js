import axios from "axios";

const API = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

// Attach CSRF only for state-changing requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (["post", "put", "patch", "delete"].includes(config.method)) {
        const token = sessionStorage.getItem("csrfToken");
        if (token) {
            config.headers["x-csrf-token"] = token;
        }
    }
    return config;
});

// Auto refresh
API.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            message !== "Not authorized, no token"
        ) {
            originalRequest._retry = true;

            try {
                const response = await axios.get("/api/auth/refresh", {
                    withCredentials: true,
                });

                const newAccessToken = response.data.accessToken;

                localStorage.setItem("accessToken", newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return API(originalRequest);
            } catch {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
                // Save redirect path
                sessionStorage.setItem("redirectAfterLogin", window.location.pathname);

                window.location.href = "/login";
                return Promise.reject(error);
            }
        }

        // ================= NO TOKEN CASE =================
        if (
            error.response?.status === 401 &&
            message === "Token invalid or expired"
        ) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");

            // Save current page for redirect after login
            sessionStorage.setItem("redirectAfterLogin", window.location.pathname);

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default API;