import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientAdmin } from "../../../shared/api/client/apiClient";
import type { FinanceItem } from "../types/finance.types";

// No dedicated screen design was supplied for this module yet — the
// folder scaffold (api/hooks/screens/types/utils/validation) mirrors
// every other feature so the real implementation can drop straight in.
export const financeApi = {
    list: async (): Promise<FinanceItem[]> => {
        try {
            const { data } = await clientAdmin.get<FinanceItem[]>("/finance");
            return data;
        } catch (error) {
            console.warn("Finance API not implemented yet:", getApiErrorMessage(error));
            return [];
        }
    },
};
