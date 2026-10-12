import { Pencil, Trash2 } from "lucide-react";
import type {
  MarkupVendor,
  ProductVariant,
} from "../../types/pricemarkup.types";
import { formatMoney } from "../../utils/pricemarkup.utils";
import { RevenueIcon, UnitSoldIcon } from "../common/MarkupIcons";
import ProductSummary from "../common/ProductSummary";
import StatTile from "../common/StatTile";
import VendorListingTile from "./VendorListingTile";
import { useMediaQuery } from "../../../../shared/hooks/useMediaQuery";
import {
  hoverStyle,
  focusStyle,
} from "../../../../shared/utils/interactiveStyle";

interface ProductMarkupCardProps {
  variant: ProductVariant;
  vendors: MarkupVendor[];
  onEdit: () => void;
  onDelete: () => void;
}

// One record of the Product tab: product header, sales tiles and every
// vendor that currently has a markup for this product variant.
export default function ProductMarkupCard({
  variant,
  vendors,
  onEdit,
  onDelete,
}: ProductMarkupCardProps) {
  const isMax1180 = useMediaQuery("(max-width: 1180px)");
  const isMax820 = useMediaQuery("(max-width: 820px)");
  const markedListings = variant.listings.filter((listing) => listing.markup);

  return (
    <section style={{ borderRadius: 12, background: "#ffffff", padding: 14 }}>
      <div
        style={{
          ...{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            paddingBottom: 14,
            borderBottom: "1px solid #e3e0dd",
          },
          ...(isMax820
            ? { flexDirection: "column", alignItems: "stretch" }
            : {}),
        }}
      >
        <ProductSummary variant={variant} style={{ flex: 1 }} />

        <div
          style={{
            ...{
              display: "grid",
              gridTemplateColumns: "145px 138px",
              gap: 7,
              height: 72,
            },
            ...(isMax820
              ? { gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))" }
              : {}),
          }}
        >
          <StatTile
            tone="orange"
            label="UNIT SOLD"
            value={variant.unitSold}
            icon={<UnitSoldIcon />}
          />
          <StatTile
            tone="green"
            label="REVENUE"
            value={formatMoney(variant.revenue)}
            icon={<RevenueIcon />}
          />
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
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
            aria-label={`Edit markup for ${variant.name}`}
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
            aria-label={`Delete markup for ${variant.name}`}
            onClick={onDelete}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div
        style={{
          ...{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 10,
            paddingTop: 14,
          },
          ...(isMax1180
            ? { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }
            : {}),
          ...(isMax820 ? { gridTemplateColumns: "1fr" } : {}),
        }}
      >
        {markedListings.map((listing) => {
          const vendor = vendors.find((item) => item.id === listing.vendorId);
          return vendor ? (
            <VendorListingTile
              key={listing.vendorId}
              vendor={vendor}
              listing={listing}
            />
          ) : null;
        })}
      </div>
    </section>
  );
}
