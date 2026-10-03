import { PRICE_MARKUP_TABS } from "../../constants/priceMarkup.constants";
import type { PriceMarkupTab } from "../../types/pricemarkup.types";

interface PriceMarkupTabsProps {
    active: PriceMarkupTab;
    onChange: (tab: PriceMarkupTab) => void;
}

// PRODUCT / CATEGORY / VENDOR switcher. Every tab reserves a 1px transparent
// border so the active tab's outline is drawn on all four sides (nothing clipped).
export default function PriceMarkupTabs({ active, onChange }: PriceMarkupTabsProps) {
    return (
        <div className="pm-tabs-wrap">
            <div className="pm-tabs" role="tablist" aria-label="Price markup sections">
                {PRICE_MARKUP_TABS.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={active === tab.key}
                        className={`pm-tab ${active === tab.key ? "is-active" : ""}`}
                        onClick={() => onChange(tab.key)}
                    >
                        {tab.label.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );
}
