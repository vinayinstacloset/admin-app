import { useEffect } from "react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import PriceMarkupTabs from "../components/common/PriceMarkupTabs";
import { usePriceMarkupTab } from "../hooks/usePriceMarkupTab";
import CategoryTab from "./tabs/CategoryTab";
import ProductTab from "./tabs/ProductTab";
import VendorTab from "./tabs/VendorTab";

export default function PriceMarkupScreen() {
  const { setExtraCrumbs } = useDashboardOutletContext();
  const { activeTab, setActiveTab } = usePriceMarkupTab();

  useEffect(() => {
    setExtraCrumbs([]);
  }, [setExtraCrumbs]);

  return (
    <div
      style={{
        fontFamily: "inherit",
        color: "#1f1a17",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        paddingBottom: 24,
      }}
    >
      <PriceMarkupTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "product" && <ProductTab />}
      {activeTab === "category" && <CategoryTab />}
      {activeTab === "vendor" && <VendorTab />}
    </div>
  );
}
