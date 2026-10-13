export type ReturnStatus =
  "All" | "New" | "Refunded" | "On the way" | "Collected" | "Rejected";

export interface ReturnRow {
  id: string;
  customer: string;
  item: string;
  reason: string;
  requested: string;
  refund: number;
  status: Exclude<ReturnStatus, "All">;
  customerId: string;
  rejectionMessage?: string;
}

export interface ReturnStoreRow {
  id: string;
  name: string;
  state: string;
  totalReturns: number;
  returnRate: string;
  refundIssues: number;
  collected: number;
  rejected: number;
}
