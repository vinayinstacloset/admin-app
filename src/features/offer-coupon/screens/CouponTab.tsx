import { useState } from "react";
import CouponTable from "../components/CouponTable";
import CouponFormModal from "../components/CouponFormModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import SuccessModal from "../components/SuccessModal";
import { offerCouponApi } from "../api";
import { useOfferCouponStore } from "../store/offerCouponStore";
import type { Coupon, CouponInput } from "../types/offerCoupon.types";

export default function CouponTab() {
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
      <div className="oc-toolbar">
        <h2>Coupon - {coupons.length}</h2>
        <div className="oc-toolbar-controls">
          <button
            type="button"
            className="oc-primary oc-toolbar-button"
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
