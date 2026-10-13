import { useSearchParams } from "react-router-dom";

export type OfferCouponTab = "offer" | "coupon" | "marketplace" | "bonus";

export function useOfferCouponTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("tab") as OfferCouponTab | null;
  const activeTab: OfferCouponTab =
    requested === "coupon" ||
    requested === "marketplace" ||
    requested === "bonus"
      ? requested
      : "offer";
  const setActiveTab = (tab: OfferCouponTab) =>
    setSearchParams(tab === "offer" ? {} : { tab }, { replace: true });
  return { activeTab, setActiveTab };
}
