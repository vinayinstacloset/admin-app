import { useMemo, useState } from "react";
import { Palette } from "lucide-react";
import type { ProductVariant } from "../../types/pricemarkup.types";
import MarkupModal from "../common/MarkupModal";
import SearchSelect from "../common/SearchSelect";
import SelectField from "../common/SelectField";

interface SearchProductModalProps {
    mode: "add" | "edit";
    variants: ProductVariant[];
    /** Pre-selected variant when editing the product on the Add Markup page. */
    initial?: ProductVariant;
    onContinue: (variant: ProductVariant) => void;
    onClose: () => void;
}

// "Search product" (from the toolbar) and "Edit product" (from the Add Markup
// page) — pick a product, then its size and colour to resolve one variant.
export default function SearchProductModal({ mode, variants, initial, onContinue, onClose }: SearchProductModalProps) {
    const [query, setQuery] = useState("");
    const [productId, setProductId] = useState<string | null>(initial?.productId ?? null);
    const [size, setSize] = useState(initial?.size ?? "");
    const [color, setColor] = useState(initial?.color ?? "");

    const products = useMemo(() => {
        const seen = new Map<string, ProductVariant>();
        variants.forEach((variant) => {
            if (!seen.has(variant.productId)) seen.set(variant.productId, variant);
        });
        return [...seen.values()];
    }, [variants]);

    const suggestions = useMemo(() => {
        const term = query.trim().toLowerCase();

        return products
            .filter((product) => product.name.toLowerCase().includes(term))
            .map((product) => ({
                id: product.productId,
                label: product.name,
                description: `${product.gender} · ${product.color}`,
                image: product.image,
            }));
    }, [products, query]);

    const productVariants = useMemo(() => variants.filter((variant) => variant.productId === productId), [variants, productId]);
    const selectedProduct = products.find((product) => product.productId === productId);

    const sizeOptions = useMemo(
        () => [...new Set(productVariants.map((variant) => variant.size))].map((value) => ({ value, label: value })),
        [productVariants],
    );

    const colorOptions = useMemo(() => {
        const seen = new Map<string, string>();
        productVariants
            .filter((variant) => variant.size === size)
            .forEach((variant) => seen.set(variant.color, variant.colorHex));

        return [...seen.entries()].map(([value, swatch]) => ({ value, label: value, swatch }));
    }, [productVariants, size]);

    const resolvedVariant = productVariants.find((variant) => variant.size === size && variant.color === color);

    return (
        <MarkupModal title={mode === "add" ? "Search product" : "Edit product"} onClose={onClose} widthClassName="pm-modal--xs">
            <div className="pm-modal__body">
                <SearchSelect
                    label="Product"
                    placeholder="Search product name"
                    query={query}
                    onQueryChange={setQuery}
                    options={suggestions}
                    selectedLabel={selectedProduct?.name ?? null}
                    emptyText="No products found"
                    onSelect={(id) => {
                        setProductId(id);
                        setSize("");
                        setColor("");
                    }}
                    onClear={() => {
                        setProductId(null);
                        setSize("");
                        setColor("");
                    }}
                />

                <SelectField
                    label="Size"
                    placeholder="Select size"
                    value={size}
                    options={sizeOptions}
                    disabled={!productId}
                    onChange={(value) => {
                        setSize(value);
                        setColor("");
                    }}
                />

                <SelectField
                    label="Color"
                    placeholder="Select color"
                    value={color}
                    options={colorOptions}
                    disabled={!size}
                    leadingIcon={<Palette size={16} />}
                    onChange={setColor}
                />
            </div>

            <div className="pm-modal__actions">
                <button type="button" className="pm-btn pm-btn--outline" onClick={onClose}>
                    Discard
                </button>
                <button type="button" className="pm-btn pm-btn--primary" disabled={!resolvedVariant} onClick={() => resolvedVariant && onContinue(resolvedVariant)}>
                    Continue
                </button>
            </div>
        </MarkupModal>
    );
}
