import { getApiErrorMessage } from "../../../shared/api/apiError";
import { authClient } from "../../../shared/api/auth/authClient";
import type { AdminRegistrationRequest, AdminRegistrationResponse } from "../types/registration.types";

export const adminRegistrationService = {
    register: async (payload: AdminRegistrationRequest): Promise<AdminRegistrationResponse> => {
        try {
            const response = await authClient.post<AdminRegistrationResponse>("/auth/admin/register", payload);

            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Failed to create account. Please try again."));
        }
    },
};
