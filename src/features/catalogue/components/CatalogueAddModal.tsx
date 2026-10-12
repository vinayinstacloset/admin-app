import { useMemo, useState } from "react";
import { Info, Upload, X } from "lucide-react";
import CatalogueDropdown from "./CatalogueDropdown";
import type {
  CatalogueAddForm,
  CatalogueEntityType,
} from "../types/catalogue.types";
import {
  categoryOptions,
  genderOptions,
  navigationOptions,
  productCategoryOptions,
} from "../utils/catalogue.utils";
import { catalogueAddSchema } from "../validation/catalogue.schema";

interface Props {
  entityType: CatalogueEntityType;
  onClose: () => void;
  onSaved: (name: string, entityType: CatalogueEntityType) => void;
}

export default function CatalogueAddModal({
  entityType,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState<CatalogueAddForm>({
    entityType,
    gender: "MEN",
    navigation: "",
    productCategory: "Topwear",
    category: "Shirt",
    image: "",
    name: "",
  });
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const isProduct = entityType === "product-category";
  const isCategory = entityType === "category";
  const isSub = entityType === "sub-category";
  const needsNavigation = form.gender === "KIDS" || form.gender === "TEENS";
  const navigation = useMemo(
    () => navigationOptions[form.gender],
    [form.gender],
  );

  const title = isProduct
    ? "Add product category"
    : isCategory
      ? "Add category"
      : "Add sub-category";

  const update = <K extends keyof CatalogueAddForm>(
    key: K,
    value: CatalogueAddForm[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const chooseImage = (file?: File) => {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/svg+xml"].includes(file.type)) {
      setError("Only PNG, JPG and SVG formats are supported.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2MB.");
      return;
    }
    setError("");
    update("image", file.name);
    setPreview(URL.createObjectURL(file));
  };

  const submit = () => {
    const result = catalogueAddSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Please complete the form.");
      return;
    }
    onSaved(form.name.trim(), entityType);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4 backdrop-blur-[1px]">
      <div className="w-full max-w-[405px] rounded-xl bg-white p-5 shadow-[0_22px_60px_rgba(0,0,0,.18)]">
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <h2 className="text-[16px] font-semibold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-ink/50 hover:bg-black/5 hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-4 space-y-3.5">
          <FieldLabel label="Gender" />
          <CatalogueDropdown
            value={form.gender}
            options={genderOptions}
            onChange={(value) => {
              update("gender", value as CatalogueAddForm["gender"]);
              update("navigation", "");
            }}
          />

          {needsNavigation && (
            <>
              <FieldLabel label="Category navigation" />
              <CatalogueDropdown
                value={form.navigation}
                options={navigation}
                onChange={(value) => update("navigation", value)}
                placeholder="Select category navigation"
              />
            </>
          )}

          {!isProduct && (
            <>
              <FieldLabel label="Product category" />
              <CatalogueDropdown
                value={form.productCategory}
                options={productCategoryOptions}
                onChange={(value) => update("productCategory", value)}
              />
            </>
          )}

          {isSub && (
            <>
              <FieldLabel label="Category" />
              <CatalogueDropdown
                value={form.category}
                options={categoryOptions.filter((item) => item !== "All")}
                onChange={(value) => update("category", value)}
              />
            </>
          )}

          {!isSub && (
            <div>
              <FieldLabel label="" />
              <label className="flex h-[126px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[#b99980] bg-[#fffdfb] px-4 text-center transition-colors hover:bg-[#faf5f0]">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  className="hidden"
                  onChange={(event) => chooseImage(event.target.files?.[0])}
                />
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-16 w-16 object-contain"
                  />
                ) : (
                  <Upload size={22} className="text-[#765038]" />
                )}
                <span className="mt-2 text-[10px] font-medium text-[#765038]">
                  {preview
                    ? "Change image"
                    : `Upload ${isProduct ? "product category" : "category"} image`}
                </span>
                <span className="mt-1 text-[7px] text-ink/45">
                  Only PNG, JPG and SVG formats are supported (Max 2MB)
                </span>
              </label>
            </div>
          )}

          <div>
            <FieldLabel label="Name" />
            <input
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder={`Enter ${isProduct ? "product category" : isSub ? "sub-category" : "category"} name`}
              className="mt-1 h-9 w-full rounded-md border border-black/15 px-3 text-[10px] font-medium outline-none transition-colors focus:border-[#765038]"
            />
          </div>

          <div className="border-t border-black/10 pt-2 text-[9px] leading-4 text-ink/45">
            <p className="flex gap-1.5">
              <Info size={12} className="mt-0.5 shrink-0" />
              Instacloset will integrate this, it will be global so every vendor
              able to use this.
            </p>
          </div>
          {error && (
            <p className="text-[9px] font-medium text-[#e66565]">{error}</p>
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-md border border-black/50 bg-white text-[10px] font-semibold text-ink/70 hover:bg-[#faf8f6]"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={submit}
            className={`h-9 rounded-md text-[10px] font-semibold text-white transition-colors ${form.name.trim() ? "bg-[#765038] hover:bg-[#68472f]" : "bg-[#d8d8d8]"}`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ label }: { label: string }) {
  return label ? (
    <label className="block text-[10px] font-semibold text-ink/65">
      {label}
    </label>
  ) : null;
}
