export type VendorStatus = "Active" | "Suspended" | "Warning";

export interface VendorRow {
  id: string;
  owner: string;
  company: string;
  orders: number;
  revenue: string;
  rating: number;
  city: string;
  state: string;
  status: VendorStatus;
}

export interface VendorListResponse {
  total: number;
  rows: VendorRow[];
}

export interface VendorStat {
  label: string;
  value: string;
  icon: string;
  tone: "green" | "purple" | "blue" | "orange" | "yellow" | "red";
  link?: boolean;
}

export interface VendorProfile {
  name: string;
  tagline: string;
  address: string;
  email: string;
  phone: string;
  rating: string;
  prepTime: string;
  freeDelivery: string;
  minOrder: string;
  cover: string;
}

export interface SalesRevenuePoint {
  time: string;
  value: number;
}

export interface TopProductRow {
  name: string;
  meta: string;
  sold: number;
  revenue: string;
  stock: "Good" | "Low";
}

export interface StoreRatingBreakdown {
  star: number;
  pct: number;
}

export interface StoreRating {
  average: string;
  reviews: string;
  breakdown: StoreRatingBreakdown[];
}

export interface VendorDetail {
  stats: VendorStat[];
  profile: VendorProfile;
  salesRevenue: SalesRevenuePoint[];
  topProducts: TopProductRow[];
  storeRating: StoreRating;
}
