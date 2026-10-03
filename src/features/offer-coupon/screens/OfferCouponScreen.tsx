import { useEffect } from "react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import OfferCouponTabs from "../components/OfferCouponTabs";
import { useOfferCouponTab } from "../hooks/useOfferCouponTab";
import OfferTab from "./OfferTab";
import CouponTab from "./CouponTab";
import "../styles/offer-coupon.css";

export default function OfferCouponScreen() {
  const { setExtraCrumbs } = useDashboardOutletContext();
  const { activeTab, setActiveTab } = useOfferCouponTab();
  useEffect(() => {
    setExtraCrumbs([]);
  }, [setExtraCrumbs]);
  return (
    <div className="oc-page">
      <OfferCouponTabs active={activeTab} onChange={setActiveTab} />
      {activeTab === "offer" ? <OfferTab /> : <CouponTab />}
    </div>
  );
}
