import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import type { CSSProperties } from "react";
import MarketplaceFormModal from "../components/MarketplaceFormModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import SuccessModal from "../components/SuccessModal";
import { marketplaceApi } from "../api/marketplaceApi";
import type {
  MarketplaceCoupon,
  MarketplaceCouponInput,
} from "../types/marketplaceBonus.types";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";
import { hoverStyle } from "../../../shared/utils/interactiveStyle";

export default function MarketplaceTab() {
  const isMax900 = useMediaQuery("(max-width: 900px)");
  const [rows, setRows] = useState<MarketplaceCoupon[]>(() =>
    marketplaceApi.getSnapshot(),
  );
  const [modal, setModal] = useState<
    { mode: "add" } | { mode: "edit"; row: MarketplaceCoupon } | null
  >(null);
  const [deleteTarget, setDeleteTarget] = useState<MarketplaceCoupon | null>(
    null,
  );
  const [success, setSuccess] = useState("");

  const save = async (input: MarketplaceCouponInput) => {
    if (modal?.mode === "add") {
      const created = await marketplaceApi.create(input);
      setRows((current) => [created, ...current]);
      setModal(null);
      setSuccess("Market place added successfully.");
      return;
    }
    if (modal?.mode === "edit") {
      const updated = await marketplaceApi.update(modal.row.id, input);
      setRows((current) =>
        current.map((row) =>
          row.id === updated.id
            ? { ...updated, clickRate: row.clickRate, status: row.status }
            : row,
        ),
      );
      setModal(null);
      setSuccess("Market place updated successfully.");
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "nowrap",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
          Market place coupon - {rows.length}
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={() => setModal({ mode: "add" })}
            style={addButton}
            {...hoverStyle(
              { background: "#694831" },
              { background: "#76523b" },
              true,
            )}
          >
            Add Market Place <Plus size={14} style={{ verticalAlign: -2 }} />
          </button>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 9,
          padding: 6,
          overflowX: "auto",
        }}
      >
        <div style={{ minWidth: isMax900 ? 850 : 1050 }}>
          <div
            style={{
              ...rowGrid,
              minHeight: 34,
              background: "#f0efed",
              borderRadius: "6px 6px 0 0",
              fontSize: 9,
              color: "#55504c",
            }}
          >
            {[
              "IMAGE",
              "MARKET PLACE",
              "DISCOUNT/RUPEES",
              "CODE",
              "EXPIRY DATE",
              "STATUS",
              "CLICK RATE",
              "ACTION",
            ].map((item) => (
              <span key={item} style={cell}>
                {item}
              </span>
            ))}
          </div>
          {rows.map((row) => (
            <MarketplaceRow
              key={row.id}
              row={row}
              onEdit={() => setModal({ mode: "edit", row })}
            />
          ))}
        </div>
      </div>

      {modal && (
        <MarketplaceFormModal
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
          name="market place"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await marketplaceApi.remove(deleteTarget.id);
            setRows((current) =>
              current.filter((row) => row.id !== deleteTarget.id),
            );
            setDeleteTarget(null);
            setSuccess("Market place deleted successfully.");
          }}
        />
      )}
      {success && (
        <SuccessModal message={success} onClose={() => setSuccess("")} />
      )}
    </>
  );
}

function MarketplaceRow({
  row,
  onEdit,
}: {
  row: MarketplaceCoupon;
  onEdit: () => void;
}) {
  const date = new Date(`${row.expiryDate}T00:00:00`);
  const formatted = Number.isNaN(date.getTime())
    ? row.expiryDate
    : `${date.getDate()}${date.getDate() % 10 === 1 && date.getDate() !== 11 ? "st" : date.getDate() % 10 === 2 && date.getDate() !== 12 ? "nd" : date.getDate() % 10 === 3 && date.getDate() !== 13 ? "rd" : "th"} ${date.toLocaleDateString("en-US", { month: "short" })}, ${date.getFullYear()}`;
  const expired = row.status === "expired";
  return (
    <div
      style={{
        ...rowGrid,
        minHeight: 115,
        borderBottom: "1px solid #ddd9d6",
        fontSize: 11.5,
      }}
    >
      <div style={cell}>
        <img
          src={row.imageUrl}
          alt="Marketplace coupon"
          style={{ width: 58, height: 85, objectFit: "cover" }}
        />
      </div>
      <div style={cell}>{row.marketplace}</div>
      <div style={{ ...cell, color: "#ff665e", fontWeight: 700 }}>
        {row.discountType === "discount"
          ? `${row.discountValue}%`
          : `₹${row.discountValue} off`}
      </div>
      <div style={cell}>{row.code}</div>
      <div style={cell}>{formatted}</div>
      <div style={cell}>
        <span
          style={{
            display: "inline-flex",
            padding: "5px 12px",
            borderRadius: 20,
            background: expired ? "#f3f3f3" : "#eaf8f0",
            color: expired ? "#9a9693" : "#22b65d",
            fontSize: 10,
          }}
        >
          {expired ? "Expired" : "Active"}
        </span>
      </div>
      <div style={cell}>{row.clickRate}</div>
      <div style={{ ...cell, display: "flex", alignItems: "center" }}>
        <button
          type="button"
          onClick={onEdit}
          style={{
            border: 0,
            background: "transparent",
            cursor: "pointer",
            color: "#504b47",
          }}
          aria-label="Edit marketplace"
        >
          <Pencil size={14} />
        </button>
      </div>
    </div>
  );
}

const rowGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.05fr 1.05fr 1.1fr 1.05fr 1.05fr .85fr .8fr .65fr",
  alignItems: "center",
};
const cell: CSSProperties = { padding: "0 20px", minWidth: 0 };
const addButton: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
  flexShrink: 0,
  height: 36,
  border: 0,
  borderRadius: 5,
  background: "#76523b",
  color: "#fff",
  padding: "0 14px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
  whiteSpace: "nowrap",
};
