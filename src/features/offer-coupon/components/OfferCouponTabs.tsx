import type { OfferCouponTab } from "../hooks/useOfferCouponTab";

interface Props {
  active: OfferCouponTab;
  onChange: (tab: OfferCouponTab) => void;
}

export default function OfferCouponTabs({ active, onChange }: Props) {
  return (
    <div className="oc-tabs-wrap">
      <div className="oc-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={active === "offer"}
          className={`oc-tab ${active === "offer" ? "is-active" : ""}`}
          onClick={() => onChange("offer")}
        >
          OFFER
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={active === "coupon"}
          className={`oc-tab ${active === "coupon" ? "is-active" : ""}`}
          onClick={() => onChange("coupon")}
        >
          COUPON
        </button>
      </div>
    </div>
  );
}
