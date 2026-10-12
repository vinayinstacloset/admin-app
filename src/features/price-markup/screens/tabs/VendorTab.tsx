import { useMemo, useState } from "react";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import SuccessModal from "../../components/common/SuccessModal";
import SearchVendorModal from "../../components/vendor/SearchVendorModal";
import VendorMarkupCard from "../../components/vendor/VendorMarkupCard";
import VendorMarkupModal from "../../components/vendor/VendorMarkupModal";
import { usePriceMarkupStore } from "../../store/priceMarkupStore";
import {
  hoverStyle,
  focusStyle,
} from "../../../../shared/utils/interactiveStyle";

type ModalState =
  | { type: "search" }
  | { type: "add"; vendorId: string }
  | { type: "edit"; markupId: string }
  | { type: "delete"; markupId: string }
  | null;

// Vendor tab: no filter / search here — just the list and "Add Markup +".
export default function VendorTab() {
  const {
    vendors,
    vendorMarkups,
    addVendorMarkup,
    updateVendorMarkup,
    removeVendorMarkup,
  } = usePriceMarkupStore();
  const [modal, setModal] = useState<ModalState>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const close = () => setModal(null);

  const availableVendors = useMemo(
    () =>
      vendors.filter(
        (vendor) => !vendorMarkups.some((row) => row.vendorId === vendor.id),
      ),
    [vendors, vendorMarkups],
  );

  const findVendor = (id: string) => vendors.find((vendor) => vendor.id === id);
  const editingRow =
    modal?.type === "edit" || modal?.type === "delete"
      ? vendorMarkups.find((row) => row.id === modal.markupId)
      : undefined;
  const editingVendor = editingRow
    ? findVendor(editingRow.vendorId)
    : undefined;
  const addingVendor =
    modal?.type === "add" ? findVendor(modal.vendorId) : undefined;

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
          Markup vendor - {vendorMarkups.length}
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
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
            onClick={() => setModal({ type: "search" })}
          >
            Add Markup +
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {vendorMarkups.length === 0 && (
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
            No vendor markups yet
          </div>
        )}

        {vendorMarkups.map((row) => {
          const vendor = findVendor(row.vendorId);
          if (!vendor) return null;

          return (
            <VendorMarkupCard
              key={row.id}
              vendor={vendor}
              markup={row}
              onEdit={() => setModal({ type: "edit", markupId: row.id })}
              onDelete={() => setModal({ type: "delete", markupId: row.id })}
            />
          );
        })}
      </div>

      {modal?.type === "search" && (
        <SearchVendorModal
          vendors={availableVendors}
          onClose={close}
          onContinue={(vendorId) => setModal({ type: "add", vendorId })}
        />
      )}

      {modal?.type === "add" && addingVendor && (
        <VendorMarkupModal
          mode="add"
          vendor={addingVendor}
          onClose={close}
          onSave={(markup) => {
            addVendorMarkup(addingVendor.id, markup);
            close();
            setSuccessMessage("Vendor markup added successfully.");
          }}
        />
      )}

      {modal?.type === "edit" && editingRow && editingVendor && (
        <VendorMarkupModal
          mode="edit"
          vendor={editingVendor}
          initial={editingRow.markup}
          onClose={close}
          onSave={(markup) => {
            updateVendorMarkup(editingRow.id, markup);
            close();
            setSuccessMessage("Vendor markup updated successfully.");
          }}
        />
      )}

      {modal?.type === "delete" && editingVendor && editingRow && (
        <ConfirmDialog
          message={
            <>
              Are you sure you want to{" "}
              <strong style={{ fontWeight: 600 }}>
                delete markup “{editingVendor.name}”?
              </strong>
            </>
          }
          onCancel={close}
          onConfirm={() => {
            removeVendorMarkup(editingRow.id);
            close();
            setSuccessMessage("Vendor markup deleted successfully.");
          }}
        />
      )}

      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </>
  );
}
