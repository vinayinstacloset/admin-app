import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const baseProps = (size: number) => ({
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
});

/** Shopping bag with a down arrow — "UNIT SOLD". */
export function UnitSoldIcon({ size = 12, ...props }: IconProps) {
    return (
        <svg viewBox="0 0 16 16" strokeWidth={1.2} {...baseProps(size)} {...props}>
            <path d="M3 5.2h10l-.7 8.3H3.7L3 5.2Z" />
            <path d="M5.6 5.2v-.8a2.4 2.4 0 0 1 4.8 0v.8" />
            <path d="M8 7.6v3.2M6.6 9.5 8 10.9l1.4-1.4" />
        </svg>
    );
}

/** Money bag — "REVENUE". */
export function RevenueIcon({ size = 12, ...props }: IconProps) {
    return (
        <svg viewBox="0 0 16 16" strokeWidth={1.2} {...baseProps(size)} {...props}>
            <path d="M5.5 2.5h5l-1 2h-3l-1-2Z" />
            <path d="M6.5 4.5C3.5 6 2.8 9 3.5 11.2c.5 1.5 1.7 2.3 4.5 2.3s4-.8 4.5-2.3c.7-2.2 0-5.2-3-6.7" />
            <path d="M9.3 8.2H7.4a.9.9 0 0 0 0 1.8h1.2a.9.9 0 0 1 0 1.8H6.6M8 7.3v.9M8 11.8v.8" />
        </svg>
    );
}

/** Rupee glyph — "AVERAGE PRICE". */
export function AveragePriceIcon({ size = 12, ...props }: IconProps) {
    return (
        <svg viewBox="0 0 16 16" strokeWidth={1.4} {...baseProps(size)} {...props}>
            <path d="M4.5 3h7M4.5 6h7M4.5 3h1.6a2.6 2.6 0 0 1 0 5.2H4.5L10.5 13" />
        </svg>
    );
}

/** Tag with a percent sign — the big Discount / Hike illustration. */
export function TagPercentIcon({ size = 70, ...props }: IconProps) {
    return (
        <svg viewBox="0 0 72 72" strokeWidth={2.2} {...baseProps(size)} {...props}>
            {/* tag behind */}
            <path d="M43 13.5 58.5 24v27.5a4 4 0 0 1-4 4H52" />
            {/* front tag */}
            <g transform="rotate(-9 30 36)">
                <path d="M11 24 27 11l16 13v31a4 4 0 0 1-4 4H15a4 4 0 0 1-4-4V24Z" />
                <circle cx="27" cy="22" r="2.4" />
                <path d="M27 20C22 14 14 9 8 8" />
                <circle cx="21.5" cy="37" r="3" />
                <circle cx="32.5" cy="49" r="3" />
                <path d="M34 34 20 52" />
            </g>
        </svg>
    );
}
