import type { MarketplaceCoupon } from "../types/marketplaceBonus.types";

export const MARKETPLACE_OPTIONS = [
  { value: "Instagram", label: "Instagram" },
  { value: "Linked In", label: "Linked In" },
  { value: "Facebook", label: "Facebook" },
  { value: "Google", label: "Google" },
] as const;

export const initialMarketplaceCoupons: MarketplaceCoupon[] = [
  {
    id: "marketplace-1",
    imageUrl: "/offer-coupon/marketplace-product.jpg",
    marketplace: "Instagram",
    code: "Noreturns10",
    expiryDate: "2026-05-31",
    discountType: "discount",
    discountValue: 5,
    clickRate: 831,
    status: "active",
  },
  {
    id: "marketplace-2",
    imageUrl: "/offer-coupon/marketplace-product.jpg",
    marketplace: "Instagram",
    code: "Noreturns10",
    expiryDate: "2026-05-31",
    discountType: "discount",
    discountValue: 5,
    clickRate: 831,
    status: "active",
  },
  {
    id: "marketplace-3",
    imageUrl: "/offer-coupon/marketplace-product.jpg",
    marketplace: "Instagram",
    code: "Noreturns10",
    expiryDate: "2026-05-31",
    discountType: "discount",
    discountValue: 5,
    clickRate: 831,
    status: "active",
  },
  {
    id: "marketplace-4",
    imageUrl: "/offer-coupon/marketplace-product.jpg",
    marketplace: "Linked In",
    code: "Bonuscode30",
    expiryDate: "2026-05-24",
    discountType: "rupees",
    discountValue: 100,
    clickRate: 455,
    status: "expired",
  },
];
