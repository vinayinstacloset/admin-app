import axios from "axios";
import { API_BASE_URL } from "../../../config/env";
import { API_TIMEOUT, DEFAULT_HEADERS } from "../constants";

// A bare axios instance (no auth interceptors) reserved for the
// endpoints that establish or refresh a session in the first place —
// login, OTP, forgot-password, and token refresh.
export const authClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: DEFAULT_HEADERS,
});

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const { data } = await authClient.post<RefreshTokenResponse>("/auth/admin/refresh", {
        refreshToken,
    });

    return data;
}
