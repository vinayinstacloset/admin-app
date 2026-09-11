import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientAdmin } from "../../../shared/api/client/apiClient";
import type { SupportItem } from "../types/support.types";

// No dedicated screen design was supplied for this module yet — the
// folder scaffold (api/hooks/screens/types/utils/validation) mirrors
// every other feature so the real implementation can drop straight in.
export const supportApi = {
    list: async (): Promise<SupportItem[]> => {
        try {
            const { data } = await clientAdmin.get<SupportItem[]>("/support");
            return data;
        } catch (error) {
            console.warn("Support API not implemented yet:", getApiErrorMessage(error));
            return [];
        }
    },
};
