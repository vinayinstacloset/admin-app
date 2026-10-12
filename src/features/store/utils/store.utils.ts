import type {
  StoreItem,
  StoreOrder,
  StoreReview,
  StoreStatus,
} from "../types/store.types";

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export const formatCompactCurrency = (value: number): string => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return formatCurrency(value);
};

export const filterStores = (
  stores: StoreItem[],
  search: string,
  status: "All" | StoreStatus,
  state: string,
): StoreItem[] => {
  const query = search.trim().toLowerCase();

  return stores.filter((store) => {
    const matchesQuery =
      !query ||
      [store.name, store.brand, store.city, store.state].some((value) =>
        value.toLowerCase().includes(query),
      );
    const matchesStatus = status === "All" || store.status === status;
    const matchesState = state === "All State" || store.state === state;

    return matchesQuery && matchesStatus && matchesState;
  });
};

export const sortReviews = (
  reviews: StoreReview[],
  sort: string,
): StoreReview[] => {
  const result = [...reviews];

  if (sort === "Oldest first") {
    return result.reverse();
  }

  if (sort === "Reply given") {
    return result.sort(
      (a, b) => Number(Boolean(b.reply)) - Number(Boolean(a.reply)),
    );
  }

  return result;
};

export const filterOrders = (
  orders: StoreOrder[],
  status: string,
): StoreOrder[] => {
  if (status === "All") return orders;
  return orders.filter((order) => order.status === status);
};

export const ratingPercent = (count: number, total: number): number =>
  total > 0 ? Math.round((count / total) * 100) : 0;
