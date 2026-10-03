import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientAdmin } from "../../../shared/api/client/apiClient";
import { mockOverview } from "../data/mockData";
import type { OverviewResponse } from "../types/overview.types";

export const overviewApi = {
    getOverview: async (): Promise<OverviewResponse> => {
        try {
            const { data } = await clientAdmin.get<OverviewResponse>("/overview");
            return data;
        } catch (error) {
            console.warn("Falling back to mock overview data:", getApiErrorMessage(error));
            return mockOverview;
        }
    },
};
