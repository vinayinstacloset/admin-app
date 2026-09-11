import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientAdmin } from "../../../shared/api/client/apiClient";
import type { AnalyticsItem } from "../types/analytics.types";

// No dedicated screen design was supplied for this module yet — the
// folder scaffold (api/hooks/screens/types/utils/validation) mirrors
// every other feature so the real implementation can drop straight in.
export const analyticsApi = {
    list: async (): Promise<AnalyticsItem[]> => {
        try {
            const { data } = await clientAdmin.get<AnalyticsItem[]>("/analytics");
            return data;
        } catch (error) {
            console.warn("Analytics API not implemented yet:", getApiErrorMessage(error));
            return [];
        }
    },
};
