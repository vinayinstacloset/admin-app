import type { OfferCouponTab } from "../hooks/useOfferCouponTab";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";

interface Props {
  active: OfferCouponTab;
  onChange: (tab: OfferCouponTab) => void;
}

export default function OfferCouponTabs({ active, onChange }: Props) {
  const isMax900 = useMediaQuery("(max-width: 900px)");
  const isMax560 = useMediaQuery("(max-width: 560px)");
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 0 }}>
      <div
        style={{
          ...{
            width: 280,
            height: 31,
            display: "flex",
            alignItems: "stretch",
            background: "#e7e6e5",
            borderRadius: 5,
            overflow: "visible",
            boxSizing: "border-box",
          },
          ...(isMax900 ? { maxWidth: "100%" } : {}),
          ...(isMax560 ? { width: "100%", maxWidth: 280 } : {}),
        }}
        role="tablist"
      >
        <button
          type="button"
          role="tab"
          aria-selected={active === "offer"}
          style={{
            ...{
              position: "relative",
              flex: 1,
              height: 31,
              minWidth: 0,
              margin: 0,
              padding: "0 18px",
              border: "1px solid transparent",
              borderRadius: 5,
              background: "transparent",
              color: "#5d5753",
              fontSize: 11,
              fontWeight: 400,
              cursor: "pointer",
              boxSizing: "border-box",
              fontFamily: "inherit",
            },
            ...(active === "offer"
              ? {
                  border: "1px solid #76523b",
                  background: "#f0eeec",
                  color: "#76523b",
                  fontWeight: 700,
                  zIndex: 2,
                  borderRadius: "5px 0 0 5px",
                }
              : {}),
          }}
          onClick={() => onChange("offer")}
        >
          OFFER
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={active === "coupon"}
          style={{
            ...{
              position: "relative",
              flex: 1,
              height: 31,
              minWidth: 0,
              margin: 0,
              padding: "0 18px",
              border: "1px solid transparent",
              borderRadius: 5,
              background: "transparent",
              color: "#5d5753",
              fontSize: 11,
              fontWeight: 400,
              cursor: "pointer",
              boxSizing: "border-box",
              fontFamily: "inherit",
            },
            ...(active === "coupon"
              ? {
                  border: "1px solid #76523b",
                  background: "#f0eeec",
                  color: "#76523b",
                  fontWeight: 700,
                  zIndex: 2,
                  borderRadius: "0 5px 5px 0",
                }
              : {}),
          }}
          onClick={() => onChange("coupon")}
        >
          COUPON
        </button>
      </div>
    </div>
  );
}
