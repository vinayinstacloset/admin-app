export interface FinanceItem {
  id: string;
  [key: string]: unknown;
}

export type FinanceEntity = "vendor" | "rider";
export type PayoutFrequency = "Weekly" | "Monthly";
export type PayoutStatus = "Paid" | "Processing";

export interface PayoutRow {
  id: string;
  name: string;
  city: string;
  wallet: number;
  orders: number;
  grossRevenue: number;
  commission: number;
  netPayout: number;
  status: PayoutStatus;
  payoutDate: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  gstNumber: string;
  linked: boolean;
}

export interface Transaction {
  id: string;
  reference: string;
  transactionId: string;
  customer: string;
  date: string;
  status: PayoutStatus;
  amount: number;
  kind: "order" | "refund" | "withdrawal" | "payout" | "exchange";
  bank: string;
  description: string;
}

export interface FinanceSummary {
  walletBalance: number;
  platformRevenue: number;
  nextPayout: number;
  thisMonthPayout: number;
  scheduledDate: string;
}

export interface FinanceDataset {
  period: { month: string; year: number };
  summary: FinanceSummary;
  payouts: PayoutRow[];
  transactions: Transaction[];
  banks: BankAccount[];
}
