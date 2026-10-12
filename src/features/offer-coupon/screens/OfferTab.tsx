import { Funnel } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Dropdown from "../components/Dropdown";
import OfferTable from "../components/OfferTable";
import OfferFormModal from "../components/OfferFormModal";
import OfferTypeModal from "../components/OfferTypeModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import SuccessModal from "../components/SuccessModal";
import { OFFER_FILTER_OPTIONS } from "../constants/offerCoupon.constants";
import { offerCouponApi } from "../api";
import { useOfferCouponStore } from "../store/offerCouponStore";
import { getOfferStatus } from "../utils/offerCoupon.utils";
import type {
  Offer,
  OfferInput,
  OfferFilter,
} from "../types/offerCoupon.types";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";
import { hoverStyle, focusStyle } from "../../../shared/utils/interactiveStyle";

type ModalState =
  | null
  | { mode: "select-type" }
  | { mode: "add"; offerType: OfferInput["offerType"] }
  | { mode: "edit"; row: Offer };

const getEmptyMessage = (filter: OfferFilter) => {
  if (filter === "active") return "No active offers found";
  if (filter === "scheduled") return "No scheduled offers found";
  if (filter === "expired") return "No expired offers found";
  return "No offers found";
};

export default function OfferTab() {
  const isMax900 = useMediaQuery("(max-width: 900px)");
  const isMax560 = useMediaQuery("(max-width: 560px)");
  const { offers, addOffer, updateOffer, removeOffer } = useOfferCouponStore();
  const [filter, setFilter] = useState<OfferFilter>("all");
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<Offer | null>(null);
  const [success, setSuccess] = useState("");
  const [dateTick, setDateTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setDateTick((value) => value + 1),
      60_000,
    );
    return () => window.clearInterval(timer);
  }, []);

  const rows = useMemo(() => {
    const withCurrentStatus = offers.map((row) => ({
      ...row,
      status: getOfferStatus(row.startDate, row.endDate),
      enabled: getOfferStatus(row.startDate, row.endDate) === "active",
    }));

    return filter === "all"
      ? withCurrentStatus
      : withCurrentStatus.filter((row) => row.status === filter);
  }, [dateTick, filter, offers]);

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
      <div
        style={{
          ...{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 2,
          },
          ...(isMax900 ? { alignItems: "flex-start" } : {}),
        }}
      >
        <h2
          style={{
            ...{ margin: 0, fontSize: 16, fontWeight: 700 },
            ...(isMax560 ? { fontSize: 14 } : {}),
          }}
        >
          Offer - {offers.length}
        </h2>
        <div
          style={{
            ...{ display: "flex", alignItems: "center", gap: 11 },
            ...(isMax900 ? { width: "100%", justifyContent: "flex-end" } : {}),
            ...(isMax560
              ? {
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                  width: "auto",
                }
              : {}),
          }}
        >
          <Funnel size={17} />
          <Dropdown
            value={filter}
            placeholder="All"
            options={OFFER_FILTER_OPTIONS.map((item) => ({
              value: item.value,
              label: item.label,
            }))}
            onChange={(value) => setFilter(value as OfferFilter)}
          />
          <button
            type="button"
            style={{
              borderRadius: 5,
              border: "1px solid transparent",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              background: "#76523b",
              color: "#fff",
              height: 36,
              padding: "0 16px",
              fontFamily: "inherit",
            }}
            {...hoverStyle(
              { background: "#694831" },
              { background: "#76523b" },
              true,
            )}
            onClick={() => setModal({ mode: "select-type" })}
          >
            Add Offer +
          </button>
        </div>
      </div>

      <OfferTable
        rows={rows}
        emptyMessage={getEmptyMessage(filter)}
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
