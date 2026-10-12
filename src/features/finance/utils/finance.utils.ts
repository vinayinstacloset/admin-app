import type { PayoutRow, Transaction } from "../types/finance.types";

export const formatCurrency = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Math.abs(value),
  )}`;

export const formatSignedCurrency = (value: number) =>
  `${value < 0 ? "-" : "+"}${formatCurrency(value)}`;

export const formatCompactCurrency = (value: number) => {
  const absolute = Math.abs(value);
  if (absolute >= 100000) return `₹${(absolute / 100000).toFixed(1)}L`;
  if (absolute >= 1000) return `₹${Math.round(absolute / 1000)}k`;
  return formatCurrency(value);
};

export const payoutSearchText = (row: PayoutRow) =>
  `${row.name} ${row.city}`.toLowerCase();

export const transactionSearchText = (row: Transaction) =>
  `${row.reference} ${row.transactionId} ${row.customer} ${row.bank}`.toLowerCase();

export const maskAccount = (account: string) => {
  const digits = account.replace(/\s/g, "");
  if (digits.length <= 4) return account;
  return `•••• •••• ${digits.slice(-4)}`;
};
