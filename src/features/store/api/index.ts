import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientAdmin } from "../../../shared/api/client/apiClient";
import type { StoreItem } from "../types/store.types";

// No dedicated screen design was supplied for this module yet — the
// folder scaffold (api/hooks/screens/types/utils/validation) mirrors
// every other feature so the real implementation can drop straight in.
export const storeApi = {
    list: async (): Promise<StoreItem[]> => {
        try {
            const { data } = await clientAdmin.get<StoreItem[]>("/store");
            return data;
        } catch (error) {
            console.warn("Store API not implemented yet:", getApiErrorMessage(error));
            return [];
        }
    },
};
