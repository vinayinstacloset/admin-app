import { X } from "lucide-react";
import type { MarkupKind } from "../../types/pricemarkup.types";
import { kindLabel } from "../../utils/pricemarkup.utils";

interface PercentFieldProps {
    kind: MarkupKind;
    value: string;
    onChange: (raw: string) => void;
    className?: string;
}

// "% Enter discount" / "% Enter hike" input with a clear button.
export default function PercentField({ kind, value, onChange, className = "" }: PercentFieldProps) {
    const label = kindLabel(kind);
    const inputId = `pm-percent-${kind}`;

    return (
        <div className={`pm-field ${className}`}>
            <label className="pm-field__label" htmlFor={inputId}>
                {label}
            </label>

            <div className="pm-input">
                <span className="pm-input__prefix">%</span>
                <input
                    id={inputId}
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder={`Enter ${kind}`}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                />
                {value && (
                    <button type="button" className="pm-input__clear" aria-label="Clear value" onClick={() => onChange("")}>
                        <X size={13} />
                    </button>
                )}
            </div>
        </div>
    );
}
