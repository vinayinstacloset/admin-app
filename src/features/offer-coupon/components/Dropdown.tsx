import { ChevronDown } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import { useClickOutside } from "../hooks/useClickOutside";

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
    <div className={`oc-dropdown ${disabled ? "is-disabled" : ""}`} ref={ref}>
      <button
        type="button"
        className="oc-field oc-dropdown-trigger"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={selected ? "oc-value" : "oc-placeholder"}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown size={15} />
      </button>
      {open && !disabled && (
        <div className="oc-dropdown-menu">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              className={option.value === value ? "is-selected" : ""}
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
