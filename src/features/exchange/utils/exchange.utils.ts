import type { ExchangeStatus } from "../types/exchange.types";

export const exchangeStatuses: Array<ExchangeStatus | "All"> = [
  "All",
  "New",
  "Approved",
  "Ready",
  "On the way",
  "Exchanged",
  "Rejected",
];

export const formatExchangeStatus = (status: ExchangeStatus) => status;
