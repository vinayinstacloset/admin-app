import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientAdmin } from "../../../shared/api/client/apiClient";
import type { ReturnsItem } from "../types/returns.types";

// No dedicated screen design was supplied for this module yet — the
// folder scaffold (api/hooks/screens/types/utils/validation) mirrors
// every other feature so the real implementation can drop straight in.
export const returnsApi = {
    list: async (): Promise<ReturnsItem[]> => {
        try {
            const { data } = await clientAdmin.get<ReturnsItem[]>("/returns");
            return data;
        } catch (error) {
            console.warn("Returns API not implemented yet:", getApiErrorMessage(error));
            return [];
        }
    },
};
