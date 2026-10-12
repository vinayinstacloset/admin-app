import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "../../hooks/useClickOutside";
import {
  hoverStyle,
  focusStyle,
} from "../../../../shared/utils/interactiveStyle";

export interface SelectOption {
  value: string;
  label: string;
  swatch?: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: SelectOption[];
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  leadingIcon?: ReactNode;
}

// Labelled select with a custom option list so the open state matches the design.
export default function SelectField({
  label,
  value,
  options,
  placeholder,
  onChange,
  disabled = false,
  leadingIcon,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const close = useCallback(() => setOpen(false), []);

  useClickOutside(rootRef, close, open);

  const selected = options.find((option) => option.value === value);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 7,
        minWidth: 0,
      }}
      ref={rootRef}
    >
      <span
        style={{ fontSize: 11.5, fontWeight: 500, color: "#3f3934" }}
        id={labelId}
      >
        {label}
      </span>

      <div style={{ position: "relative" }}>
        <button
          type="button"
          style={{
            ...{
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
              textAlign: "left",
              color: "#a09a94",
              fontFamily: "inherit",
              cursor: "pointer",
            },
            ...(selected ? { color: "#1f1a17", fontWeight: 600 } : {}),
            ...(disabled
              ? { background: "#faf9f8", cursor: "not-allowed" }
              : {}),
          }}
          {...focusStyle(
            { borderColor: "#6d4c36", outline: 0 },
            { borderColor: "#b9b5b1", outline: "" },
            true,
          )}
          aria-labelledby={labelId}
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
        >
          {selected?.swatch ? (
            <i
              style={{
                ...{
                  display: "inline-block",
                  flex: "none",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                },
                backgroundColor: selected.swatch,
              }}
            />
          ) : (
            leadingIcon
          )}
          <span
            style={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown size={16} style={{ flex: "none", color: "#3b3530" }} />
        </button>

        {open && (
          <ul
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              zIndex: 20,
              maxHeight: 220,
              margin: 0,
              padding: 4,
              overflowY: "auto",
              listStyle: "none",
              borderRadius: 6,
              background: "#fff",
              boxShadow: "0 4px 18px rgba(0, 0, 0, 0.16)",
            }}
            role="listbox"
            aria-labelledby={labelId}
          >
            {options.length === 0 && (
              <li
                style={{
                  padding: "10px 8px",
                  fontSize: 11.5,
                  color: "#6b6560",
                }}
              >
                No options available
              </li>
            )}
            {options.map((option) => (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  style={{
                    ...{
                      fontFamily: "inherit",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      padding: 8,
                      border: 0,
                      borderRadius: 4,
                      background: "transparent",
                      textAlign: "left",
                      fontSize: 11.5,
                      color: "#1f1a17",
                    },
                    ...(option.value === value
                      ? { background: "#f0ece9" }
                      : {}),
                  }}
                  {...hoverStyle(
                    { background: "#f0ece9" },
                    {
                      background:
                        option.value === value ? "#f0ece9" : "transparent",
                    },
                  )}
                  onClick={() => {
                    onChange(option.value);
                    close();
                  }}
                >
                  {option.swatch && (
                    <i
                      style={{
                        ...{
                          display: "inline-block",
                          flex: "none",
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                        },
                        backgroundColor: option.swatch,
                      }}
                    />
                  )}
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
