import { useSearchParams } from "react-router-dom";
export type OfferCouponTab = "offer" | "coupon";

export function useOfferCouponTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("tab") as OfferCouponTab | null;
  const activeTab: OfferCouponTab = requested === "coupon" ? "coupon" : "offer";
  const setActiveTab = (tab: OfferCouponTab) =>
    setSearchParams(tab === "offer" ? {} : { tab }, { replace: true });
  return { activeTab, setActiveTab };
}
