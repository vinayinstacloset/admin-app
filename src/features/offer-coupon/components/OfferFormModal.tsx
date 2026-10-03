import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CalendarDays, Trash2, Upload, X, BadgePercent, Ribbon } from "lucide-react";
import Dropdown from "./Dropdown";
import {
  CATEGORY_NAVIGATION_OPTIONS,
  CATEGORY_OPTIONS,
  GENDER_OPTIONS,
  PLACEMENT_OPTIONS,
  PRODUCT_CATEGORY_OPTIONS,
  SUB_CATEGORY_OPTIONS,
} from "../constants/offerCoupon.constants";
import { isImageFileSupported } from "../utils/offerCoupon.utils";
import type { Offer, OfferInput } from "../types/offerCoupon.types";

interface Props {
  mode: "add" | "edit";
  initial?: Offer;
  offerType: OfferInput["offerType"];
  onClose: () => void;
  onSave: (input: OfferInput) => void;
  onDelete?: () => void;
}

const createEmptyForm = (offerType: OfferInput["offerType"]): OfferInput => ({
  offerType,
  imageUrl: "",
  discount: "",
  placement: "",
  startDate: "",
  endDate: "",
  gender: "",
  categoryNavigation: "",
  productCategory: "",
  category: "",
  subCategory: "",
  status: "active",
});

