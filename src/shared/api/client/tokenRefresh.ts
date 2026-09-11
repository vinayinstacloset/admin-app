import { useAuthStore } from "../../../store/zustand/authStore";
import { refreshAccessToken } from "../auth/authClient";

// Single-flight refresh — concurrent 401s all await the same promise
// instead of firing multiple refresh requests.
let refreshPromise: Promise<string> | null = null;

export async function getFreshAccessToken(): Promise<string> {
    if (refreshPromise) {
        return refreshPromise;
    }

    const { refreshToken, setTokens, clearTokens } = useAuthStore.getState();

    if (!refreshToken) {
        clearTokens();
        throw new Error("Refresh token is not available");
    }

    refreshPromise = (async () => {
        try {
            const tokens = await refreshAccessToken(refreshToken);

            setTokens({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            });

            return tokens.accessToken;
        } catch (error) {
            clearTokens();
            throw error;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}
