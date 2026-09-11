// Auth + retry handling: inject the access token, and transparently
// refresh + retry once on a 401 before giving up on the session.

import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

import { getFreshAccessToken } from "./tokenRefresh";
import { createRequestController, removeRequestController, cancelAllRequests } from "./requestManager";
import { useAuthStore } from "../../../store/zustand/authStore";

/* =========================================================
   Types
========================================================= */

export type RetryRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
    _requestController?: AbortController;
};

/* =========================================================
   Session Expiration
========================================================= */

function handleSessionExpired(): void {
    cancelAllRequests();
    useAuthStore.getState().clearTokens();

    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.replace("/login");
    }
}

/* =========================================================
   Error Helpers
========================================================= */

function isTokenExpiredError(error: AxiosError): boolean {
    const status = error.response?.status;

    // Any 401 Unauthorized response on an authenticated client
    // indicates an expired or invalid access token.
    return status === 401;
}

/* =========================================================
   Request Interceptor
========================================================= */

function attachRequestInterceptor(instance: AxiosInstance): void {
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const controller = createRequestController();
            config.signal = controller.signal;
            (config as RetryRequestConfig)._requestController = controller;

            const { accessToken } = useAuthStore.getState();

            if (accessToken) {
                if (typeof config.headers.set === "function") {
                    config.headers.set("Authorization", `Bearer ${accessToken}`);
                } else {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
            } else {
                if (typeof config.headers.delete === "function") {
                    config.headers.delete("Authorization");
                } else {
                    delete config.headers.Authorization;
                }
            }

            return config;
        },
        (error) => Promise.reject(error),
    );
}

/* =========================================================
   Response Interceptor
========================================================= */

function attachResponseInterceptor(instance: AxiosInstance): void {
    instance.interceptors.response.use(
        (response) => {
            const controller = (response.config as RetryRequestConfig)._requestController;

            if (controller) {
                removeRequestController(controller);
            }

            return response;
        },

        async (error: AxiosError) => {
            const originalRequest = error.config as RetryRequestConfig | undefined;

            if (!originalRequest) {
                return Promise.reject(error);
            }

            const currentController = originalRequest._requestController;

            // Normal API error (400 / 403 / 404 / 409 / 422 / 500 ...)
            if (!isTokenExpiredError(error)) {
                if (currentController) {
                    removeRequestController(currentController);
                }

                return Promise.reject(error);
            }

            // Prevent infinite retry loops.
            if (originalRequest._retry) {
                if (currentController) {
                    removeRequestController(currentController);
                }

                handleSessionExpired();
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                const currentStoredToken = useAuthStore.getState().accessToken;

                const requestAuthHeader =
                    typeof originalRequest.headers?.get === "function"
                        ? originalRequest.headers.get("Authorization")
                        : (originalRequest.headers?.Authorization as string | undefined);

                const requestToken =
                    typeof requestAuthHeader === "string"
                        ? requestAuthHeader.replace(/^Bearer\s+/i, "").trim()
                        : null;

                let newAccessToken: string;

                if (currentStoredToken && requestToken && currentStoredToken !== requestToken) {
                    newAccessToken = currentStoredToken;
                } else {
                    newAccessToken = await getFreshAccessToken();
                }

                if (typeof originalRequest.headers.set === "function") {
                    originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
                } else {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }

                if (currentController) {
                    removeRequestController(currentController);
                }

                // Clear the stale signal so the request interceptor
                // assigns a brand-new AbortController for the retry.
                delete (originalRequest as RetryRequestConfig & { signal?: unknown }).signal;
                delete originalRequest._requestController;

                return instance(originalRequest);
            } catch (refreshError) {
                if (currentController) {
                    removeRequestController(currentController);
                }

                handleSessionExpired();
                return Promise.reject(refreshError);
            }
        },
    );
}

/* =========================================================
   Configure Axios Client
========================================================= */

export function configureClient(instance: AxiosInstance): void {
    attachRequestInterceptor(instance);
    attachResponseInterceptor(instance);
}
