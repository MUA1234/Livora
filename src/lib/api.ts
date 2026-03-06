import axios from "axios";

// Create Axios Instance
const api = axios.create({
    baseURL: "http://localhost:5000",
});

// Request Interceptor: Attach Token automatically
api.interceptors.request.use(
    (config) => {
        // Only access localStorage if window is defined (Client-side)
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

// Response Interceptor: Handle 401s centrally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear token and redirect to login if unauthorized
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/admin/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
