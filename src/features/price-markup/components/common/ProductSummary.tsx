import type { CSSProperties } from "react";
import { Pencil } from "lucide-react";
import type { ProductVariant } from "../../types/pricemarkup.types";
import {
  hoverStyle,
  focusStyle,
} from "../../../../shared/utils/interactiveStyle";

interface ProductSummaryProps {
  variant: ProductVariant;
  onEdit?: () => void;
  compact?: boolean;
  style?: CSSProperties;
}

// Product thumbnail + name + Gender / Size / Color — shared by the product
// list cards, the Add Markup page header and the delete confirmation.
export default function ProductSummary({
  variant,
  onEdit,
  compact = false,
  style,
}: ProductSummaryProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 0,
        ...(compact
          ? { padding: "8px 10px", borderRadius: 8, background: "#f2f1ef" }
          : {}),
        ...style,
      }}
    >
      <img
        style={{
          flex: "none",
          width: compact ? 76 : 75,
          height: compact ? 76 : 75,
          borderRadius: 4,
          objectFit: "cover",
        }}
        src={variant.image}
        alt={variant.name}
      />

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 8,
            fontSize: 13,
          }}
        >
          <strong style={{ fontWeight: 600 }}>{variant.name}</strong>
          {onEdit && (
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
              aria-label="Edit product"
              onClick={onEdit}
            >
              <Pencil size={13} />
            </button>
          )}
        </div>

        <dl style={{ display: "flex", gap: compact ? 24 : 28, margin: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <dt style={{ fontSize: 10, fontWeight: 500, color: "#6b6560" }}>
              Gender:
            </dt>
            <dd
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                margin: 0,
                fontSize: 11.5,
                fontWeight: 600,
              }}
            >
              {variant.gender}
            </dd>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <dt style={{ fontSize: 10, fontWeight: 500, color: "#6b6560" }}>
              Size:
            </dt>
            <dd
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                margin: 0,
                fontSize: 11.5,
                fontWeight: 600,
              }}
            >
              {variant.size}
            </dd>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <dt style={{ fontSize: 10, fontWeight: 500, color: "#6b6560" }}>
              Color:
            </dt>
            <dd
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                margin: 0,
                fontSize: 11.5,
                fontWeight: 600,
              }}
            >
              <i
                style={{
                  ...{
                    display: "inline-block",
                    flex: "none",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                  },
                  backgroundColor: variant.colorHex,
                }}
              />
              {variant.color}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
