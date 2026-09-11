import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientAdmin } from "../../../shared/api/client/apiClient";
import type { AdminsItem } from "../types/admins.types";

// No dedicated screen design was supplied for this module yet — the
// folder scaffold (api/hooks/screens/types/utils/validation) mirrors
// every other feature so the real implementation can drop straight in.
export const adminsApi = {
    list: async (): Promise<AdminsItem[]> => {
        try {
            const { data } = await clientAdmin.get<AdminsItem[]>("/admins");
            return data;
        } catch (error) {
            console.warn("Admins API not implemented yet:", getApiErrorMessage(error));
            return [];
        }
    },
};
