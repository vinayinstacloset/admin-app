import axios from "axios";

/* =========================================================
   Types
========================================================= */

export interface ApiErrorResponse {
    message?: string;
    error?: string;
    code?: string;
    status?: number;
    timestamp?: string;
    [key: string]: unknown;
}

/* =========================================================
   Get API Error Message
========================================================= */

export function getApiErrorMessage(error: unknown, fallbackMessage = "Something went wrong"): string {
    if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as ApiErrorResponse | string | undefined;

        // Backend returned a plain string
        if (typeof responseData === "string" && responseData.trim()) {
            return responseData;
        }

        // Backend returned an object
        if (typeof responseData === "object" && responseData !== null) {
            if (typeof responseData.message === "string" && responseData.message.trim()) {
                return responseData.message;
            }

            if (typeof responseData.error === "string" && responseData.error.trim()) {
                return responseData.error;
            }
        }

        // Axios/network error
        if (typeof error.message === "string" && error.message.trim()) {
            return error.message;
        }
    }

    // Normal JavaScript Error
    if (error instanceof Error) {
        if (error.message.trim()) {
            return error.message;
        }
    }

    return fallbackMessage;
}

/* =========================================================
   Get HTTP Status
========================================================= */

export function getApiErrorStatus(error: unknown): number | undefined {
    if (axios.isAxiosError(error)) {
        return error.response?.status;
    }

    return undefined;
}

/* =========================================================
   Check HTTP Status
========================================================= */

export function isApiErrorStatus(error: unknown, status: number): boolean {
    return getApiErrorStatus(error) === status;
}

/* =========================================================
   Check Not Found
========================================================= */

export function isNotFoundError(error: unknown): boolean {
    return isApiErrorStatus(error, 404);
}
