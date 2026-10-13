import { useEffect } from "react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import OfferCouponTabs from "../components/OfferCouponTabs";
import { useOfferCouponTab } from "../hooks/useOfferCouponTab";
import OfferTab from "./OfferTab";
import CouponTab from "./CouponTab";
import MarketplaceTab from "./MarketplaceTab";
import BonusTab from "./BonusTab";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";

export default function OfferCouponScreen() {
  const isMax560 = useMediaQuery("(max-width: 560px)");
  const { setExtraCrumbs } = useDashboardOutletContext();
  const { activeTab, setActiveTab } = useOfferCouponTab();
  useEffect(() => {
    setExtraCrumbs([]);
  }, [setExtraCrumbs]);
  return (
    <div
      style={{
        fontFamily: "inherit",
        color: "#24201d",
        display: "flex",
        flexDirection: "column",
        gap: isMax560 ? 12 : 14,
        minWidth: 0,
        paddingBottom: 24,
      }}
    >
      <OfferCouponTabs active={activeTab} onChange={setActiveTab} />
      {activeTab === "offer" && <OfferTab />}
      {activeTab === "coupon" && <CouponTab />}
      {activeTab === "marketplace" && <MarketplaceTab />}
      {activeTab === "bonus" && <BonusTab />}
    </div>
  );
}
