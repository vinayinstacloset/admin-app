import { X } from "lucide-react";
import type { MarkupKind } from "../../types/pricemarkup.types";
import { kindLabel } from "../../utils/pricemarkup.utils";
import {
  hoverStyle,
  focusStyle,
} from "../../../../shared/utils/interactiveStyle";

interface PercentFieldProps {
  kind: MarkupKind;
  value: string;
  onChange: (raw: string) => void;
  narrow?: boolean;
}

// "% Enter discount" / "% Enter hike" input with a clear button.
export default function PercentField({
  kind,
  value,
  onChange,
  narrow = false,
}: PercentFieldProps) {
  const label = kindLabel(kind);
  const inputId = `pm-percent-${kind}`;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 7,
        minWidth: 0,
        ...(narrow
          ? { alignSelf: "center", width: "100%", maxWidth: 364 }
          : {}),
      }}
    >
      <label
        style={{ fontSize: 11.5, fontWeight: 500, color: "#3f3934" }}
        htmlFor={inputId}
      >
        {label}
      </label>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          height: 36,
          padding: "0 12px",
          border: "1px solid #b9b5b1",
          borderRadius: 3,
          background: "#fff",
          fontSize: 11.5,
        }}
        {...focusStyle(
          { borderColor: "#6d4c36", outline: 0 },
          { borderColor: "", outline: "" },
        )}
      >
        <span style={{ fontSize: 11.5, fontWeight: 700 }}>%</span>
        <input
          style={{
            flex: 1,
            minWidth: 0,
            border: 0,
            outline: 0,
            background: "transparent",
            fontStyle: "inherit",
            fontVariant: "inherit",
            fontSize: "inherit",
            lineHeight: "inherit",
            fontFamily: "inherit",
            fontWeight: 600,
            color: "#1f1a17",
          }}
          id={inputId}
          data-placeholder="pm"
          inputMode="decimal"
          autoComplete="off"
          placeholder={`Enter ${kind}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {value && (
          <button
            type="button"
            style={{
              display: "inline-flex",
              padding: 0,
              border: 0,
              background: "transparent",
              color: "#8a8580",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
            aria-label="Clear value"
            onClick={() => onChange("")}
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
