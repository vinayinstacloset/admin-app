import { initialCoupons, initialOffers } from "../data/mockData";
import type { Coupon, CouponInput, Offer, OfferInput, OfferCouponSnapshot } from "../types/offerCoupon.types";

export const offerCouponApi = {
    getSnapshot: (): OfferCouponSnapshot => ({
        offers: initialOffers.map((item) => ({ ...item })),
        coupons: initialCoupons.map((item) => ({ ...item })),
    }),
    createOffer: async (input: OfferInput) => ({
        ...input,
        id: `offer-${Date.now()}`,
        discount: input.discount === "" ? null : Number(input.discount),
        clickRate: null,
        enabled: input.status === "active",
    } as Offer),
    updateOffer: async (id: string, input: OfferInput) => ({
        ...input,
        id,
        discount: input.discount === "" ? null : Number(input.discount),
        clickRate: null,
        enabled: input.status === "active",
    } as Offer),
    deleteOffer: async (id: string) => id,
    createCoupon: async (input: CouponInput) => ({
        id: `coupon-${Date.now()}`,
        title: input.title,
        code: input.code,
        expiryDate: input.expiryDate,
        discount: Number(input.discount),
        usedCount: 0,
    } as Coupon),
    updateCoupon: async (id: string, input: CouponInput, current: Coupon[]) => ({
        id,
        title: input.title,
        code: input.code,
        expiryDate: input.expiryDate,
        discount: Number(input.discount),
        usedCount: current.find((item) => item.id === id)?.usedCount ?? 0,
    } as Coupon),
    deleteCoupon: async (id: string) => id,
};
