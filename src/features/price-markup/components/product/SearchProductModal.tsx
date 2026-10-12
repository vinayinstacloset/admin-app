import { useMemo, useState } from "react";
import { Palette } from "lucide-react";
import type { ProductVariant } from "../../types/pricemarkup.types";
import MarkupModal from "../common/MarkupModal";
import SearchSelect from "../common/SearchSelect";
import SelectField from "../common/SelectField";
import {
  hoverStyle,
  focusStyle,
} from "../../../../shared/utils/interactiveStyle";

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
export default function SearchProductModal({
  mode,
  variants,
  initial,
  onContinue,
  onClose,
}: SearchProductModalProps) {
  const [query, setQuery] = useState("");
  const [productId, setProductId] = useState<string | null>(
    initial?.productId ?? null,
  );
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

  const productVariants = useMemo(
    () => variants.filter((variant) => variant.productId === productId),
    [variants, productId],
  );
  const selectedProduct = products.find(
    (product) => product.productId === productId,
  );

  const sizeOptions = useMemo(
    () =>
      [...new Set(productVariants.map((variant) => variant.size))].map(
        (value) => ({ value, label: value }),
      ),
    [productVariants],
  );

  const colorOptions = useMemo(() => {
    const seen = new Map<string, string>();
    productVariants
      .filter((variant) => variant.size === size)
      .forEach((variant) => seen.set(variant.color, variant.colorHex));

    return [...seen.entries()].map(([value, swatch]) => ({
      value,
      label: value,
      swatch,
    }));
  }, [productVariants, size]);

  const resolvedVariant = productVariants.find(
    (variant) => variant.size === size && variant.color === color,
  );

  return (
    <MarkupModal
      title={mode === "add" ? "Search product" : "Edit product"}
      onClose={onClose}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          padding: "16px 20px 6px",
        }}
      >
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 9,
          padding: 20,
        }}
      >
        <button
          type="button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 18px",
            border: "1px solid #2c2622",
            borderRadius: 6,
            fontSize: 12.5,
            fontWeight: 600,
            transition: "background 0.15s, border-color 0.15s, opacity 0.15s",
            background: "#fff",
            color: "#2c2622",
            fontFamily: "inherit",
            cursor: "pointer",
            height: 40,
          }}
          {...hoverStyle({ background: "#f7f5f3" }, { background: "#fff" })}
          onClick={onClose}
        >
          Discard
        </button>
        <button
          type="button"
          style={{
            ...{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 18px",
              border: "1px solid transparent",
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: 600,
              transition: "background 0.15s, border-color 0.15s, opacity 0.15s",
              background: "#6d4c36",
              color: "#fff",
              fontFamily: "inherit",
              cursor: "pointer",
              height: 40,
            },
            ...(!resolvedVariant
              ? {
                  background: "#dcdcdc",
                  borderColor: "transparent",
                  color: "#a3a3a3",
                  cursor: "not-allowed",
                }
              : {}),
          }}
          {...hoverStyle(
            { background: "#5c4030" },
            { background: "#6d4c36" },
            true,
          )}
          disabled={!resolvedVariant}
          onClick={() => resolvedVariant && onContinue(resolvedVariant)}
        >
          Continue
        </button>
      </div>
    </MarkupModal>
  );
}
