import type {
  SalesPoint,
  StoreDetails,
  StoreItem,
  StoreOrder,
  StoreReview,
  TopProduct,
} from "../types/store.types";
import {
  detail,
  orders,
  products,
  reviews,
  sales,
  stores,
} from "../data/mockData";

export const storeApi = {
  async list(): Promise<StoreItem[]> {
    return Promise.resolve(stores);
  },
  async getDetails(): Promise<StoreDetails> {
    return Promise.resolve(detail);
  },
  async getOrders(): Promise<StoreOrder[]> {
    return Promise.resolve(orders);
  },
  async getReviews(): Promise<StoreReview[]> {
    return Promise.resolve(reviews);
  },
  async getProducts(): Promise<TopProduct[]> {
    return Promise.resolve(products);
  },
  async getSales(): Promise<SalesPoint[]> {
    return Promise.resolve(sales);
  },
};
