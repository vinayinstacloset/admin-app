import { BadgePercent, Ribbon, X } from "lucide-react";
import type { OfferInput } from "../types/offerCoupon.types";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";
import { hoverStyle, focusStyle } from "../../../shared/utils/interactiveStyle";

interface Props {
  onClose: () => void;
  onSelect: (type: OfferInput["offerType"]) => void;
}

export default function OfferTypeModal({ onClose, onSelect }: Props) {
  const isMax700 = useMediaQuery("(max-width: 700px)");
  const isMax560 = useMediaQuery("(max-width: 560px)");
  return (
    <div
      style={{
        ...{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "rgba(0, 0, 0, 0.23)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        },
        ...(isMax560 ? { padding: 12 } : {}),
      }}
    >
      <div
        style={{
          width: "min(745px, calc(100vw - 32px))",
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          boxSizing: "border-box",
          boxShadow: "0 15px 45px rgba(0, 0, 0, 0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 26,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
            Select type
          </h3>
          <button
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              border: 0,
              cursor: "pointer",
              background: "transparent",
              color: "#777",
              width: 30,
              height: 30,
              fontFamily: "inherit",
            }}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        <div
          style={{ height: 1, background: "#d8d5d2", margin: "12px 0 19px" }}
        />
        <div
          style={{
            ...{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
            ...(isMax700 ? { gridTemplateColumns: "1fr" } : {}),
          }}
        >
          <button
            type="button"
            style={{
              ...{
                minHeight: 225,
                border: "1px solid #cfcac6",
                borderRadius: 8,
                background: "#fff",
                color: "#262321",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 26,
                cursor: "pointer",
                transition:
                  "border-color .15s ease, box-shadow .15s ease, transform .15s ease",
                fontFamily: "inherit",
              },
              ...(isMax700 ? { minHeight: 170 } : {}),
            }}
            {...hoverStyle(
              {
                borderColor: "#8d634c",
                boxShadow: "0 5px 18px rgba(0,0,0,.08)",
                transform: "translateY(-1px)",
              },
              { borderColor: "", boxShadow: "", transform: "" },
            )}
            onClick={() => onSelect("flash-card")}
          >
            <Ribbon size={48} strokeWidth={1.6} style={{ color: "#f3a51a" }} />
            <span style={{ fontSize: 18, fontWeight: 400 }}>
              FLASH CARD <b style={{ fontWeight: 500, marginLeft: 7 }}>→</b>
            </span>
          </button>
          <button
            type="button"
            style={{
              ...{
                minHeight: 225,
                border: "1px solid #cfcac6",
                borderRadius: 8,
                background: "#fff",
                color: "#262321",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 26,
                cursor: "pointer",
                transition:
                  "border-color .15s ease, box-shadow .15s ease, transform .15s ease",
                fontFamily: "inherit",
              },
              ...(isMax700 ? { minHeight: 170 } : {}),
            }}
            {...hoverStyle(
              {
                borderColor: "#8d634c",
                boxShadow: "0 5px 18px rgba(0,0,0,.08)",
                transform: "translateY(-1px)",
              },
              { borderColor: "", boxShadow: "", transform: "" },
            )}
            onClick={() => onSelect("deal")}
          >
            <BadgePercent
              size={48}
              strokeWidth={1.6}
              style={{ color: "#f15d91" }}
            />
            <span style={{ fontSize: 18, fontWeight: 400 }}>
              DEAL <b style={{ fontWeight: 500, marginLeft: 7 }}>→</b>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
