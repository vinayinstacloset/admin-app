import type { OfferCouponTab } from "../hooks/useOfferCouponTab";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";

interface Props {
  active: OfferCouponTab;
  onChange: (tab: OfferCouponTab) => void;
}

const tabs: Array<{ value: OfferCouponTab; label: string }> = [
  { value: "offer", label: "OFFER" },
  { value: "coupon", label: "COUPON" },
  { value: "marketplace", label: "MARKET PLACE" },
  { value: "bonus", label: "BONUS" },
];

export default function OfferCouponTabs({ active, onChange }: Props) {
  const isMax900 = useMediaQuery("(max-width: 900px)");
  const isMax560 = useMediaQuery("(max-width: 560px)");
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 0 }}>
      <div
        style={{
          width: 560,
          maxWidth: isMax900 ? "100%" : 560,
          height: 31,
          display: "flex",
          alignItems: "stretch",
          background: "#e7e6e5",
          borderRadius: 5,
          overflow: "visible",
          boxSizing: "border-box",
        }}
        role="tablist"
      >
        {tabs.map((tab, index) => {
          const selected = active === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={selected}
              style={{
                position: "relative",
                flex: 1,
                height: 31,
                minWidth: 0,
                margin: 0,
                padding: isMax560 ? "0 5px" : "0 10px",
                border: selected
                  ? "1px solid #76523b"
                  : "1px solid transparent",
                borderRadius: selected ? 5 : 0,
                background: selected ? "#f0eeec" : "transparent",
                color: selected ? "#76523b" : "#5d5753",
                fontSize: isMax560 ? 9 : 10.5,
                fontWeight: selected ? 700 : 400,
                cursor: "pointer",
                boxSizing: "border-box",
                fontFamily: "inherit",
                zIndex: selected ? 2 : 1,
                marginLeft: index === 0 ? 0 : -1,
              }}
              onClick={() => onChange(tab.value)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
