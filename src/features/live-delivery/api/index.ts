import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientAdmin } from "../../../shared/api/client/apiClient";
import type { LiveDeliveryItem } from "../types/livedelivery.types";

// No dedicated screen design was supplied for this module yet — the
// folder scaffold (api/hooks/screens/types/utils/validation) mirrors
// every other feature so the real implementation can drop straight in.
export const liveDeliveryApi = {
    list: async (): Promise<LiveDeliveryItem[]> => {
        try {
            const { data } = await clientAdmin.get<LiveDeliveryItem[]>("/live-delivery");
            return data;
        } catch (error) {
            console.warn("Live Delivery API not implemented yet:", getApiErrorMessage(error));
            return [];
        }
    },
};
