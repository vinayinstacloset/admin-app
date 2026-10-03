import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "../../hooks/useClickOutside";

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
export default function SelectField({ label, value, options, placeholder, onChange, disabled = false, leadingIcon }: SelectFieldProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const labelId = useId();
    const close = useCallback(() => setOpen(false), []);

    useClickOutside(rootRef, close, open);

    const selected = options.find((option) => option.value === value);

    return (
        <div className="pm-field" ref={rootRef}>
            <span className="pm-field__label" id={labelId}>
                {label}
            </span>

            <div className="pm-select">
                <button
                    type="button"
                    className={`pm-select__trigger ${selected ? "has-value" : ""}`}
                    aria-labelledby={labelId}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    disabled={disabled}
                    onClick={() => setOpen((current) => !current)}
                >
                    {selected?.swatch ? <i className="pm-color-dot" style={{ backgroundColor: selected.swatch }} /> : leadingIcon}
                    <span className="pm-select__text">{selected ? selected.label : placeholder}</span>
                    <ChevronDown size={16} className="pm-select__chevron" />
                </button>

                {open && (
                    <ul className="pm-select__menu" role="listbox" aria-labelledby={labelId}>
                        {options.length === 0 && <li className="pm-select__empty">No options available</li>}
                        {options.map((option) => (
                            <li key={option.value} role="presentation">
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={option.value === value}
                                    className={option.value === value ? "is-selected" : ""}
                                    onClick={() => {
                                        onChange(option.value);
                                        close();
                                    }}
                                >
                                    {option.swatch && <i className="pm-color-dot" style={{ backgroundColor: option.swatch }} />}
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
