export type ExchangeStatus =
  "New" | "Approved" | "Ready" | "On the way" | "Exchanged" | "Rejected";

export interface ExchangeStoreRow {
  id: string;
  name: string;
  state: string;
  totalExchange: number;
  exchangeRate: string;
  exchangedItem: number;
  rejectedItem: number;
  logoUrl?: string;
}

export interface ExchangeRow {
  id: string;
  customer: string;
  rider: string;
  item: string;
  replace: string;
  reason: string;
  requested: string;
  status: ExchangeStatus;
  action: string;
}

export interface ExchangeCustomer {
  name: string;
  email: string;
  mobile: string;
  ageGender: string;
  cityState: string;
  address: string;
}

export interface ExchangeItem {
  name: string;
  category: string;
  size: string;
  color: string;
  price: number;
  mrp: number;
  discount: number;
  image: string;
}

export interface ExchangeRider {
  name: string;
  phone: string;
  rating: string;
  distance: string;
  image: string;
}

export interface ExchangeDetail {
  id: string;
  store: string;
  status: ExchangeStatus;
  exchangeWith: string;
  reason: string;
  customer: ExchangeCustomer;
  item: ExchangeItem;
  exchangedItem: ExchangeItem;
  rider?: ExchangeRider;
  rejectionMessage?: string;
  rejectedAt?: string;
  exchangedAt?: string;
  eta?: string;
}
