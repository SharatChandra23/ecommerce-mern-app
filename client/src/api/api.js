import axios from "axios";

const API = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) =>
        error ? prom.reject(error) : prom.resolve(token)
    );
    failedQueue = [];
};

//  Fire a custom event — AuthContext listens and handles redirect softly
const emitUnauthorized = () => {
    window.dispatchEvent(new Event("unauthorized"));
};

// ── Request Interceptor ──
API.interceptors.request.use((config) => {
    //  Skip auth header for CSRF or any request flagged skipAuth
    if (config.skipAuth) return config;

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (["post", "put", "patch", "delete"].includes(config.method)) {
        const csrfToken = sessionStorage.getItem("csrfToken");
        if (csrfToken) {
            config.headers["x-csrf-token"] = csrfToken;
        }
    }

    return config;
});

// ── Response Interceptor ──
API.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const msg = error.response?.data?.message;

        // ── No token at all → emit event, don't hard redirect ──
        if (status === 401 && msg === "Not authorized, no token") {
            emitUnauthorized(); //  AuthContext handles this
            return Promise.reject(error);
        }

        // ── Token expired → try silent refresh ──
        if (status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return API(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await axios.get("/api/auth/refresh", {
                    withCredentials: true,
                });

                const newAccessToken = response.data.accessToken;
                localStorage.setItem("accessToken", newAccessToken);

                if (response.data.csrfToken) {
                    sessionStorage.setItem("csrfToken", response.data.csrfToken);
                }

                API.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);
                return API(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                emitUnauthorized(); //  Soft redirect via event
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default API;