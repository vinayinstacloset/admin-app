import { Package, Pencil, Tag, Trash2 } from "lucide-react";
import type { MarkupVendor, VendorMarkup } from "../../types/pricemarkup.types";
import { formatMoney, formatPercent, kindLabel } from "../../utils/pricemarkup.utils";
import { RevenueIcon, UnitSoldIcon } from "../common/MarkupIcons";
import StatTile from "../common/StatTile";
import VendorSummary from "../common/VendorSummary";

interface VendorMarkupCardProps {
    vendor: MarkupVendor;
    markup: VendorMarkup;
    onEdit: () => void;
    onDelete: () => void;
}

// Edit + Delete are pinned to the card's own top-right corner (not part of
// the flex content flow), so both always render fully inside the card.
export default function VendorMarkupCard({ vendor, markup, onEdit, onDelete }: VendorMarkupCardProps) {
    return (
        <section className="pm-card pm-vendor-card">
            <div className="pm-vendor-card__main">
                <VendorSummary vendor={vendor} className="pm-vendor-card__summary" />

                <div className="pm-vendor-card__stats">
                    <StatTile tone="orange" label="TOTAL UNIT SOLD" value={vendor.totalUnitSold} icon={<UnitSoldIcon />} />
                    <StatTile tone="green" label="TOTAL REVENUE" value={formatMoney(vendor.totalRevenue)} icon={<RevenueIcon />} />
                    <StatTile tone="purple" label="TOTAL SKUS" value={vendor.totalSkus} icon={<Package size={12} />} />
                </div>

                <StatTile
                    className="pm-vendor-card__markup"
                    tone="blue"
                    label={kindLabel(markup.markup.kind).toUpperCase()}
                    value={formatPercent(markup.markup.percent)}
                    icon={<Tag size={12} />}
                />
            </div>

            <div className="pm-row-actions pm-vendor-card__actions">
                <button type="button" className="pm-icon-btn" aria-label={`Edit markup for ${vendor.name}`} onClick={onEdit}>
                    <Pencil size={14} />
                </button>
                <button type="button" className="pm-icon-btn" aria-label={`Delete markup for ${vendor.name}`} onClick={onDelete}>
                    <Trash2 size={14} />
                </button>
            </div>
        </section>
    );
}
