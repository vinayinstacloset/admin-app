import { CalendarDays, Trash2, X } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import type { Coupon, CouponInput } from "../types/offerCoupon.types";
import { couponSchema } from "../validation/offerCoupon.schema";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";
import { hoverStyle, focusStyle } from "../../../shared/utils/interactiveStyle";

interface Props {
  mode: "add" | "edit";
  initial?: Coupon;
  onClose: () => void;
  onSave: (input: CouponInput) => void;
  onDelete?: () => void;
}
const empty: CouponInput = {
  title: "",
  code: "",
  expiryDate: "",
  discount: "",
};

export default function CouponFormModal({
  mode,
  initial,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const isMax560 = useMediaQuery("(max-width: 560px)");
  const [form, setForm] = useState<CouponInput>(
    initial
      ? {
          title: initial.title,
          code: initial.code,
          expiryDate: initial.expiryDate,
          discount: String(initial.discount),
        }
      : empty,
  );
  const [error, setError] = useState("");
  const set = <K extends keyof CouponInput>(key: K, value: CouponInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const valid = couponSchema.safeParse(form).success;
  const submit = () => {
    const result = couponSchema.safeParse(form);
    if (!result.success) {
      setError(
        result.error.issues[0]?.message ?? "Please complete all fields.",
      );
      return;
    }
    onSave(form);
  };

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
          ...{
            background: "#fff",
            boxSizing: "border-box",
            boxShadow: "0 15px 45px rgba(0, 0, 0, 0.18)",
            width: "min(405px, calc(100vw - 32px))",
            padding: 20,
            borderRadius: 12,
          },
          ...(isMax560 ? { maxHeight: "calc(100vh - 24px)" } : {}),
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
            {mode === "add" ? "Add coupon" : "Edit coupon"}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {mode === "edit" && onDelete ? (
              <button
                type="button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: 0,
                  cursor: "pointer",
                  width: 32,
                  height: 32,
                  borderRadius: 4,
                  background: "#fff1f1",
                  color: "#ee6f70",
                  fontFamily: "inherit",
                }}
                onClick={onDelete}
                aria-label="Delete coupon"
              >
                <Trash2 size={17} />
              </button>
            ) : null}
            {mode === "add" ? (
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
            ) : null}
          </div>
        </div>
        <div
          style={{ height: 1, background: "#d8d5d2", margin: "12px 0 19px" }}
        />
        <CouponField label="Title">
          <ClearableInput
            value={form.title}
            placeholder="Enter title"
            onChange={(v) => set("title", v)}
          />
        </CouponField>
        <CouponField label="Code">
          <ClearableInput
            value={form.code}
            placeholder="Enter code"
            onChange={(v) => set("code", v)}
          />
        </CouponField>
        <CouponField label="Expiry date">
          <DateField
            value={form.expiryDate}
            onChange={(v) => set("expiryDate", v)}
          />
        </CouponField>
        <CouponField label="Discount percentage">
          <div
            style={{
              alignItems: "center",
              borderRadius: 5,
              height: 36,
              boxSizing: "border-box",
              border: "1px solid #a9a6a3",
              background: "#fff",
            }}
          >
            <span style={{ padding: "0 10px", color: "#55504f", fontSize: 12 }}>
              %
            </span>
            <input
              style={{
                height: "100%",
                flex: 1,
                border: 0,
                outline: 0,
                fontStyle: "inherit",
                fontVariant: "inherit",
                fontWeight: "inherit",
                lineHeight: "inherit",
                fontFamily: "inherit",
                fontSize: 12,
              }}
              value={form.discount}
              inputMode="decimal"
              placeholder="Enter discount"
              onChange={(e) =>
                set("discount", e.target.value.replace(/[^0-9.]/g, ""))
              }
            />
          </div>
        </CouponField>
        {error && (
          <div
            style={{
              marginTop: 10,
              padding: "8px 10px",
              background: "#fff0f0",
              color: "#d95e62",
              borderRadius: 4,
              fontSize: 10,
            }}
          >
            {error}
          </div>
        )}
        <div
          style={{
            ...{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 4,
            },
            ...(isMax560 ? { flexWrap: "wrap" } : {}),
          }}
        >
          {mode === "edit" && (
            <button
              type="button"
              style={{
                height: 38,
                padding: "0 18px",
                borderRadius: 5,
                border: "1px solid #2e2a27",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                background: "#fff",
                color: "#5d5752",
                fontFamily: "inherit",
                minWidth: 96,
                flex: 1,
              }}
              {...hoverStyle({ background: "#f6f4f2" }, { background: "#fff" })}
              onClick={onClose}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            style={{
              ...{
                height: 38,
                padding: "0 18px",
                borderRadius: 5,
                border: "1px solid transparent",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                background: "#76523b",
                color: "#fff",
                fontFamily: "inherit",
                minWidth: 96,
                width: "100%",
              },
              ...(mode === "edit" ? { width: "auto", flex: 1 } : {}),
              ...(isMax560 ? { flex: 1 } : {}),
              ...(!valid
                ? {
                    background: "#d8d8d8",
                    color: "#aaa",
                    cursor: "not-allowed",
                  }
                : {}),
            }}
            {...hoverStyle(
              { background: "#694831" },
              { background: "#76523b" },
              true,
            )}
            disabled={!valid}
            onClick={submit}
          >
            {mode === "add" ? "Save" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CouponField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 7,
        minWidth: 0,
        marginBottom: 18,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 700, color: "#625d58" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function ClearableInput({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div style={{ position: "relative" }}>
      <input
        style={{
          boxSizing: "border-box",
          width: "100%",
          height: 36,
          border: "1px solid #a9a6a3",
          background: "#fff",
          borderRadius: 5,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 12,
          outline: "none",
          color: "#2b2724",
          fontSize: 12,
          fontFamily: "inherit",
          paddingRight: 32,
        }}
        {...focusStyle({ borderColor: "#76523b" }, { borderColor: "" })}
        value={value}
        data-placeholder="oc"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          style={{
            fontFamily: "inherit",
            position: "absolute",
            right: 7,
            top: "50%",
            transform: "translateY(-50%)",
            border: 0,
            background: "transparent",
            color: "#b0aca8",
            padding: 3,
            cursor: "pointer",
          }}
          type="button"
          onClick={() => onChange("")}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

function DateField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div style={{ position: "relative" }}>
      <input
        style={{
          boxSizing: "border-box",
          width: "100%",
          height: 36,
          border: "1px solid #a9a6a3",
          background: "#fff",
          borderRadius: 5,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 12,
          outline: "none",
          color: "#2b2724",
          fontSize: 12,
          cursor: "pointer",
          fontFamily: "inherit",
          paddingRight: 42,
        }}
        {...focusStyle({ borderColor: "#76523b" }, { borderColor: "" })}
        value={value ? formatDisplayDate(value) : ""}
        data-placeholder="oc"
        placeholder="Select date"
        readOnly
        onClick={() => ref.current?.showPicker?.()}
      />
      <input
        ref={ref}
        style={{
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          pointerEvents: "none",
          fontFamily: "inherit",
          colorScheme: "light",
          position: "absolute",
        }}
        type="date"
        data-native-date="oc"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        style={{
          position: "absolute",
          right: 7,
          top: "50%",
          transform: "translateY(-50%)",
          width: 25,
          height: 25,
          border: 0,
          background: "transparent",
          color: "#403a36",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
        onClick={() => ref.current?.showPicker?.()}
        aria-label="Select date"
      >
        <CalendarDays
          size={15}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "#403a36",
          }}
        />
      </button>
    </div>
  );
}

function formatDisplayDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  const day = date.getDate();
  const suffix =
    day % 100 >= 11 && day % 100 <= 13
      ? "th"
      : day % 10 === 1
        ? "st"
        : day % 10 === 2
          ? "nd"
          : day % 10 === 3
            ? "rd"
            : "th";
  return `${day}${suffix} ${new Intl.DateTimeFormat("en-GB", { month: "short" }).format(date)}, ${date.getFullYear()}`;
}
