import { ChevronDown } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import { hoverStyle, focusStyle } from "../../../shared/utils/interactiveStyle";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}
interface Props {
  value: string;
  options: Option[];
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function Dropdown({
  value,
  options,
  placeholder,
  onChange,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);
  const selected = options.find((item) => item.value === value);
  return (
    <div style={{ position: "relative", minWidth: 82 }} ref={ref}>
      <button
        type="button"
        style={{
          justifyContent: "space-between",
          gap: 10,
          cursor: "pointer",
          boxSizing: "border-box",
          width: "100%",
          height: 36,
          border: "1px solid #a9a6a3",
          background: "#fff",
          borderRadius: 5,
          padding: "0 12px",
          outline: "none",
          color: "#2b2724",
          fontSize: 12,
          display: "flex",
          alignItems: "center",
          fontFamily: "inherit",
          ...(disabled ? { background: "#eee", color: "#aaa" } : {}),
        }}
        {...focusStyle({ borderColor: "#76523b" }, { borderColor: "#a9a6a3" })}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{selected?.label ?? placeholder}</span>
        <ChevronDown size={15} />
      </button>
      {open && !disabled && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 5px)",
            right: 0,
            zIndex: 60,
            width: "100%",
            minWidth: 96,
            padding: 5,
            background: "#fff",
            borderRadius: 5,
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.16)",
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              style={{
                ...{
                  fontFamily: "inherit",
                  display: "block",
                  width: "100%",
                  padding: "8px 8px",
                  border: 0,
                  background: "#fff",
                  textAlign: "left",
                  borderRadius: 3,
                  fontSize: 11,
                  color: "#2d2926",
                  cursor: "pointer",
                },
                ...(option.value === value ? { background: "#ece9e7" } : {}),
                ...(option.disabled
                  ? { color: "#aaa", cursor: "not-allowed" }
                  : {}),
              }}
              {...hoverStyle(
                { background: "#ece9e7" },
                { background: option.value === value ? "#ece9e7" : "#fff" },
              )}
              onClick={() => {
                if (!option.disabled) {
                  onChange(option.value);
                  close();
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
