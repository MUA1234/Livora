export interface AuthUser {
    name?: string;
    email?: string;
    role?: string;
    [key: string]: unknown;
}

export const setAuthData = (token: string, user: AuthUser) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        document.cookie = `livora-token=${token}; path=/; max-age=604800`;
    }
};

export const getToken = (): string | null => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
};

export const getUser = (): AuthUser | null => {
    if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
    }
    return null;
};

export const isAdmin = (): boolean => {
    const user = getUser();
    return user?.role === "admin";
};

export const isLoggedIn = (): boolean => {
    return !!getToken();
};

export const logout = () => {
    if (typeof window !== "undefined") {
        const admin = isAdmin();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        document.cookie = "livora-token=; path=/; max-age=0";
        window.location.href = admin ? "/admin/login" : "/user-panel/login";
    }
};
