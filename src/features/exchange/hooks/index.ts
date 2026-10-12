import { useMemo } from "react";
import { getExchangeDetail } from "../data/mockData";

export function useExchangeDetail(exchangeId: string) {
  return useMemo(() => getExchangeDetail(exchangeId), [exchangeId]);
}
