import { PRICE_MARKUP_TABS } from "../../constants/priceMarkup.constants";
import type { PriceMarkupTab } from "../../types/pricemarkup.types";

interface PriceMarkupTabsProps {
  active: PriceMarkupTab;
  onChange: (tab: PriceMarkupTab) => void;
}

// PRODUCT / CATEGORY / VENDOR switcher. Every tab reserves a 1px transparent
// border so the active tab's outline is drawn on all four sides (nothing clipped).
export default function PriceMarkupTabs({
  active,
  onChange,
}: PriceMarkupTabsProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "2px 2px 0",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          background: "#e6e6e6",
          borderRadius: 6,
          overflow: "visible",
        }}
        role="tablist"
        aria-label="Price markup sections"
      >
        {PRICE_MARKUP_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active === tab.key}
            style={{
              ...{
                position: "relative",
                minWidth: 100,
                padding: "8px 22px",
                border: "1px solid transparent",
                borderRadius: 4,
                background: "transparent",
                color: "#55504b",
                fontSize: 12,
                letterSpacing: "0.02em",
                transition: "color 0.15s, background 0.15s",
                fontFamily: "inherit",
                cursor: "pointer",
              },
              ...(active === tab.key
                ? {
                    border: "1px solid #6d4c36",
                    zIndex: 1,
                    background: "#efedeb",
                    color: "#6d4c36",
                    fontWeight: 500,
                  }
                : {}),
            }}
            onMouseEnter={(event) => {
              if (active !== tab.key)
                event.currentTarget.style.color = "#6d4c36";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.color =
                active === tab.key ? "#6d4c36" : "#55504b";
            }}
            onClick={() => onChange(tab.key)}
          >
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
