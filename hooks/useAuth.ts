import { useState, useEffect } from "react";
import { secureGet } from "@/utils/storage";

export function useAuth() {
    const [token, setToken] = useState("")
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchToken = async () => {
            const token = await secureGet("token");
            setToken(token || "");
            setIsLoading(false);
        }
        fetchToken();
    }, []);

    return { token, isLoggedIn: !!token, isLoading };
}