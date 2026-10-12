import { useCallback, useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { hoverStyle } from "../../../../shared/utils/interactiveStyle";

interface DropdownMenuProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  ariaLabel: string;
  compact?: boolean;
}

// White pill trigger + floating option list (sort / gender filter).
export default function DropdownMenu<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  compact = false,
}: DropdownMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useClickOutside(rootRef, close, open);

  const selected = options.find((option) => option.value === value);

  return (
    <div style={{ position: "relative" }} ref={rootRef}>
      <button
        type="button"
        style={{
          display: "inline-flex",
          alignItems: "center",
          height: 34,
          border: 0,
          borderRadius: 4,
          background: "#fff",
          color: "#1f1a17",
          fontFamily: "inherit",
          cursor: "pointer",
          padding: compact ? "0 10px" : "0 12px",
          gap: compact ? 6 : 10,
          fontSize: compact ? 11 : 11.5,
        }}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected?.label}</span>
        <span
          style={{
            width: 0,
            height: 0,
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderBottom: "4px solid #333",
            transition: "transform 0.15s",
            transform: open ? "none" : "rotate(180deg)",
          }}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            zIndex: 30,
            minWidth: compact ? 120 : "100%",
            margin: 0,
            padding: 4,
            listStyle: "none",
            borderRadius: 6,
            background: "#fff",
            boxShadow: "0 4px 18px rgba(0, 0, 0, 0.14)",
            whiteSpace: "nowrap",
          }}
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            const restingBackground = isSelected ? "#ece8e6" : "transparent";

            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  style={{
                    fontFamily: "inherit",
                    cursor: "pointer",
                    display: "block",
                    width: "100%",
                    padding: "9px 8px",
                    border: 0,
                    borderRadius: 4,
                    background: restingBackground,
                    textAlign: "left",
                    fontSize: 11,
                    color: "#1f1a17",
                  }}
                  {...hoverStyle(
                    { background: "#ece8e6" },
                    { background: restingBackground },
                  )}
                  onClick={() => {
                    onChange(option.value);
                    close();
                  }}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
