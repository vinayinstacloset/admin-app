import type { PriceMarkupTab, ProductSortKey } from "../types/pricemarkup.types";

export const PRICE_MARKUP_ROUTE = "/admin-dashboard/price-markup";

export const PRICE_MARKUP_TABS: { key: PriceMarkupTab; label: string }[] = [
    { key: "product", label: "Product" },
    { key: "category", label: "Category" },
    { key: "vendor", label: "Vendor" },
];

export const PRODUCT_SORT_OPTIONS: { value: ProductSortKey; label: string }[] = [
    { value: "sold-desc", label: "Unit sold (High to low)" },
    { value: "sold-asc", label: "Unit sold (Low to high)" },
    { value: "revenue-desc", label: "Revenue (High to low)" },
    { value: "revenue-asc", label: "Revenue (Low to high)" },
];

export const CATEGORY_ALL_FILTER = "all";

export const MAX_MARKUP_PERCENT = 100;
