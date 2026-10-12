import type {
  MarkupVendor,
  VendorListing,
} from "../../types/pricemarkup.types";
import {
  calculatePrice,
  formatMoney,
  markupLabel,
} from "../../utils/pricemarkup.utils";
import { useMediaQuery } from "../../../../shared/hooks/useMediaQuery";
import {
  hoverStyle,
  focusStyle,
} from "../../../../shared/utils/interactiveStyle";

interface VendorListingTileProps {
  vendor: MarkupVendor;
  listing: VendorListing;
  /** List cards use "Selling price:" (with colon); the Add Markup page does not. */
  withColon?: boolean;
  /** Text for the action button under the tile ("Add Markup" / "Edit Markup"). */
  actionLabel?: string;
  onAction?: () => void;
}

// One vendor's storefront photo + selling / hike-discount / calculated price.
export default function VendorListingTile({
  vendor,
  listing,
  withColon = true,
  actionLabel,
  onAction,
}: VendorListingTileProps) {
  const isMax820 = useMediaQuery("(max-width: 820px)");
  const { markup, sellingPrice } = listing;
  const colon = withColon ? ":" : "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
        padding: 10,
        borderRadius: 8,
        background: "#f2f1ef",
      }}
    >
      <div style={{ display: "flex", gap: 10, minWidth: 0 }}>
        <img
          style={{
            ...{
              flex: "none",
              width: actionLabel ? 150 : 163,
              height: actionLabel ? 74 : 80,
              borderRadius: 4,
              objectFit: "cover",
            },
            ...(isMax820 ? { width: 120 } : {}),
          }}
          src={vendor.image}
          alt={`${vendor.name} storefront`}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: "0 0 6px",
              fontSize: 10,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <strong>{vendor.name}</strong>{" "}
            <span style={{ color: "#55504b" }}>({vendor.location})</span>
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: "6px 8px",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <span
                style={{
                  display: "block",
                  overflowWrap: "break-word",
                  fontSize: 8.5,
                  color: "#6b6560",
                }}
              >
                Selling price{colon}
              </span>
              <strong
                style={{
                  display: "block",
                  marginBottom: 3,
                  overflowWrap: "break-word",
                  fontSize: 10.5,
                  fontWeight: 700,
                }}
              >
                {formatMoney(sellingPrice)}
              </strong>
              <span
                style={{
                  display: "block",
                  overflowWrap: "break-word",
                  fontSize: 8.5,
                  color: "#6b6560",
                }}
              >
                Calculated price{colon}
              </span>
              <strong
                style={{
                  display: "block",
                  marginBottom: 3,
                  overflowWrap: "break-word",
                  fontSize: 10.5,
                  fontWeight: 700,
                }}
              >
                {markup
                  ? formatMoney(calculatePrice(sellingPrice, markup))
                  : "-"}
              </strong>
            </div>

            <div style={{ minWidth: 0 }}>
              <span
                style={{
                  display: "block",
                  overflowWrap: "break-word",
                  fontSize: 8.5,
                  color: "#6b6560",
                }}
              >
                Price hike/discount{colon}
              </span>
              <strong
                style={{
                  display: "block",
                  marginBottom: 3,
                  overflowWrap: "break-word",
                  fontSize: 10.5,
                  fontWeight: 700,
                  ...(markup
                    ? {
                        color:
                          markup.kind === "discount" ? "#ff6536" : "#39bd65",
                      }
                    : {}),
                }}
              >
                {markup ? markupLabel(markup) : "-"}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Kept inside the tile's own padding — never overlaps the card below it. */}
      {actionLabel && (
        <button
          type="button"
          style={{
            width: "100%",
            height: 28,
            border: "1px solid #6d4c36",
            borderRadius: 4,
            background: "#f8f6f4",
            color: "#6d4c36",
            fontSize: 10,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: "pointer",
          }}
          {...hoverStyle({ background: "#efe9e4" }, { background: "#f8f6f4" })}
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
