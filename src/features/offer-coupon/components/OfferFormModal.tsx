import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  CalendarDays,
  Trash2,
  Upload,
  X,
  BadgePercent,
  Ribbon,
} from "lucide-react";
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
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";
import { hoverStyle, focusStyle } from "../../../shared/utils/interactiveStyle";

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
});

export default function OfferFormModal({
  mode,
  initial,
  offerType,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const isMax900 = useMediaQuery("(max-width: 900px)");
  const isMax700 = useMediaQuery("(max-width: 700px)");
  const isMax560 = useMediaQuery("(max-width: 560px)");
  const [form, setForm] = useState<OfferInput>(
    initial
      ? {
          offerType: initial.offerType,
          imageUrl: initial.imageUrl,
          discount: initial.discount === null ? "" : String(initial.discount),
          placement: initial.placement,
          startDate: initial.startDate,
          endDate: initial.endDate,
          gender: initial.gender,
          categoryNavigation: initial.categoryNavigation,
          productCategory: initial.productCategory,
          category: initial.category,
          subCategory: initial.subCategory,
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

  const set = <K extends keyof OfferInput>(key: K, value: OfferInput[K]) => {
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
            width: "min(790px, calc(100vw - 32px))",
            maxHeight: "calc(100vh - 48px)",
            overflow: "auto",
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxSizing: "border-box",
            boxShadow: "0 15px 45px rgba(0, 0, 0, 0.18)",
          },
          ...(isMax900 ? { padding: 16 } : {}),
          ...(isMax700 ? { width: "min(790px, calc(100vw - 20px))" } : {}),
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
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isFlashCard ? (
              <Ribbon size={19} style={{ color: "#f15d91" }} />
            ) : (
              <BadgePercent size={19} style={{ color: "#f15d91" }} />
            )}
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
              {title}
            </h3>
          </div>
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
                aria-label="Delete offer"
              >
                <Trash2 size={17} />
              </button>
            ) : null}
          </div>
        </div>

        <div
          style={{ height: 1, background: "#d8d5d2", margin: "12px 0 19px" }}
        />

        <div
          style={{
            height: isMax560 ? 135 : 150,
            border: "2px dashed #c8b5a8",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: form.imageUrl ? 6 : 5,
            color: "#76523b",
            cursor: "pointer",
            position: "relative",
            boxSizing: "border-box",
          }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files[0]);
          }}
        >
          <input
            style={{ fontFamily: "inherit" }}
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {form.imageUrl ? (
            <>
              <div style={{ position: "relative" }}>
                <img
                  src={form.imageUrl}
                  alt="Offer preview"
                  style={{
                    ...{
                      display: "block",
                      borderRadius: 2,
                      width: 70,
                      height: 70,
                      objectFit: "cover",
                    },
                    ...(isFlashCard ? { width: 176, height: 84 } : {}),
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    right: -7,
                    top: -7,
                    width: 17,
                    height: 17,
                    border: 0,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#777",
                    fontFamily: "inherit",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    set("imageUrl", "");
                  }}
                >
                  <X size={12} />
                </button>
              </div>
              <span style={{ fontSize: 8.5, color: "#655d58" }}>
                Only PNG, JPG and SVG formats are supported (Max. 3MB)
              </span>
            </>
          ) : (
            <>
              <Upload size={22} />
              <strong style={{ fontSize: 11, fontWeight: 500 }}>
                Upload image
              </strong>
              <span style={{ fontSize: 8.5, color: "#655d58" }}>
                Image ratio: (
                {isFlashCard
                  ? "Width: 412 px, Height: 125 px"
                  : "Width: 70 px, Height: 70 px"}
                )
              </span>
              <small style={{ fontSize: 8.5, color: "#655d58" }}>
                Only PNG, JPG and SVG formats are supported (Max. 3MB)
              </small>
            </>
          )}
        </div>

        <div
          style={{
            ...{
              display: "grid",
              gap: "12px 16px",
              gridTemplateColumns: "1fr 1fr",
              marginTop: 18,
            },
            ...(isMax900 ? { gridTemplateColumns: "1fr" } : {}),
          }}
        >
          <Field label="Placement">
            <Dropdown
              value={form.placement}
              placeholder="Select placement"
              options={PLACEMENT_OPTIONS.map((v) => ({ value: v, label: v }))}
              onChange={(v) => set("placement", v as OfferInput["placement"])}
            />
          </Field>

          <Field
            label={`Discount percentage${isFlashCard ? " (Optional)" : ""}`}
          >
            <div
              style={{
                height: 36,
                border: "1px solid #a9a6a3",
                display: "flex",
                alignItems: "center",
                borderRadius: 5,
              }}
            >
              <input
                style={{
                  boxSizing: "border-box",
                  width: "100%",
                  background: "#fff",
                  borderRadius: 5,
                  padding: "0 12px",
                  color: "#2b2724",
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
                {...focusStyle({ borderColor: "#76523b" }, { borderColor: "" })}
                value={form.discount}
                inputMode="decimal"
                data-placeholder="oc"
                placeholder={
                  isFlashCard
                    ? "Enter discount percentage"
                    : "Enter discount percentage"
                }
                onChange={(e) =>
                  set("discount", e.target.value.replace(/[^0-9.]/g, ""))
                }
              />
              <span
                style={{ padding: "0 10px", fontSize: 12, color: "#55504f" }}
              >
                %
              </span>
            </div>
          </Field>

          <Field label="Start date">
            <DateField
              value={form.startDate}
              onChange={(v) => set("startDate", v)}
            />
          </Field>

          <Field label="End date">
            <DateField
              value={form.endDate}
              onChange={(v) => set("endDate", v)}
            />
          </Field>
        </div>

        <div
          style={{
            borderTop: "5px solid #efeeec",
            marginTop: 14,
            paddingTop: 17,
            marginBottom: 10,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          Click to navigate
        </div>

        <div
          style={{
            ...{
              display: "grid",
              gap: "12px 16px",
              gridTemplateColumns: "1fr 1fr 1fr",
            },
            ...(isMax900 ? { gridTemplateColumns: "1fr" } : {}),
          }}
        >
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
              options={categoryNavigationOptions.map((v) => ({
                value: v,
                label: v,
              }))}
              onChange={(v) => set("categoryNavigation", v)}
            />
          </Field>

          <Field label="Product category">
            <Dropdown
              value={form.productCategory}
              placeholder="Select product category"
              options={PRODUCT_CATEGORY_OPTIONS.map((v) => ({
                value: v,
                label: v,
              }))}
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
              marginTop: 14,
            },
            ...(isMax560 ? { flexWrap: "wrap" } : {}),
          }}
        >
          <button
            type="button"
            style={{
              ...{
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
              },
              ...(isMax560 ? { flex: 1 } : {}),
            }}
            {...hoverStyle({ background: "#f6f4f2" }, { background: "#fff" })}
            onClick={onClose}
          >
            {mode === "add" ? "Discard" : "Cancel"}
          </button>
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
              },
              ...(isMax560 ? { flex: 1 } : {}),
              ...(!!validate()
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 7, minWidth: 0 }}
    >
      <span style={{ fontSize: 11, fontWeight: 700, color: "#625d58" }}>
        {label}
      </span>
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

  return `${day}${suffix} ${new Intl.DateTimeFormat("en-GB", {
    month: "short",
  }).format(date)}, ${date.getFullYear()}`;
}
