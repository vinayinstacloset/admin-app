import type { Markup, MarkupKind, ProductSortKey, ProductVariant } from "../types/pricemarkup.types";

export const formatMoney = (value: number): string => `₹${value.toLocaleString("en-IN")}`;

export const formatPercent = (value: number): string => `${Number(value.toFixed(2))}%`;

export const calculatePrice = (sellingPrice: number, markup: Markup): number => {
    const factor = markup.kind === "hike" ? 1 + markup.percent / 100 : 1 - markup.percent / 100;
    return Math.round(sellingPrice * factor);
};

/** "5% hike" / "9% discount" — used on product tiles. */
export const markupLabel = (markup: Markup): string => `${formatPercent(markup.percent)} ${markup.kind}`;

/** "6% off" / "3% hike" — used in the category table. */
export const categoryMarkupLabel = (markup: Markup): string =>
    `${formatPercent(markup.percent)} ${markup.kind === "discount" ? "off" : "hike"}`;

export const kindLabel = (kind: MarkupKind): string => (kind === "discount" ? "Discount" : "Hike");

export const sameMarkup = (a: Markup | null, b: Markup | null): boolean => {
    if (!a || !b) return a === b;
    return a.kind === b.kind && a.percent === b.percent;
};

export const hasAnyMarkup = (variant: ProductVariant): boolean => variant.listings.some((listing) => listing.markup);

export const sortVariants = (variants: ProductVariant[], sort: ProductSortKey): ProductVariant[] => {
    const list = [...variants];

    switch (sort) {
        case "sold-asc":
            return list.sort((a, b) => a.unitSold - b.unitSold);
        case "revenue-desc":
            return list.sort((a, b) => b.revenue - a.revenue);
        case "revenue-asc":
            return list.sort((a, b) => a.revenue - b.revenue);
        default:
            return list.sort((a, b) => b.unitSold - a.unitSold);
    }
};

let idCounter = 0;
export const nextId = (prefix: string): string => `${prefix}-${Date.now().toString(36)}-${++idCounter}`;
