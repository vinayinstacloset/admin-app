import { Package, Pencil, Tag, Trash2 } from "lucide-react";
import type { MarkupVendor, VendorMarkup } from "../../types/pricemarkup.types";
import {
  formatMoney,
  formatPercent,
  kindLabel,
} from "../../utils/pricemarkup.utils";
import { RevenueIcon, UnitSoldIcon } from "../common/MarkupIcons";
import StatTile from "../common/StatTile";
import VendorSummary from "../common/VendorSummary";
import { useMediaQuery } from "../../../../shared/hooks/useMediaQuery";
import {
  hoverStyle,
  focusStyle,
} from "../../../../shared/utils/interactiveStyle";

interface VendorMarkupCardProps {
  vendor: MarkupVendor;
  markup: VendorMarkup;
  onEdit: () => void;
  onDelete: () => void;
}

// Edit + Delete are pinned to the card's own top-right corner (not part of
// the flex content flow), so both always render fully inside the card.
export default function VendorMarkupCard({
  vendor,
  markup,
  onEdit,
  onDelete,
}: VendorMarkupCardProps) {
  const isMax1180 = useMediaQuery("(max-width: 1180px)");
  const isMax820 = useMediaQuery("(max-width: 820px)");
  return (
    <section
      style={{
        borderRadius: 12,
        background: "#ffffff",
        position: "relative",
        padding: "20px 56px 20px 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 16,
        }}
      >
        <VendorSummary
          vendor={vendor}
          style={{ flex: "1 1 260px", minWidth: 220 }}
        />

        <div
          style={{
            ...{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(110px, 145px))",
              gap: 12,
              flex: "none",
              height: 60,
            },
            ...(isMax1180 ? { width: "auto" } : {}),
            ...(isMax820 ? { gridTemplateColumns: "1fr 1fr 1fr" } : {}),
          }}
        >
          <StatTile
            tone="orange"
            label="TOTAL UNIT SOLD"
            value={vendor.totalUnitSold}
            icon={<UnitSoldIcon />}
          />
          <StatTile
            tone="green"
            label="TOTAL REVENUE"
            value={formatMoney(vendor.totalRevenue)}
            icon={<RevenueIcon />}
          />
          <StatTile
            tone="purple"
            label="TOTAL SKUS"
            value={vendor.totalSkus}
            icon={<Package size={12} />}
          />
        </div>

        <StatTile
          style={{ flex: "none", width: isMax1180 ? "auto" : 130, height: 60 }}
          tone="blue"
          label={kindLabel(markup.markup.kind).toUpperCase()}
          value={formatPercent(markup.markup.percent)}
          icon={<Tag size={12} />}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          position: "absolute",
          top: 14,
          right: 14,
        }}
      >
        <button
          type="button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
            padding: 0,
            border: 0,
            borderRadius: 6,
            background: "transparent",
            color: "#4b4540",
            fontFamily: "inherit",
            cursor: "pointer",
          }}
          {...hoverStyle(
            { background: "rgba(0, 0, 0, 0.06)" },
            { background: "transparent" },
          )}
          aria-label={`Edit markup for ${vendor.name}`}
          onClick={onEdit}
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
            padding: 0,
            border: 0,
            borderRadius: 6,
            background: "transparent",
            color: "#4b4540",
            fontFamily: "inherit",
            cursor: "pointer",
          }}
          {...hoverStyle(
            { background: "rgba(0, 0, 0, 0.06)" },
            { background: "transparent" },
          )}
          aria-label={`Delete markup for ${vendor.name}`}
          onClick={onDelete}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </section>
  );
}
