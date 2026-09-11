import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientAdmin } from "../../../shared/api/client/apiClient";
import type { PriceMarkupItem } from "../types/pricemarkup.types";

// No dedicated screen design was supplied for this module yet — the
// folder scaffold (api/hooks/screens/types/utils/validation) mirrors
// every other feature so the real implementation can drop straight in.
export const priceMarkupApi = {
    list: async (): Promise<PriceMarkupItem[]> => {
        try {
            const { data } = await clientAdmin.get<PriceMarkupItem[]>("/price-markup");
            return data;
        } catch (error) {
            console.warn("Price Markup API not implemented yet:", getApiErrorMessage(error));
            return [];
        }
    },
};
