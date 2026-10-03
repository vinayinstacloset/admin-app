import { CalendarDays, Trash2, X } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import type { Coupon, CouponInput } from "../types/offerCoupon.types";
import { couponSchema } from "../validation/offerCoupon.schema";

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
    <div className="oc-overlay">
      <div className="oc-coupon-modal">
        <div className="oc-modal-header">
          <h3>{mode === "add" ? "Add coupon" : "Edit coupon"}</h3>
          <div className="oc-modal-header-actions">
            {mode === "edit" && onDelete ? (
              <button
                type="button"
                className="oc-delete-icon"
                onClick={onDelete}
                aria-label="Delete coupon"
              >
                <Trash2 size={17} />
              </button>
            ) : null}
            {mode === "add" ? (
              <button
                type="button"
                className="oc-close-button"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            ) : null}
          </div>
        </div>
        <div className="oc-divider" />
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
          <div className="oc-discount-field">
            <span>%</span>
            <input
              value={form.discount}
              inputMode="decimal"
              placeholder="Enter discount"
              onChange={(e) =>
                set("discount", e.target.value.replace(/[^0-9.]/g, ""))
              }
            />
          </div>
        </CouponField>
        {error && <div className="oc-form-error">{error}</div>}
        <div className="oc-modal-actions coupon-actions">
          {mode === "edit" && (
            <button type="button" className="oc-secondary" onClick={onClose}>
              Cancel
            </button>
          )}
          <button
            type="button"
            className="oc-primary"
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
    <label className="oc-field-group oc-coupon-field">
      <span>{label}</span>
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
    <div className="oc-input-with-clear">
      <input
        className="oc-field"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" onClick={() => onChange("")}>
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
    <div className="oc-date-field">
      <input
        className="oc-field oc-date-display"
        value={value ? formatDisplayDate(value) : ""}
        placeholder="Select date"
        readOnly
        onClick={() => ref.current?.showPicker?.()}
      />
      <input
        ref={ref}
        className="oc-native-date"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="oc-date-icon-button"
        onClick={() => ref.current?.showPicker?.()}
        aria-label="Select date"
      >
        <CalendarDays size={15} />
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
