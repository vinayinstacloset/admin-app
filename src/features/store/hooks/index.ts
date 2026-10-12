import { useEffect, useMemo, useState } from "react";
import { storeApi } from "../api";
import { filterOrders, filterStores, sortReviews } from "../utils/store.utils";
import type {
  StoreDetails,
  StoreItem,
  StoreOrder,
  StoreReview,
  TopProduct,
  SalesPoint,
} from "../types/store.types";

export function useStoreList() {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All" | "Open" | "Closed">("All");
  const [state, setState] = useState("All State");

  useEffect(() => {
    let mounted = true;
    storeApi.list().then((data) => {
      if (mounted) {
        setItems(data);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredItems = useMemo(
    () => filterStores(items, search, status, state),
    [items, search, state, status],
  );

  return {
    items,
    filteredItems,
    isLoading,
    search,
    setSearch,
    status,
    setStatus,
    state,
    setState,
  };
}

export function useStoreDetails() {
  const [details, setDetails] = useState<StoreDetails | null>(null);
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [sales, setSales] = useState<SalesPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      storeApi.getDetails(),
      storeApi.getProducts(),
      storeApi.getSales(),
    ]).then(([store, topProducts, salesData]) => {
      setDetails(store);
      setProducts(topProducts);
      setSales(salesData);
      setIsLoading(false);
    });
  }, []);

  return { details, products, sales, isLoading };
}

export function useStoreOrders() {
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    storeApi.getOrders().then(setOrders);
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim();
    const searched = !query
      ? orders
      : orders.filter((order) =>
          [order.id, order.customer, order.itemSummary].some((value) =>
            value.toLowerCase().includes(query),
          ),
        );
    return filterOrders(searched, status);
  }, [orders, search, status]);

  return { orders, filteredOrders, search, setSearch, status, setStatus };
}

export function useStoreReviews() {
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [rating, setRating] = useState("All ratings");
  const [sort, setSort] = useState("Newest first");

  useEffect(() => {
    storeApi.getReviews().then(setReviews);
  }, []);

  const filteredReviews = useMemo(() => {
    const ratingFiltered =
      rating === "All ratings"
        ? reviews
        : reviews.filter((review) => review.rating === Number(rating));
    return sortReviews(ratingFiltered, sort);
  }, [rating, reviews, sort]);

  return { reviews, filteredReviews, rating, setRating, sort, setSort };
}
