import { clientAdmin } from "../../../shared/api/client/apiClient";
import { exchangeStores, getExchangeDetail } from "../data/mockData";
import type { ExchangeDetail, ExchangeStoreRow } from "../types/exchange.types";

export const exchangeApi = {
  listStores: async (): Promise<ExchangeStoreRow[]> => {
    try {
      const response =
        await clientAdmin.get<ExchangeStoreRow[]>("/exchanges/stores");
      return response.data;
    } catch {
      return exchangeStores;
    }
  },
  getDetail: async (exchangeId: string): Promise<ExchangeDetail> => {
    try {
      const response = await clientAdmin.get<ExchangeDetail>(
        `/exchanges/${encodeURIComponent(exchangeId)}`,
      );
      return response.data;
    } catch {
      return getExchangeDetail(exchangeId);
    }
  },
};
