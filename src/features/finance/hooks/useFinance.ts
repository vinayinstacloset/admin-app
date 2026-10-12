import { useMemo, useState } from "react";
import { getFinanceDataset } from "../data/mockData";
import type {
  BankAccount,
  FinanceEntity,
  PayoutFrequency,
} from "../types/finance.types";
import { payoutSearchText } from "../utils/finance.utils";

export function useFinance(entity: FinanceEntity) {
  const data = getFinanceDataset(entity);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [frequency, setFrequency] = useState<PayoutFrequency>("Weekly");
  const [banks, setBanks] = useState<BankAccount[]>(data.banks);
  const [walletBalance, setWalletBalance] = useState(
    data.summary.walletBalance,
  );

  const payouts = useMemo(() => {
    const filtered = data.payouts.filter((row) =>
      payoutSearchText(row).includes(search.trim().toLowerCase()),
    );
    return sort === "newest" ? filtered : [...filtered].reverse();
  }, [data.payouts, search, sort]);

  const addBank = (bank: Omit<BankAccount, "id">) => {
    setBanks((current) => [...current, { ...bank, id: `bank-${Date.now()}` }]);
  };

  const updateBank = (id: string, bank: Omit<BankAccount, "id">) => {
    setBanks((current) =>
      current.map((item) => (item.id === id ? { ...bank, id } : item)),
    );
  };

  const deleteBank = (id: string) => {
    setBanks((current) => current.filter((item) => item.id !== id));
  };

  const addBalance = (amount: number) => {
    setWalletBalance((current) => current + amount);
  };

  return {
    data,
    payouts,
    transactions: data.transactions,
    banks,
    walletBalance,
    search,
    setSearch,
    sort,
    setSort,
    frequency,
    setFrequency,
    addBank,
    updateBank,
    deleteBank,
    addBalance,
  };
}
