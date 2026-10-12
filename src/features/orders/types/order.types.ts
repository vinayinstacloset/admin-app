export type OrderStatus = "New" | "Packing" | "Ready" | "On the way" | "Delivered" | "Rejected";

export interface OrderListRow {
  id: string;
  items: string;
  age: string;
  store: string;
  city: string;
  customer: string;
  customerLocation: string;
  rider: string;
  riderAvatar?: string;
  itemSummary: string;
  itemCounts: string;
  status: OrderStatus;
  amount: number;
  actionText: string;
  rating?: string;
  rejectedAt?: string;
  riderState?: "reached" | "on-way" | "not-accepted";
}

export interface OrderItem {
  id: number;
  title: string;
  tags: string[];
  description: string;
  price: string;
  mrp: string;
  discount: string;
  image: string;
}

export interface OrderPerson {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  meta?: string;
}

export interface OrderRider {
  name: string;
  phone: string;
  rating: string;
  avatar: string;
}

export interface OrderPriceDetails {
  mrp: string;
  gst: string;
  total: string;
  vendorPayout: string;
  riderPayout: string;
  platformCommission: string;
}

export interface AvailableRider {
  id: string;
  name: string;
  phone: string;
  distance: string;
  avatar: string;
}

export interface OrderLocation {
  latitude: number;
  longitude: number;
}

export interface OrderDetail {
  id: string;
  status: OrderStatus;
  storeName: string;
  customerLocation: OrderLocation;
  storeLocation: OrderLocation;
  riderLocation: OrderLocation;
  eta: string;
  items: OrderItem[];
  customer: OrderPerson;
  vendor: OrderPerson;
  rider: OrderRider | null;
  priceDetails: OrderPriceDetails;
  availableRiders: AvailableRider[];
  riderState: "reached" | "on-way" | "not-accepted";
  deliveredAt?: string;
  feedback?: { rating: number; text: string };
  rejectedReason?: string;
}
