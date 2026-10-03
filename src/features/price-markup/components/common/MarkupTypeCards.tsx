import type { MarkupKind } from "../../types/pricemarkup.types";
import { TagPercentIcon } from "./MarkupIcons";

interface MarkupTypeCardsProps {
    value: MarkupKind | null;
    onChange: (kind: MarkupKind) => void;
    size?: "lg" | "sm";
}

const OPTIONS: { kind: MarkupKind; label: string }[] = [
    { kind: "discount", label: "DISCOUNT" },
    { kind: "hike", label: "HIKE" },
];

// The two big Discount / Hike radio cards used across every markup modal.
export default function MarkupTypeCards({ value, onChange, size = "lg" }: MarkupTypeCardsProps) {
    return (
        <div className={`pm-type-cards pm-type-cards--${size}`} role="radiogroup" aria-label="Markup type">
            {OPTIONS.map(({ kind, label }) => {
                const checked = value === kind;

                return (
                    <button
                        key={kind}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        className={`pm-type-card pm-type-card--${kind} ${checked ? "is-checked" : ""}`}
                        onClick={() => onChange(kind)}
                    >
                        <TagPercentIcon className="pm-type-card__icon" />
                        <span className="pm-type-card__label">
                            <span className="pm-radio" aria-hidden="true" />
                            {label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
