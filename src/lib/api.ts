import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            if (typeof window !== "undefined") {
                try {
                    const userStr = localStorage.getItem("user");
                    const isAdmin = userStr ? JSON.parse(userStr)?.role === "admin" : false;
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    document.cookie = "livora-token=; path=/; max-age=0";
                    window.location.href = isAdmin ? "/admin/login" : "/user-panel/login";
                } catch {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/user-panel/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
