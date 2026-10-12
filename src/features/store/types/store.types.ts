export type StoreStatus = "Open" | "Closed";
export type StoreView = "list" | "details" | "orders" | "skus" | "reviews";
export type ReviewSort = "Newest first" | "Oldest first" | "Reply given";
export type OrderStatus =
  "New" | "Packing" | "Ready" | "On the way" | "Delivered" | "Rejected";

export interface StoreItem {
  id: string;
  name: string;
  brand: string;
  city: string;
  state: string;
  address: string;
  hours: string;
  status: StoreStatus;
  revenue: number;
  orders: number;
  rating: number;
  image: string;
}

export interface StoreDetails extends StoreItem {
  description: string;
  email: string;
  phone: string;
  prepTime: string;
  deliveryNote: string;
  totalRevenue: number;
  totalOrders: number;
  totalSkus: number;
  fulfilmentRate: number;
  ratingsCount: number;
  ratingBreakdown: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface TopProduct {
  id: string;
  name: string;
  variants: string;
  unitsSold: number;
  revenue: number;
  stock: number;
}

export interface SalesPoint {
  label: string;
  value: number;
}

export interface StoreOrder {
  id: string;
  items: string;
  customer: string;
  customerLocation: string;
  rider: string;
  itemSummary: string;
  itemCounts: string;
  status: OrderStatus;
  amount: number;
  age: string;
  action: string;
}

export interface StoreReview {
  id: string;
  initials: string;
  customer: string;
  date: string;
  rating: number;
  text: string;
  reply?: string;
}
