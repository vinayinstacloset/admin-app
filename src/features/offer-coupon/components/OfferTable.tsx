import { useState } from "react";
import { Pencil, X } from "lucide-react";
import type { Offer } from "../types/offerCoupon.types";
import { formatDateRange, formatNumber } from "../utils/offerCoupon.utils";

interface Props {
  rows: Offer[];
  onEdit: (row: Offer) => void;
  onToggle: (id: string) => void;
}

export default function OfferTable({
  rows,
  onEdit,
  onToggle,
}: Props) {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const handleToggleClick = (row: Offer) => {
    if (row.enabled) {
      setSelectedOffer(row);
      return;
    }

    onToggle(row.id);
  };

  const handleConfirmDeactivate = () => {
    if (!selectedOffer) return;

    onToggle(selectedOffer.id);
    setSelectedOffer(null);
  };

  return (
    <>
      <div className="oc-table-card">
        <div className="oc-table oc-offer-table">
          <div className="oc-thead">
            <span>OFFER IMAGE</span>
            <span>PLACEMENT</span>
            <span>GENDER</span>
            <span>START &amp; END DATE</span>
            <span>STATUS</span>
            <span>DISCOUNT</span>
            <span>CLICK RATE</span>
            <span>ACTION</span>
          </div>

          {rows.map((row) => (
            <div className="oc-tr" key={row.id}>
              <div>
                <img
                  className="oc-offer-thumb"
                  src={row.imageUrl}
                  alt="Offer"
                />
              </div>

              <div>{row.placement}</div>

              <div>{row.gender || "-"}</div>

              <div>
                {formatDateRange(row.startDate, row.endDate)}
              </div>

              <div>
                <span className={`oc-status ${row.status}`}>
                  {row.status === "active"
                    ? "Active"
                    : "Schedule"}
                </span>
              </div>

              <div className="oc-discount-cell">
                {row.discount === null ? "-" : `${row.discount}%`}
              </div>

              <div className="oc-click-rate">
                {row.clickRate === null
                  ? "-"
                  : formatNumber(row.clickRate)}
              </div>

              <div
                className="oc-action-cell"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "14px",
                }}
              >
                {row.status === "active" && (
                  <button
                    type="button"
                    onClick={() => handleToggleClick(row)}
                    aria-label={
                      row.enabled
                        ? "Disable offer"
                        : "Enable offer"
                    }
                    aria-pressed={row.enabled}
                    style={{
                      position: "relative",
                      width: "42px",
                      height: "24px",
                      minWidth: "42px",
                      padding: 0,
                      border: "none",
                      borderRadius: "999px",
                      backgroundColor: row.enabled
                        ? "#22C55E"
                        : "#D1D5DB",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      transition:
                        "background-color 0.2s ease, box-shadow 0.2s ease",
                      boxShadow: row.enabled
                        ? "0 1px 4px rgba(34, 197, 94, 0.35)"
                        : "inset 0 0 0 1px rgba(0, 0, 0, 0.08)",
                      outline: "none",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: "3px",
                        left: row.enabled ? "21px" : "3px",
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        backgroundColor: "#FFFFFF",
                        boxShadow:
                          "0 1px 3px rgba(0, 0, 0, 0.25)",
                        transition: "left 0.2s ease",
                      }}
                    />
                  </button>
                )}

                <button
                  type="button"
                  className="oc-edit-icon"
                  onClick={() => onEdit(row)}
                  aria-label="Edit offer"
                >
                  <Pencil size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedOffer && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setSelectedOffer(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "430px",
              backgroundColor: "#FFFFFF",
              borderRadius: "14px",
              padding: "28px",
              boxShadow:
                "0 20px 50px rgba(0, 0, 0, 0.18)",
              position: "relative",
              textAlign: "center",
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedOffer(null)}
              aria-label="Close"
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                width: "32px",
                height: "32px",
                border: "none",
                borderRadius: "50%",
                backgroundColor: "#F5F5F5",
                color: "#666666",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={17} />
            </button>

            <div
              style={{
                width: "52px",
                height: "52px",
                margin: "0 auto 16px",
                borderRadius: "50%",
                backgroundColor: "#FFF7ED",
                color: "#D97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
                fontWeight: 700,
              }}
            >
              !
            </div>

            <h3
              style={{
                margin: "0 0 10px",
                fontSize: "16px",
                fontWeight: 600,
                color: "#222222",
              }}
            >
              Deactivate Offer?
            </h3>

            <p
              style={{
                margin: "0 auto",
                maxWidth: "340px",
                fontSize: "12px",
                lineHeight: 1.6,
                color: "#6B7280",
              }}
            >
              Are you okay to deactivate this offer?
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                marginTop: "26px",
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedOffer(null)}
                style={{
                  minWidth: "110px",
                  height: "38px",
                  padding: "0 20px",
                  border: "1px solid #D6D6D6",
                  borderRadius: "7px",
                  backgroundColor: "#FFFFFF",
                  color: "#444444",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDeactivate}
                style={{
                  minWidth: "140px",
                  height: "38px",
                  padding: "0 20px",
                  border: "none",
                  borderRadius: "7px",
                  backgroundColor: "#6D4D37",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}