export default function OfferFormModal({
  mode,
  initial,
  offerType,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [form, setForm] = useState<OfferInput>(
    initial
      ? {
          offerType: initial.offerType,
          imageUrl: initial.imageUrl,
          discount:
            initial.discount === null ? "" : String(initial.discount),
          placement: initial.placement,
          startDate: initial.startDate,
          endDate: initial.endDate,
          gender: initial.gender,
          categoryNavigation: initial.categoryNavigation,
          productCategory: initial.productCategory,
          category: initial.category,
          subCategory: initial.subCategory,
          status: initial.status,
        }
      : createEmptyForm(offerType),
  );

  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const imageObjectRef = useRef<string | null>(null);

  const categoryNavigationOptions = useMemo(
    () => (form.gender ? (CATEGORY_NAVIGATION_OPTIONS[form.gender] ?? []) : []),
    [form.gender],
  );

  const categoryOptions = useMemo(
    () =>
      form.productCategory
        ? (CATEGORY_OPTIONS[form.productCategory] ?? [])
        : [],
    [form.productCategory],
  );

  const subCategoryOptions = useMemo(
    () =>
      form.category
        ? (SUB_CATEGORY_OPTIONS[form.category] ?? [
            "Casual",
            "Regular",
            "Premium",
          ])
        : [],
    [form.category],
  );

  useEffect(
    () => () => {
      if (imageObjectRef.current) URL.revokeObjectURL(imageObjectRef.current);
    },
    [],
  );

  const set = <K extends keyof OfferInput>(
    key: K,
    value: OfferInput[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    if (!isImageFileSupported(file)) {
      setError("Please upload PNG, JPG or SVG image up to 3MB.");
      return;
    }

    if (imageObjectRef.current) URL.revokeObjectURL(imageObjectRef.current);
    imageObjectRef.current = URL.createObjectURL(file);
    set("imageUrl", imageObjectRef.current);
    setError("");
  };

  const validate = () => {
    if (
      !form.imageUrl ||
      !form.placement ||
      !form.startDate ||
      !form.endDate ||
      !form.gender ||
      !form.productCategory ||
      !form.category ||
      !form.subCategory
    ) {
      return "Please complete all required fields.";
    }

    if (form.endDate < form.startDate) {
      return "End date must be on or after start date.";
    }

    if (form.offerType === "deal" && form.discount === "") {
      return "Discount percentage is required for a deal.";
    }

    if (
      form.discount !== "" &&
      (Number.isNaN(Number(form.discount)) ||
        Number(form.discount) <= 0 ||
        Number(form.discount) > 100)
    ) {
      return "Discount must be between 1% and 100%.";
    }

    return "";
  };

  const submit = () => {
    const message = validate();
    if (message) {
      setError(message);
      return;
    }
    onSave(form);
  };

  const isFlashCard = form.offerType === "flash-card";
  const title = `${mode === "add" ? "Add" : "Edit"} ${
    isFlashCard ? "Flash Card" : "Deal"
  } Offer`;

  return (
    <div className="oc-overlay">
      <div className="oc-offer-modal">
        <div className="oc-modal-header">
          <div className="oc-offer-title">
            {isFlashCard ? <Ribbon size={19} /> : <BadgePercent size={19} />}
            <h3>{title}</h3>
          </div>
          <div className="oc-modal-header-actions">
            {mode === "edit" && onDelete ? (
              <button
                type="button"
                className="oc-delete-icon"
                onClick={onDelete}
                aria-label="Delete offer"
              >
                <Trash2 size={17} />
              </button>
            ) : null}
          </div>
        </div>

        <div className="oc-divider" />

        <div
          className={`oc-upload ${isFlashCard ? "oc-upload-flash" : "oc-upload-deal"} ${
            form.imageUrl ? "has-image" : ""
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files[0]);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {form.imageUrl ? (
            <>
              <div className="oc-image-preview-wrap">
                <img
                  src={form.imageUrl}
                  alt="Offer preview"
                  className={`oc-image-preview ${
                    isFlashCard ? "oc-image-preview-flash" : "oc-image-preview-deal"
                  }`}
                />
                <button
                  type="button"
                  className="oc-image-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    set("imageUrl", "");
                  }}
                >
                  <X size={12} />
                </button>
              </div>
              <span>Only PNG, JPG and SVG formats are supported (Max. 3MB)</span>
            </>
          ) : (
            <>
              <Upload size={22} />
              <strong>Upload image</strong>
              <span>
                Image ratio: (
                {isFlashCard
                  ? "Width: 412 px, Height: 125 px"
                  : "Width: 70 px, Height: 70 px"}
                )
              </span>
              <small>
                Only PNG, JPG and SVG formats are supported (Max. 3MB)
              </small>
            </>
          )}
        </div>

        <div className="oc-form-grid oc-two">
          <Field label="Placement">
            <Dropdown
              value={form.placement}
              placeholder="Select placement"
              options={PLACEMENT_OPTIONS.map((v) => ({ value: v, label: v }))}
              onChange={(v) => set("placement", v as OfferInput["placement"])}
            />
          </Field>

          <Field label={`Discount percentage${isFlashCard ? " (Optional)" : ""}`}>
            <div className="oc-discount-field-offer">
              <input
                className="oc-field"
                value={form.discount}
                inputMode="decimal"
                placeholder={isFlashCard ? "Enter discount percentage" : "Enter discount percentage"}
                onChange={(e) =>
                  set("discount", e.target.value.replace(/[^0-9.]/g, ""))
                }
              />
              <span>%</span>
            </div>
          </Field>

          <Field label="Start date">
            <DateField value={form.startDate} onChange={(v) => set("startDate", v)} />
          </Field>

          <Field label="End date">
            <DateField value={form.endDate} onChange={(v) => set("endDate", v)} />
          </Field>

          <Field label="Status">
            <button
              type="button"
              className={`oc-status-control ${
                form.status === "active" ? "is-active" : "is-scheduled"
              }`}
              onClick={() =>
                set("status", form.status === "active" ? "scheduled" : "active")
              }
            >
              <span className="oc-toggle oc-toggle-form"><span /></span>
              <strong>{form.status === "active" ? "Active" : "Scheduled"}</strong>
            </button>
          </Field>
        </div>

        <div className="oc-section-title">Click to navigate</div>

        <div className="oc-form-grid oc-three">
          <Field label="Gender">
            <Dropdown
              value={form.gender}
              placeholder="Select gender"
              options={GENDER_OPTIONS.map((v) => ({ value: v, label: v }))}
              onChange={(v) => {
                set("gender", v as OfferInput["gender"]);
                set("categoryNavigation", "");
              }}
            />
          </Field>

          <Field label="Category navigation">
            <Dropdown
              disabled={!categoryNavigationOptions.length}
              value={form.categoryNavigation}
              placeholder="Select category navigation"
              options={categoryNavigationOptions.map((v) => ({ value: v, label: v }))}
              onChange={(v) => set("categoryNavigation", v)}
            />
          </Field>

          <Field label="Product category">
            <Dropdown
              value={form.productCategory}
              placeholder="Select product category"
              options={PRODUCT_CATEGORY_OPTIONS.map((v) => ({ value: v, label: v }))}
              onChange={(v) => {
                set("productCategory", v);
                set("category", "");
                set("subCategory", "");
              }}
            />
          </Field>

          <Field label="Category">
            <Dropdown
              value={form.category}
              placeholder="Select category"
              options={categoryOptions.map((v) => ({ value: v, label: v }))}
              onChange={(v) => {
                set("category", v);
                set("subCategory", "");
              }}
            />
          </Field>

          <Field label="Sub-category">
            <Dropdown
              value={form.subCategory}
              placeholder="Select sub-category"
              options={subCategoryOptions.map((v) => ({ value: v, label: v }))}
              onChange={(v) => set("subCategory", v)}
            />
          </Field>
        </div>

        {error && <div className="oc-form-error">{error}</div>}

        <div className="oc-modal-actions">
          <button type="button" className="oc-secondary" onClick={onClose}>
            {mode === "add" ? "Discard" : "Cancel"}
          </button>
          <button
            type="button"
            className="oc-primary"
            disabled={!!validate()}
            onClick={submit}
          >
            {mode === "add" ? "Save" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="oc-field-group">
      <span>{label}</span>
      {children}
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

  return `${day}${suffix} ${new Intl.DateTimeFormat("en-GB", {
    month: "short",
  }).format(date)}, ${date.getFullYear()}`;
}
