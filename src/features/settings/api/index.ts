import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientAdmin } from "../../../shared/api/client/apiClient";
import type { BrandsItem } from "../types/brands.types";

// No dedicated screen design was supplied for this module yet — the
// folder scaffold (api/hooks/screens/types/utils/validation) mirrors
// every other feature so the real implementation can drop straight in.
export const brandsApi = {
    list: async (): Promise<BrandsItem[]> => {
        try {
            const { data } = await clientAdmin.get<BrandsItem[]>("/brands");
            return data;
        } catch (error) {
            console.warn("Brands API not implemented yet:", getApiErrorMessage(error));
            return [];
        }
    },
};
