import { useCallback, useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";

interface DropdownMenuProps<T extends string> {
    value: T;
    options: { value: T; label: string }[];
    onChange: (value: T) => void;
    ariaLabel: string;
    compact?: boolean;
}

// White pill trigger + floating option list (sort / gender filter).
export default function DropdownMenu<T extends string>({ value, options, onChange, ariaLabel, compact = false }: DropdownMenuProps<T>) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const close = useCallback(() => setOpen(false), []);

    useClickOutside(rootRef, close, open);

    const selected = options.find((option) => option.value === value);

    return (
        <div className={`pm-dropdown ${compact ? "pm-dropdown--compact" : ""}`} ref={rootRef}>
            <button
                type="button"
                className="pm-dropdown__trigger"
                aria-label={ariaLabel}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
            >
                <span>{selected?.label}</span>
                <span className={`pm-caret ${open ? "is-open" : ""}`} aria-hidden="true" />
            </button>

            {open && (
                <ul className="pm-dropdown__menu" role="listbox" aria-label={ariaLabel}>
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
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
