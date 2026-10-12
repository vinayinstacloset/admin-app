import { useMemo, useState } from "react";
import { ListFilter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import DropdownMenu from "../../components/common/DropdownMenu";
import ProductSummary from "../../components/common/ProductSummary";
import SuccessModal from "../../components/common/SuccessModal";
import ProductMarkupCard from "../../components/product/ProductMarkupCard";
import SearchProductModal from "../../components/product/SearchProductModal";
import {
  PRODUCT_SORT_OPTIONS,
  PRICE_MARKUP_ROUTE,
} from "../../constants/priceMarkup.constants";
import { usePriceMarkupStore } from "../../store/priceMarkupStore";
import type {
  ProductSortKey,
  ProductVariant,
} from "../../types/pricemarkup.types";
import { hasAnyMarkup, sortVariants } from "../../utils/pricemarkup.utils";
import {
  hoverStyle,
  focusStyle,
} from "../../../../shared/utils/interactiveStyle";

export default function ProductTab() {
  const navigate = useNavigate();
  const { variants, vendors, removeVariantMarkups } = usePriceMarkupStore();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<ProductSortKey>("sold-desc");
  const [searchOpen, setSearchOpen] = useState(false);
  const [deleting, setDeleting] = useState<ProductVariant | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const marked = useMemo(() => variants.filter(hasAnyMarkup), [variants]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sortVariants(
      marked.filter((variant) => variant.name.toLowerCase().includes(term)),
      sort,
    );
  }, [marked, search, sort]);

  const openMarkupPage = (variantId: string) =>
    navigate(`${PRICE_MARKUP_ROUTE}/add/${variantId}`);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
          Markup product - {visible.length}
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: 263,
              maxWidth: "100%",
              height: 34,
              padding: "0 12px",
              borderRadius: 6,
              background: "#f7f6f5",
              color: "#77706a",
            }}
          >
            <Search size={14} />
            <input
              style={{
                flex: 1,
                minWidth: 0,
                border: 0,
                outline: 0,
                background: "transparent",
                fontStyle: "inherit",
                fontVariant: "inherit",
                fontWeight: "inherit",
                lineHeight: "inherit",
                fontFamily: "inherit",
                fontSize: 11.5,
                color: "#1f1a17",
              }}
              placeholder="Search product name"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <ListFilter
            size={17}
            style={{ color: "#4b4540" }}
            aria-hidden="true"
          />

          <DropdownMenu
            value={sort}
            options={PRODUCT_SORT_OPTIONS}
            onChange={setSort}
            ariaLabel="Sort products"
          />

          <button
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid transparent",
              fontWeight: 600,
              transition: "background 0.15s, border-color 0.15s, opacity 0.15s",
              background: "#6d4c36",
              color: "#fff",
              height: 36,
              padding: "0 16px",
              fontSize: 11.5,
              borderRadius: 4,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
            {...hoverStyle(
              { background: "#5c4030" },
              { background: "#6d4c36" },
              true,
            )}
            onClick={() => setSearchOpen(true)}
          >
            Add Markup +
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {visible.length === 0 && (
          <div
            style={{
              padding: "40px 16px",
              borderRadius: 12,
              background: "#fff",
              textAlign: "center",
              fontSize: 13,
              color: "#6b6560",
            }}
          >
            No products with markup found
          </div>
        )}

        {visible.map((variant) => (
          <ProductMarkupCard
            key={variant.id}
            variant={variant}
            vendors={vendors}
            onEdit={() => openMarkupPage(variant.id)}
            onDelete={() => setDeleting(variant)}
          />
        ))}
      </div>

      {searchOpen && (
        <SearchProductModal
          mode="add"
          variants={variants}
          onClose={() => setSearchOpen(false)}
          onContinue={(variant) => openMarkupPage(variant.id)}
        />
      )}

      {deleting && (
        <ConfirmDialog
          header={<ProductSummary variant={deleting} compact />}
          message={
            <>
              Are you sure you want to{" "}
              <strong style={{ fontWeight: 600 }}>delete Markup?</strong>
            </>
          }
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            removeVariantMarkups(deleting.id);
            setDeleting(null);
            setSuccessMessage("Markup deleted successfully.");
          }}
        />
      )}

      {successMessage && (
        <SuccessModal
          title="Deleted"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </>
  );
}
