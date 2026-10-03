import { useMemo, useState } from "react";
import { ListFilter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import DropdownMenu from "../../components/common/DropdownMenu";
import ProductSummary from "../../components/common/ProductSummary";
import SuccessModal from "../../components/common/SuccessModal";
import ProductMarkupCard from "../../components/product/ProductMarkupCard";
import SearchProductModal from "../../components/product/SearchProductModal";
import { PRODUCT_SORT_OPTIONS, PRICE_MARKUP_ROUTE } from "../../constants/priceMarkup.constants";
import { usePriceMarkupStore } from "../../store/priceMarkupStore";
import type { ProductSortKey, ProductVariant } from "../../types/pricemarkup.types";
import { hasAnyMarkup, sortVariants } from "../../utils/pricemarkup.utils";

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
        return sortVariants(marked.filter((variant) => variant.name.toLowerCase().includes(term)), sort);
    }, [marked, search, sort]);

    const openMarkupPage = (variantId: string) => navigate(`${PRICE_MARKUP_ROUTE}/add/${variantId}`);

    return (
        <>
            <div className="pm-toolbar">
                <h2 className="pm-toolbar__title">Markup product - {visible.length}</h2>

                <div className="pm-toolbar__controls">
                    <label className="pm-search">
                        <Search size={14} />
                        <input placeholder="Search product name" value={search} onChange={(event) => setSearch(event.target.value)} />
                    </label>

                    <ListFilter size={17} className="pm-toolbar__filter-icon" aria-hidden="true" />

                    <DropdownMenu value={sort} options={PRODUCT_SORT_OPTIONS} onChange={setSort} ariaLabel="Sort products" />

                    <button type="button" className="pm-btn pm-btn--primary pm-btn--toolbar" onClick={() => setSearchOpen(true)}>
                        Add Markup +
                    </button>
                </div>
            </div>

            <div className="pm-stack">
                {visible.length === 0 && <div className="pm-empty">No products with markup found</div>}

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
                    header={<ProductSummary variant={deleting} className="pm-product-summary--compact" />}
                    message={
                        <>
                            Are you sure you want to <strong>delete Markup?</strong>
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
                <SuccessModal title="Deleted" message={successMessage} onClose={() => setSuccessMessage(null)} />
            )}
        </>
    );
}
