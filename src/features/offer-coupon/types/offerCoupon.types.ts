export type OfferStatus = "active" | "scheduled" | "expired";
export type OfferType = "flash-card" | "deal";
export type OfferFilter = "all" | OfferStatus;
export type OfferPlacement = "Homepage" | "Category page";
export type Gender = "MEN" | "WOMEN" | "KIDS" | "TEENS";

export interface Offer {
  offerType: OfferType;
  id: string;
  imageUrl: string;
  discount: number | null;
  placement: OfferPlacement;
  startDate: string;
  endDate: string;
  status: OfferStatus;
  clickRate: number | null;
  enabled: boolean;
  gender: Gender | "";
  categoryNavigation: string;
  productCategory: string;
  category: string;
  subCategory: string;
}

export interface OfferInput {
  offerType: OfferType;
  imageUrl: string;
  discount: string;
  placement: OfferPlacement | "";
  startDate: string;
  endDate: string;
  gender: Gender | "";
  categoryNavigation: string;
  productCategory: string;
  category: string;
  subCategory: string;
}

export interface Coupon {
  id: string;
  title: string;
  discount: number;
  code: string;
  expiryDate: string;
  usedCount: number;
}

export interface CouponInput {
  title: string;
  code: string;
  expiryDate: string;
  discount: string;
}

export interface OfferCouponSnapshot {
  offers: Offer[];
  coupons: Coupon[];
}
