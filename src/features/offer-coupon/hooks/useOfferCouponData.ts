import { useOfferCouponStore } from "../store/offerCouponStore";

export function useOfferCouponData() {
    const { offers, coupons } = useOfferCouponStore();
    return { offers, coupons };
}
