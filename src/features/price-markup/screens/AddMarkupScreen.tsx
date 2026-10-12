import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import ConfirmDialog from "../components/common/ConfirmDialog";
import {
  AveragePriceIcon,
  RevenueIcon,
  UnitSoldIcon,
} from "../components/common/MarkupIcons";
import ProductSummary from "../components/common/ProductSummary";
import StatTile from "../components/common/StatTile";
import SuccessModal from "../components/common/SuccessModal";
import MarkupTypeModal from "../components/product/MarkupTypeModal";
import SearchProductModal from "../components/product/SearchProductModal";
import VendorListingTile from "../components/product/VendorListingTile";
import { PRICE_MARKUP_ROUTE } from "../constants/priceMarkup.constants";
import { usePriceMarkupStore } from "../store/priceMarkupStore";
import type {
  Markup,
  ProductVariant,
  VendorListing,
} from "../types/pricemarkup.types";
import { formatMoney } from "../utils/pricemarkup.utils";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";
import { hoverStyle, focusStyle } from "../../../shared/utils/interactiveStyle";

type ModalState =
  | { type: "all" }
  | { type: "vendor"; vendorId: string }
  | { type: "product" }
  | null;

interface FormProps {
  variant: ProductVariant;
}

function AddMarkupForm({ variant }: FormProps) {
  const isMax1180 = useMediaQuery("(max-width: 1180px)");
  const isMax820 = useMediaQuery("(max-width: 820px)");
  const navigate = useNavigate();
  const { setExtraCrumbs } = useDashboardOutletContext();
  const { vendors, variants, saveVariantListings } = usePriceMarkupStore();

  const [listings, setListings] = useState<VendorListing[]>(variant.listings);
  const [modal, setModal] = useState<ModalState>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setExtraCrumbs([
      { label: "Product", to: PRICE_MARKUP_ROUTE },
      { label: "Add Markup" },
    ]);
    return () => setExtraCrumbs([]);
  }, [setExtraCrumbs]);

  const isDirty = useMemo(
    () => JSON.stringify(listings) !== JSON.stringify(variant.listings),
    [listings, variant.listings],
  );
  const canSave = isDirty && listings.some((listing) => listing.markup);
  const goBack = () => navigate(PRICE_MARKUP_ROUTE);

  const applyMarkup = (vendorId: string | null, markup: Markup) =>
    setListings((current) =>
      current.map((listing) =>
        vendorId === null || listing.vendorId === vendorId
          ? { ...listing, markup }
          : listing,
      ),
    );

  const activeListing =
    modal?.type === "vendor"
      ? listings.find((listing) => listing.vendorId === modal.vendorId)
      : undefined;
  const activeVendor = activeListing
    ? vendors.find((vendor) => vendor.id === activeListing.vendorId)
    : undefined;

  return (
    <div
      style={{
        fontFamily: "inherit",
        color: "#1f1a17",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        paddingBottom: 24,
      }}
    >
      <section
        style={{ overflow: "hidden", borderRadius: 12, background: "#fff" }}
      >
        <div
          style={{
            ...{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              padding: 24,
              borderBottom: "3px solid #ececea",
            },
            ...(isMax820
              ? { flexDirection: "column", alignItems: "stretch" }
              : {}),
          }}
        >
          <ProductSummary
            variant={variant}
            onEdit={() => setModal({ type: "product" })}
          />

          <div
            style={{
              ...{
                display: "grid",
                gridTemplateColumns: "repeat(3, 145px)",
                gap: 15,
                height: 75,
              },
              ...(isMax820
                ? {
                    gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                  }
                : {}),
            }}
          >
            <StatTile
              tone="purple"
              label="AVERAGE PRICE"
              value={formatMoney(variant.averagePrice)}
              icon={<AveragePriceIcon />}
            />
            <StatTile
              tone="orange"
              label="UNIT SOLD"
              value={variant.unitSold}
              icon={<UnitSoldIcon />}
            />
            <StatTile
              tone="green"
              label="REVENUE"
              value={formatMoney(variant.revenue)}
              icon={<RevenueIcon />}
            />
          </div>
        </div>

        <div style={{ padding: "22px 24px 26px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>
              Vendors - {listings.length}
            </h3>
            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid transparent",
                fontWeight: 600,
                transition:
                  "background 0.15s, border-color 0.15s, opacity 0.15s",
                background: "#6d4c36",
                color: "#fff",
                height: 26,
                padding: "0 12px",
                fontSize: 10.5,
                borderRadius: 3,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
              {...hoverStyle(
                { background: "#5c4030" },
                { background: "#6d4c36" },
                true,
              )}
              onClick={() => setModal({ type: "all" })}
            >
              Markup for all
            </button>
          </div>

          <div
            style={{
              ...{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "14px 15px",
              },
              ...(isMax1180
                ? { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }
                : {}),
              ...(isMax820 ? { gridTemplateColumns: "1fr" } : {}),
            }}
          >
            {listings.map((listing) => {
              const vendor = vendors.find(
                (item) => item.id === listing.vendorId,
              );
              if (!vendor) return null;

              return (
                <VendorListingTile
                  key={listing.vendorId}
                  vendor={vendor}
                  listing={listing}
                  withColon={false}
                  actionLabel={listing.markup ? "Edit Markup" : "Add Markup"}
                  onAction={() =>
                    setModal({ type: "vendor", vendorId: listing.vendorId })
                  }
                />
              );
            })}
          </div>
        </div>
      </section>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button
          type="button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #2c2622",
            fontWeight: 600,
            transition: "background 0.15s, border-color 0.15s, opacity 0.15s",
            background: "#fff",
            color: "#2c2622",
            height: 26,
            padding: "0 12px",
            fontSize: 10.5,
            borderRadius: 3,
            fontFamily: "inherit",
            cursor: "pointer",
          }}
          {...hoverStyle({ background: "#f7f5f3" }, { background: "#fff" })}
          onClick={() => setConfirmDiscard(true)}
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
              border: "1px solid transparent",
              fontWeight: 600,
              transition: "background 0.15s, border-color 0.15s, opacity 0.15s",
              background: "#6d4c36",
              color: "#fff",
              height: 26,
              padding: "0 12px",
              fontSize: 10.5,
              borderRadius: 3,
              fontFamily: "inherit",
              cursor: "pointer",
            },
            ...(!canSave
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
            if (next.id !== variant.id)
              navigate(`${PRICE_MARKUP_ROUTE}/add/${next.id}`, {
                replace: true,
              });
          }}
        />
      )}

      {confirmDiscard && (
        <ConfirmDialog
          message={
            <>
              Are you sure you want to{" "}
              <strong style={{ fontWeight: 600 }}>discard Markup?</strong>
            </>
          }
          onCancel={() => setConfirmDiscard(false)}
          onConfirm={goBack}
        />
      )}

      {/* Stays on this page — closing the modal simply dismisses it. */}
      {showSaved && (
        <SuccessModal
          title="Saved"
          message="Markup saved successfully."
          onClose={() => setShowSaved(false)}
        />
      )}
    </div>
  );
}

export default function AddMarkupScreen() {
  const { variantId } = useParams();
  const variant = usePriceMarkupStore((state) =>
    state.variants.find((item) => item.id === variantId),
  );

  if (!variant) return <Navigate to={PRICE_MARKUP_ROUTE} replace />;

  // Keyed so switching product via "Edit product" resets the draft.
  return <AddMarkupForm key={variant.id} variant={variant} />;
}
