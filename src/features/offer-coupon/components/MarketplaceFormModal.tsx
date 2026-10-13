import { CalendarDays, ImageUp, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Dropdown from "./Dropdown";
import { MARKETPLACE_OPTIONS } from "../data/marketplaceData";
import type {
  MarketplaceCoupon,
  MarketplaceCouponInput,
} from "../types/marketplaceBonus.types";

interface Props {
  mode: "add" | "edit";
  initial?: MarketplaceCoupon;
  onClose: () => void;
  onSave: (input: MarketplaceCouponInput) => void;
  onDelete?: () => void;
}

const initialForm: MarketplaceCouponInput = {
  imageUrl: "",
  marketplace: "",
  code: "",
  expiryDate: "",
  discountType: "",
  discountValue: "",
};

export default function MarketplaceFormModal({
  mode,
  initial,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [form, setForm] = useState<MarketplaceCouponInput>(
    initial
      ? {
          imageUrl: initial.imageUrl,
          marketplace: initial.marketplace,
          code: initial.code,
          expiryDate: initial.expiryDate,
          discountType: initial.discountType,
          discountValue: String(initial.discountValue),
        }
      : initialForm,
  );
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) =>
      event.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const set = <K extends keyof MarketplaceCouponInput>(
    key: K,
    value: MarketplaceCouponInput[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const upload = (file: File | undefined) => {
    if (!file) return;
    if (!/^image\/(png|jpeg|jpg|svg\+xml)$/.test(file.type)) {
      setError("Only PNG, JPG and SVG formats are supported.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError("Image size must be 3MB or less.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set("imageUrl", String(reader.result));
    reader.readAsDataURL(file);
    setError("");
  };

  const submit = () => {
    if (!form.imageUrl) return setError("Image is required.");
    if (!form.marketplace) return setError("Market place is required.");
    if (!form.code.trim()) return setError("Code is required.");
    if (!form.expiryDate) return setError("Expiry date is required.");
    if (!form.discountType) return setError("Select discount or rupees off.");
    if (!form.discountValue || Number(form.discountValue) <= 0)
      return setError("Enter a valid discount or rupees value.");
    setError("");
    onSave(form);
  };

  const title = mode === "add" ? "Add market place" : "Edit market place";
  const valueLabel =
    form.discountType === "discount" ? "Discount percentage" : "Rupees off";

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={header}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{title}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {mode === "edit" && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                aria-label="Delete market place"
                style={iconButton}
              >
                <Trash2 size={18} color="#ef7779" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={iconButton}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <div style={uploadBox} onClick={() => inputRef.current?.click()}>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml"
            hidden
            onChange={(event) => upload(event.target.files?.[0])}
          />
          {form.imageUrl ? (
            <div style={uploadedImageContent}>
              <div style={uploadedImageWrap}>
                <img
                  src={form.imageUrl}
                  alt="Marketplace"
                  style={uploadedImage}
                />
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    set("imageUrl", "");
                  }}
                  style={removeImage}
                >
                  <X size={13} />
                </button>
              </div>
              <span style={uploadHint}>
                Only PNG, JPG and SVG formats are supported (Max 3MB)
              </span>
            </div>
          ) : (
            <div style={uploadPlaceholder}>
              <ImageUp size={24} color="#8b6c55" />
              <div style={{ fontSize: 11, color: "#76523b", marginTop: 7 }}>
                Upload image
              </div>
              <div style={{ fontSize: 10, color: "#514b47", marginTop: 5 }}>
                Image ratio: (Width: 412 px, Height: 412 px)
              </div>
              <div style={{ fontSize: 9, color: "#6f6965", marginTop: 2 }}>
                Only PNG, JPG and SVG formats are supported (Max 3MB)
              </div>
            </div>
          )}
        </div>

        <label style={label}>Market place</label>
        <Dropdown
          value={form.marketplace}
          placeholder="Select market place"
          options={MARKETPLACE_OPTIONS.map((item) => ({ ...item }))}
          onChange={(value) => set("marketplace", value)}
        />

        <label style={label}>Code</label>
        <div style={{ position: "relative" }}>
          <input
            value={form.code}
            onChange={(event) => set("code", event.target.value)}
            placeholder="Enter code"
            style={field}
          />
          {form.code && (
            <button
              type="button"
              onClick={() => set("code", "")}
              style={{
                ...clearButton,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        <label style={label}>Expiry date</label>
        <div style={{ position: "relative" }}>
          <input
            type="date"
            value={form.expiryDate}
            onChange={(event) => set("expiryDate", event.target.value)}
            style={{ ...field, paddingRight: 38 }}
          />
          <CalendarDays
            size={15}
            style={{
              position: "absolute",
              right: 12,
              top: 10,
              pointerEvents: "none",
            }}
          />
        </div>

        <div
          style={{ borderTop: "1px solid #ddd6d0", margin: "18px 0 16px" }}
        />
        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 12 }}>
          Select discount or rupees off
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <Choice
            active={form.discountType === "discount"}
            onClick={() => set("discountType", "discount")}
            icon="%"
            label="DISCOUNT"
          />
          <Choice
            active={form.discountType === "rupees"}
            onClick={() => set("discountType", "rupees")}
            icon="₹"
            label="RUPEES"
          />
        </div>

        <label style={label}>{valueLabel}</label>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            inputMode="decimal"
            disabled={!form.discountType}
            value={form.discountValue}
            onChange={(event) =>
              set("discountValue", event.target.value.replace(/[^0-9.]/g, ""))
            }
            style={{
              ...field,
              paddingLeft: form.discountType === "discount" ? 28 : 28,
            }}
          />
          <span
            style={{ position: "absolute", left: 12, top: 9, fontSize: 12 }}
          >
            {form.discountType === "discount" ? "%" : "₹"}
          </span>
          {form.discountValue && (
            <button
              type="button"
              onClick={() => set("discountValue", "")}
              style={{
                ...clearButton,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {error && (
          <div style={{ color: "#d65f63", fontSize: 10, marginTop: 8 }}>
            {error}
          </div>
        )}
        <div
          style={{
            marginTop: 17,
            display: "grid",
            gridTemplateColumns: mode === "edit" ? "1fr 1fr" : "1fr",
            gap: 10,
          }}
        >
          {mode === "edit" && (
            <button type="button" onClick={onClose} style={secondaryButton}>
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={
              !form.imageUrl ||
              !form.marketplace ||
              !form.code.trim() ||
              !form.expiryDate ||
              !form.discountType ||
              !form.discountValue
            }
            style={{
              ...primaryButton,
              ...(!form.imageUrl ||
              !form.marketplace ||
              !form.code.trim() ||
              !form.expiryDate ||
              !form.discountType ||
              !form.discountValue
                ? {
                    background: "#d8d8d8",
                    color: "#aaa",
                    cursor: "not-allowed",
                  }
                : {}),
            }}
          >
            {mode === "add" ? "Add market place" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Choice({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 92,
        borderRadius: 8,
        border: `1px solid ${active ? "#76523b" : "#d2ceca"}`,
        background: active ? "#f8f5f2" : "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      <span
        style={{
          width: 29,
          height: 29,
          borderRadius: 7,
          background: label === "DISCOUNT" ? "#ef5c4d" : "#66b84a",
          color: "#fff",
          fontWeight: 800,
          display: "grid",
          placeItems: "center",
          fontSize: 18,
        }}
      >
        {icon}
      </span>
      <span style={{ fontSize: 11, color: "#5e5853" }}>
        <span
          style={{
            display: "inline-block",
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: `2px solid ${active ? "#76523b" : "#999"}`,
            verticalAlign: "-2px",
            marginRight: 7,
            boxSizing: "border-box",
            background: active
              ? "radial-gradient(circle, #76523b 0 4px, transparent 5px)"
              : "transparent",
          }}
        />
        {label}
      </span>
    </button>
  );
}

const overlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 100,
  background: "rgba(0,0,0,.23)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};
const modal: CSSProperties = {
  width: "min(405px, calc(100vw - 24px))",
  maxHeight: "calc(100vh - 30px)",
  overflow: "auto",
  background: "#fff",
  borderRadius: 12,
  padding: "18px 20px 20px",
  boxSizing: "border-box",
  boxShadow: "0 15px 45px rgba(0,0,0,.18)",
};
const header: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingBottom: 12,
  borderBottom: "1px solid #ddd8d4",
};
const iconButton: CSSProperties = {
  border: 0,
  background: "transparent",
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
  padding: 3,
  fontFamily: "inherit",
};
const uploadBox: CSSProperties = {
  height: 160,
  marginTop: 18,
  border: "2px dashed #b7a394",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  position: "relative",
  borderRadius: 2,
  boxSizing: "border-box",
};
const uploadPlaceholder: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  boxSizing: "border-box",
};
const uploadedImageContent: CSSProperties = {
  width: "100%",
  height: "100%",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
};
const uploadedImageWrap: CSSProperties = {
  position: "relative",
  width: 100,
  height: 100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};
const uploadedImage: CSSProperties = {
  width: 100,
  height: 100,
  objectFit: "cover",
  display: "block",
};
const uploadHint: CSSProperties = {
  display: "block",
  textAlign: "center",
  fontSize: 8,
  lineHeight: "11px",
  color: "#777",
};
const removeImage: CSSProperties = {
  position: "absolute",
  right: -9,
  top: -7,
  border: "1px solid #ddd",
  background: "#fff",
  borderRadius: "50%",
  width: 19,
  height: 19,
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  padding: 0,
  color: "#999",
};
const label: CSSProperties = {
  display: "block",
  margin: "15px 0 7px",
  fontSize: 11,
  fontWeight: 600,
  color: "#514b47",
};
const field: CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  height: 36,
  border: "1px solid #aaa6a2",
  background: "#fff",
  borderRadius: 3,
  padding: "0 12px",
  outline: "none",
  color: "#2b2724",
  fontSize: 11,
  fontFamily: "inherit",
};
const clearButton: CSSProperties = {
  position: "absolute",
  right: 8,
  top: 8,
  border: 0,
  background: "transparent",
  cursor: "pointer",
  color: "#aaa",
};
const secondaryButton: CSSProperties = {
  height: 36,
  borderRadius: 5,
  border: "1px solid #2e2a27",
  background: "#fff",
  color: "#5d5752",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
};
const primaryButton: CSSProperties = {
  height: 36,
  borderRadius: 5,
  border: "1px solid transparent",
  background: "#76523b",
  color: "#fff",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
};
