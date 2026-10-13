import { initialMarketplaceCoupons } from "../data/marketplaceData";
import type {
  MarketplaceCoupon,
  MarketplaceCouponInput,
} from "../types/marketplaceBonus.types";

const toCoupon = (
  input: MarketplaceCouponInput,
  id: string,
): MarketplaceCoupon => ({
  id,
  imageUrl: input.imageUrl,
  marketplace: input.marketplace,
  code: input.code.trim(),
  expiryDate: input.expiryDate,
  discountType: input.discountType === "" ? "discount" : input.discountType,
  discountValue: Number(input.discountValue),
  clickRate: 0,
  status: "active",
});

export const marketplaceApi = {
  getSnapshot: () => initialMarketplaceCoupons.map((item) => ({ ...item })),
  create: async (input: MarketplaceCouponInput) =>
    toCoupon(input, `marketplace-${Date.now()}`),
  update: async (id: string, input: MarketplaceCouponInput) =>
    toCoupon(input, id),
  remove: async (id: string) => id,
};
