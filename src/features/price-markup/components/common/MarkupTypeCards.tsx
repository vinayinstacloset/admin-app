import type { CSSProperties } from "react";
import type { MarkupKind } from "../../types/pricemarkup.types";
import { TagPercentIcon } from "./MarkupIcons";
import { useMediaQuery } from "../../../../shared/hooks/useMediaQuery";

interface MarkupTypeCardsProps {
  value: MarkupKind | null;
  onChange: (kind: MarkupKind) => void;
  size?: "lg" | "sm";
}

const OPTIONS: { kind: MarkupKind; label: string }[] = [
  { kind: "discount", label: "DISCOUNT" },
  { kind: "hike", label: "HIKE" },
];

const ICON_COLOR: Record<MarkupKind, string> = {
  discount: "#ff6536",
  hike: "#39bd65",
};

// The two big Discount / Hike radio cards used across every markup modal.
export default function MarkupTypeCards({
  value,
  onChange,
  size = "lg",
}: MarkupTypeCardsProps) {
  const isMax820 = useMediaQuery("(max-width: 820px)");
  const isLarge = size === "lg";

  const gridStyle: CSSProperties = isLarge
    ? { display: "grid", gap: 20, gridTemplateColumns: "1fr 1fr" }
    : {
        display: "grid",
        gap: 20,
        gridTemplateColumns: isMax820
          ? "repeat(2, minmax(0, 1fr))"
          : "repeat(2, 172px)",
        justifyContent: "center",
      };

  return (
    <div style={gridStyle} role="radiogroup" aria-label="Markup type">
      {OPTIONS.map(({ kind, label }) => {
        const checked = value === kind;

        return (
          <button
            key={kind}
            type="button"
            role="radio"
            aria-checked={checked}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: isLarge ? 14 : 10,
              height: isLarge ? 175 : 120,
              border: checked ? "1px solid #6d4c36" : "1px solid #cfcbc7",
              borderRadius: 5,
              background: checked ? "#f1efed" : "#fff",
              color: "#2c2622",
              transition: "background 0.15s, border-color 0.15s",
              marginBottom: 20,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
            onClick={() => onChange(kind)}
          >
            <TagPercentIcon
              size={isLarge ? 72 : 46}
              style={{
                color: ICON_COLOR[kind],
                width: isLarge ? 72 : 46,
                height: isLarge ? 72 : 46,
              }}
            />
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontWeight: isLarge ? 300 : 400,
                fontSize: isLarge ? 17 : 11.5,
                letterSpacing: "0.01em",
              }}
            >
              <span
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: isLarge ? 15 : 14,
                  height: isLarge ? 15 : 14,
                  border: `1.5px solid ${checked ? "#6d4c36" : "#6b6560"}`,
                  borderRadius: "50%",
                }}
                aria-hidden="true"
              >
                {checked && (
                  <span
                    style={{
                      position: "absolute",
                      top: 2.5,
                      right: 2.5,
                      bottom: 2.5,
                      left: 2.5,
                      borderRadius: "50%",
                      background: "#6d4c36",
                    }}
                  />
                )}
              </span>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
