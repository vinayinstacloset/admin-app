import { useState } from "react";
import CouponTable from "../components/CouponTable";
import CouponFormModal from "../components/CouponFormModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import SuccessModal from "../components/SuccessModal";
import { offerCouponApi } from "../api";
import { useOfferCouponStore } from "../store/offerCouponStore";
import type { Coupon, CouponInput } from "../types/offerCoupon.types";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";
import { hoverStyle, focusStyle } from "../../../shared/utils/interactiveStyle";

export default function CouponTab() {
  const isMax900 = useMediaQuery("(max-width: 900px)");
  const isMax560 = useMediaQuery("(max-width: 560px)");
  const { coupons, addCoupon, updateCoupon, removeCoupon } =
    useOfferCouponStore();
  const [modal, setModal] = useState<
    { mode: "add" } | { mode: "edit"; row: Coupon } | null
  >(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [success, setSuccess] = useState("");
  const save = async (input: CouponInput) => {
    if (modal?.mode === "add") {
      addCoupon(await offerCouponApi.createCoupon(input));
      setModal(null);
      setSuccess("Coupon added successfully.");
    } else if (modal?.mode === "edit") {
      updateCoupon(
        modal.row.id,
        await offerCouponApi.updateCoupon(modal.row.id, input, coupons),
      );
      setModal(null);
      setSuccess("Coupon updated successfully.");
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
          Coupon - {coupons.length}
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
            onClick={() => setModal({ mode: "add" })}
          >
            Add Coupon +
          </button>
        </div>
      </div>
      <CouponTable
        rows={coupons}
        onEdit={(row) => setModal({ mode: "edit", row })}
      />
      {modal && (
        <CouponFormModal
          mode={modal.mode}
          initial={modal.mode === "edit" ? modal.row : undefined}
          onClose={() => setModal(null)}
          onSave={save}
          onDelete={
            modal.mode === "edit"
              ? () => {
                  setDeleteTarget(modal.row);
                  setModal(null);
                }
              : undefined
          }
        />
      )}
      {deleteTarget && (
        <ConfirmDeleteModal
          name={deleteTarget.title}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await offerCouponApi.deleteCoupon(deleteTarget.id);
            removeCoupon(deleteTarget.id);
            setDeleteTarget(null);
            setSuccess("Coupon deleted successfully.");
          }}
        />
      )}
      {success && (
        <SuccessModal message={success} onClose={() => setSuccess("")} />
      )}
    </>
  );
}
