import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientAdmin } from "../../../shared/api/client/apiClient";
import type { BannerCampaignsItem } from "../types/bannercampaigns.types";

// No dedicated screen design was supplied for this module yet — the
// folder scaffold (api/hooks/screens/types/utils/validation) mirrors
// every other feature so the real implementation can drop straight in.
export const bannerCampaignsApi = {
    list: async (): Promise<BannerCampaignsItem[]> => {
        try {
            const { data } = await clientAdmin.get<BannerCampaignsItem[]>("/banner-campaigns");
            return data;
        } catch (error) {
            console.warn("Banner Campaigns API not implemented yet:", getApiErrorMessage(error));
            return [];
        }
    },
};
