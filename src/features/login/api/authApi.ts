import { getApiErrorMessage } from "../../../shared/api/apiError";
import { authClient } from "../../../shared/api/auth/authClient";
import { useAuthStore } from "../../../store/zustand/authStore";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

export const authService = {
    login: async (payload: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await authClient.post<LoginResponse>("/auth/admin/login", payload);

            const data = response.data;
            const accessToken = data?.accessToken ?? data?.token;
            const refreshToken = data?.refreshToken;

            if (accessToken) {
                useAuthStore.getState().setTokens({ accessToken, refreshToken });
            }

            if (data?.admin) {
                useAuthStore.getState().setAdmin({
                    id: data.admin.id,
                    name: data.admin.name,
                    email: data.admin.email,
                    role: data.admin.role,
                });
            }

            return data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Failed to login. Please try again."));
        }
    },

    logout: async (): Promise<void> => {
        const { refreshToken, clearTokens } = useAuthStore.getState();

        try {
            if (refreshToken) {
                await authClient.post("/auth/admin/logout", { refreshToken });
            }
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            clearTokens();
        }
    },

    isAuthenticated: (): boolean => {
        const { accessToken } = useAuthStore.getState();
        return Boolean(accessToken && accessToken.trim().length > 0);
    },
};
