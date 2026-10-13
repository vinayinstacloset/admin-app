export type MarketplaceDiscountType = "discount" | "rupees";
export type MarketplaceStatus = "active" | "expired";

export interface MarketplaceCoupon {
  id: string;
  imageUrl: string;
  marketplace: string;
  code: string;
  expiryDate: string;
  discountType: MarketplaceDiscountType | "";
  discountValue: number;
  clickRate: number;
  status: MarketplaceStatus;
}

export interface MarketplaceCouponInput {
  imageUrl: string;
  marketplace: string;
  code: string;
  expiryDate: string;
  discountType: MarketplaceDiscountType | "";
  discountValue: string;
}
