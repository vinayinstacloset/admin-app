import type { SkuCategory } from "../types/sku.types";

export function stockSummary(category: SkuCategory): string {
    return `${category.skus} SKUS · ${category.lowStock} low stock · ${category.outOfStock} out of stock`;
}
