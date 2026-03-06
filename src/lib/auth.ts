export const setAuthData = (token: string, user: any) => {
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

export const getUser = (): any | null => {
    if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
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
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        document.cookie = "livora-token=; path=/; max-age=0";
        // We use window.location here because it's a generic utility module 
        // and might be called outside of React components. Next.js router 
        // requires a React Context.
        window.location.href = "/admin/login";
    }
};
