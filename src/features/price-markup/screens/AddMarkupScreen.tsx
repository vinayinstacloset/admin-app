import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { AveragePriceIcon, RevenueIcon, UnitSoldIcon } from "../components/common/MarkupIcons";
import ProductSummary from "../components/common/ProductSummary";
import StatTile from "../components/common/StatTile";
import SuccessModal from "../components/common/SuccessModal";
import MarkupTypeModal from "../components/product/MarkupTypeModal";
import SearchProductModal from "../components/product/SearchProductModal";
import VendorListingTile from "../components/product/VendorListingTile";
import { PRICE_MARKUP_ROUTE } from "../constants/priceMarkup.constants";
import { usePriceMarkupStore } from "../store/priceMarkupStore";
import "../styles/price-markup.css";
import type { Markup, ProductVariant, VendorListing } from "../types/pricemarkup.types";
import { formatMoney } from "../utils/pricemarkup.utils";

type ModalState = { type: "all" } | { type: "vendor"; vendorId: string } | { type: "product" } | null;

interface FormProps {
    variant: ProductVariant;
}

function AddMarkupForm({ variant }: FormProps) {
    const navigate = useNavigate();
    const { setExtraCrumbs } = useDashboardOutletContext();
    const { vendors, variants, saveVariantListings } = usePriceMarkupStore();

    const [listings, setListings] = useState<VendorListing[]>(variant.listings);
    const [modal, setModal] = useState<ModalState>(null);
    const [confirmDiscard, setConfirmDiscard] = useState(false);
    const [showSaved, setShowSaved] = useState(false);

    useEffect(() => {
        setExtraCrumbs([{ label: "Product", to: PRICE_MARKUP_ROUTE }, { label: "Add Markup" }]);
        return () => setExtraCrumbs([]);
    }, [setExtraCrumbs]);

    const isDirty = useMemo(() => JSON.stringify(listings) !== JSON.stringify(variant.listings), [listings, variant.listings]);
    const canSave = isDirty && listings.some((listing) => listing.markup);
    const goBack = () => navigate(PRICE_MARKUP_ROUTE);

    const applyMarkup = (vendorId: string | null, markup: Markup) =>
        setListings((current) => current.map((listing) => (vendorId === null || listing.vendorId === vendorId ? { ...listing, markup } : listing)));

    const activeListing = modal?.type === "vendor" ? listings.find((listing) => listing.vendorId === modal.vendorId) : undefined;
    const activeVendor = activeListing ? vendors.find((vendor) => vendor.id === activeListing.vendorId) : undefined;

    return (
        <div className="pm-page pm-page--add">
            <section className="pm-add-card">
                <div className="pm-add-card__head">
                    <ProductSummary variant={variant} onEdit={() => setModal({ type: "product" })} />

                    <div className="pm-add-card__stats">
                        <StatTile tone="purple" label="AVERAGE PRICE" value={formatMoney(variant.averagePrice)} icon={<AveragePriceIcon />} />
                        <StatTile tone="orange" label="UNIT SOLD" value={variant.unitSold} icon={<UnitSoldIcon />} />
                        <StatTile tone="green" label="REVENUE" value={formatMoney(variant.revenue)} icon={<RevenueIcon />} />
                    </div>
                </div>

                <div className="pm-add-card__body">
                    <div className="pm-add-card__bar">
                        <h3>Vendors - {listings.length}</h3>
                        <button type="button" className="pm-btn pm-btn--primary pm-btn--small" onClick={() => setModal({ type: "all" })}>
                            Markup for all
                        </button>
                    </div>

                    <div className="pm-vendor-grid">
                        {listings.map((listing) => {
                            const vendor = vendors.find((item) => item.id === listing.vendorId);
                            if (!vendor) return null;

                            return (
                                <VendorListingTile
                                    key={listing.vendorId}
                                    vendor={vendor}
                                    listing={listing}
                                    withColon={false}
                                    actionLabel={listing.markup ? "Edit Markup" : "Add Markup"}
                                    onAction={() => setModal({ type: "vendor", vendorId: listing.vendorId })}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>

            <div className="pm-page-actions">
                <button type="button" className="pm-btn pm-btn--outline pm-btn--small" onClick={() => setConfirmDiscard(true)}>
                    Discard
                </button>
                <button
                    type="button"
                    className="pm-btn pm-btn--primary pm-btn--small"
                    disabled={!canSave}
                    onClick={() => {
                        saveVariantListings(variant.id, listings);
                        setShowSaved(true);
                    }}
                >
                    Save
                </button>
            </div>

            {modal?.type === "all" && (
                <MarkupTypeModal
                    title="Markup for all"
                    submitLabel="Save"
                    onClose={() => setModal(null)}
                    onSubmit={(markup) => {
                        applyMarkup(null, markup);
                        setModal(null);
                    }}
                />
            )}

            {modal?.type === "vendor" && activeListing && activeVendor && (
                <MarkupTypeModal
                    title={`${activeVendor.name} markup`}
                    initial={activeListing.markup}
                    submitLabel={activeListing.markup ? "Update" : "Save"}
                    onClose={() => setModal(null)}
                    onSubmit={(markup) => {
                        applyMarkup(activeVendor.id, markup);
                        setModal(null);
                    }}
                />
            )}

            {modal?.type === "product" && (
                <SearchProductModal
                    mode="edit"
                    variants={variants}
                    initial={variant}
                    onClose={() => setModal(null)}
                    onContinue={(next) => {
                        setModal(null);
                        if (next.id !== variant.id) navigate(`${PRICE_MARKUP_ROUTE}/add/${next.id}`, { replace: true });
                    }}
                />
            )}

            {confirmDiscard && (
                <ConfirmDialog
                    message={
                        <>
                            Are you sure you want to <strong>discard Markup?</strong>
                        </>
                    }
                    onCancel={() => setConfirmDiscard(false)}
                    onConfirm={goBack}
                />
            )}

            {/* Stays on this page — closing the modal simply dismisses it. */}
            {showSaved && (
                <SuccessModal title="Saved" message="Markup saved successfully." onClose={() => setShowSaved(false)} />
            )}
        </div>
    );
}

export default function AddMarkupScreen() {
    const { variantId } = useParams();
    const variant = usePriceMarkupStore((state) => state.variants.find((item) => item.id === variantId));

    if (!variant) return <Navigate to={PRICE_MARKUP_ROUTE} replace />;

    // Keyed so switching product via "Edit product" resets the draft.
    return <AddMarkupForm key={variant.id} variant={variant} />;
}
