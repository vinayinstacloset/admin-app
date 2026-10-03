import { Funnel } from "lucide-react";
import { useMemo, useState } from "react";
import Dropdown from "../components/Dropdown";
import OfferTable from "../components/OfferTable";
import OfferFormModal from "../components/OfferFormModal";
import OfferTypeModal from "../components/OfferTypeModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import SuccessModal from "../components/SuccessModal";
import { OFFER_FILTER_OPTIONS } from "../constants/offerCoupon.constants";
import { offerCouponApi } from "../api";
import { useOfferCouponStore } from "../store/offerCouponStore";
import type { Offer, OfferInput } from "../types/offerCoupon.types";

type ModalState =
  | null
  | { mode: "select-type" }
  | { mode: "add"; offerType: OfferInput["offerType"] }
  | { mode: "edit"; row: Offer };

export default function OfferTab() {
  const { offers, addOffer, updateOffer, removeOffer, toggleOffer } =
    useOfferCouponStore();
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<Offer | null>(null);
  const [success, setSuccess] = useState("");

  const rows = useMemo(
    () => (filter === "all" ? offers : offers.filter((row) => row.status === filter)),
    [filter, offers],
  );

  const handleToggle = (id: string) => {
    const current = offers.find((row) => row.id === id);
    if (!current) return;
    toggleOffer(id);
    setSuccess(
      current.enabled
        ? "Offer deactivated successfully."
        : "Offer activated successfully.",
    );
  };

  const save = async (input: OfferInput) => {
    if (modal?.mode === "add") {
      addOffer(await offerCouponApi.createOffer(input));
      setModal(null);
      setSuccess("Offer added successfully.");
      return;
    }

    if (modal?.mode === "edit") {
      updateOffer(
        modal.row.id,
        await offerCouponApi.updateOffer(modal.row.id, input),
      );
      setModal(null);
      setSuccess("Offer updated successfully.");
    }
  };

  return (
    <>
      <div className="oc-toolbar">
        <h2>Offer - {offers.length}</h2>
        <div className="oc-toolbar-controls">
          <Funnel size={17} />
          <Dropdown
            value={filter}
            placeholder="All"
            options={OFFER_FILTER_OPTIONS.map((item) => ({
              value: item.value,
              label: item.label,
            }))}
            onChange={setFilter}
          />
          <button
            type="button"
            className="oc-primary oc-toolbar-button"
            onClick={() => setModal({ mode: "select-type" })}
          >
            Add Offer +
          </button>
        </div>
      </div>

      <OfferTable
        rows={rows}
        onToggle={handleToggle}
        onEdit={(row) => setModal({ mode: "edit", row })}
      />

      {modal?.mode === "select-type" && (
        <OfferTypeModal
          onClose={() => setModal(null)}
          onSelect={(offerType) => setModal({ mode: "add", offerType })}
        />
      )}

      {modal?.mode === "add" && (
        <OfferFormModal
          mode="add"
          offerType={modal.offerType}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}

      {modal?.mode === "edit" && (
        <OfferFormModal
          mode="edit"
          offerType={modal.row.offerType}
          initial={modal.row}
          onClose={() => setModal(null)}
          onSave={save}
          onDelete={() => {
            setDeleteTarget(modal.row);
            setModal(null);
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          name={`${deleteTarget.offerType === "deal" ? "Deal" : "Flash Card"} offer`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await offerCouponApi.deleteOffer(deleteTarget.id);
            removeOffer(deleteTarget.id);
            setDeleteTarget(null);
            setSuccess("Offer deleted successfully.");
          }}
        />
      )}

      {success && (
        <SuccessModal message={success} onClose={() => setSuccess("")} />
      )}
    </>
  );
}
