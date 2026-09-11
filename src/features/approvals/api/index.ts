import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientAdmin } from "../../../shared/api/client/apiClient";
import type { ApprovalsItem } from "../types/approvals.types";

// No dedicated screen design was supplied for this module yet — the
// folder scaffold (api/hooks/screens/types/utils/validation) mirrors
// every other feature so the real implementation can drop straight in.
export const approvalsApi = {
    list: async (): Promise<ApprovalsItem[]> => {
        try {
            const { data } = await clientAdmin.get<ApprovalsItem[]>("/approvals");
            return data;
        } catch (error) {
            console.warn("Approvals API not implemented yet:", getApiErrorMessage(error));
            return [];
        }
    },
};
