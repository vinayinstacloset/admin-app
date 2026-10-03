import { useCallback, useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useClickOutside } from "../../hooks/useClickOutside";

export interface SearchSelectOption {
    id: string;
    label: string;
    description?: string;
    image?: string;
}

interface SearchSelectProps {
    label: string;
    placeholder: string;
    query: string;
    onQueryChange: (query: string) => void;
    options: SearchSelectOption[];
    selectedLabel: string | null;
    onSelect: (id: string) => void;
    onClear: () => void;
    emptyText: string;
}

// Search box that turns into the chosen value (with a clear "x") once a
// suggestion is picked — used for "Search product" and "Search vendor".
export default function SearchSelect({
    label,
    placeholder,
    query,
    onQueryChange,
    options,
    selectedLabel,
    onSelect,
    onClear,
    emptyText,
}: SearchSelectProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const inputId = useId();
    const close = useCallback(() => setOpen(false), []);

    useClickOutside(rootRef, close, open);

    const hasSelection = selectedLabel !== null;
    const showMenu = open && !hasSelection;

    return (
        <div className="pm-field" ref={rootRef}>
            <label className="pm-field__label" htmlFor={inputId}>
                {label}
            </label>

            <div className={`pm-input pm-input--search ${hasSelection ? "has-value" : ""}`}>
                <Search size={17} className="pm-input__icon" />
                <input
                    id={inputId}
                    autoComplete="off"
                    placeholder={placeholder}
                    readOnly={hasSelection}
                    value={hasSelection ? selectedLabel : query}
                    onFocus={() => setOpen(true)}
                    onChange={(event) => {
                        onQueryChange(event.target.value);
                        setOpen(true);
                    }}
                />
                {(hasSelection || query) && (
                    <button
                        type="button"
                        className="pm-input__clear"
                        aria-label="Clear search"
                        onClick={() => {
                            onClear();
                            onQueryChange("");
                            setOpen(false);
                        }}
                    >
                        <X size={13} />
                    </button>
                )}
            </div>

            {showMenu && (
                <ul className="pm-suggestions" role="listbox">
                    {options.length === 0 && <li className="pm-suggestions__empty">{emptyText}</li>}
                    {options.map((option) => (
                        <li key={option.id} role="presentation">
                            <button
                                type="button"
                                role="option"
                                aria-selected={false}
                                onClick={() => {
                                    onSelect(option.id);
                                    setOpen(false);
                                }}
                            >
                                {option.image && <img src={option.image} alt="" />}
                                <span>
                                    {option.label}
                                    {option.description && <small>{option.description}</small>}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
