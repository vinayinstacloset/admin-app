import { create } from "zustand";
import { offerCouponApi } from "../api";
import type { Coupon, Offer } from "../types/offerCoupon.types";

interface OfferCouponState {
  offers: Offer[];
  coupons: Coupon[];
  addOffer: (offer: Offer) => void;
  updateOffer: (id: string, offer: Offer) => void;
  removeOffer: (id: string) => void;
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, coupon: Coupon) => void;
  removeCoupon: (id: string) => void;
}

export const useOfferCouponStore = create<OfferCouponState>((set) => ({
  offers: offerCouponApi.getSnapshot().offers,
  coupons: offerCouponApi.getSnapshot().coupons,
  addOffer: (offer) => set((state) => ({ offers: [offer, ...state.offers] })),
  updateOffer: (id, offer) =>
    set((state) => ({
      offers: state.offers.map((item) => (item.id === id ? offer : item)),
    })),
  removeOffer: (id) =>
    set((state) => ({ offers: state.offers.filter((item) => item.id !== id) })),
  addCoupon: (coupon) =>
    set((state) => ({ coupons: [coupon, ...state.coupons] })),
  updateCoupon: (id, coupon) =>
    set((state) => ({
      coupons: state.coupons.map((item) => (item.id === id ? coupon : item)),
    })),
  removeCoupon: (id) =>
    set((state) => ({
      coupons: state.coupons.filter((item) => item.id !== id),
    })),
}));
