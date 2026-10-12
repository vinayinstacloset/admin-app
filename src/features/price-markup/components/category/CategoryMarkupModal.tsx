import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { priceMarkupApi } from "../../api";
import { useMarkupDraft } from "../../hooks/useMarkupDraft";
import type {
  CategoryMarkup,
  CategoryMarkupInput,
} from "../../types/pricemarkup.types";
import ConfirmDialog from "../common/ConfirmDialog";
import MarkupModal from "../common/MarkupModal";
import MarkupTypeCards from "../common/MarkupTypeCards";
import PercentField from "../common/PercentField";
import SelectField from "../common/SelectField";
import { useMediaQuery } from "../../../../shared/hooks/useMediaQuery";
import {
  hoverStyle,
  focusStyle,
} from "../../../../shared/utils/interactiveStyle";

interface CategoryMarkupModalProps {
  mode: "add" | "edit";
  initial?: CategoryMarkup;
  existing: CategoryMarkup[];
  onSave: (input: CategoryMarkupInput) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const { categoryTree: CATEGORY_TREE, genderOptions: GENDER_OPTIONS } =
  priceMarkupApi.getMetadata();
type Confirm = "discard" | "delete" | null;

const toOptions = (values: string[]) =>
  values.map((value) => ({ value, label: value }));

// "Add category markup" / "Edit category markup" — cascading Gender →
// Navigation → Product category → Category, then Discount or Hike.
export default function CategoryMarkupModal({
  mode,
  initial,
  existing,
  onSave,
  onDelete,
  onClose,
}: CategoryMarkupModalProps) {
  const isMax820 = useMediaQuery("(max-width: 820px)");
  const [genderId, setGenderId] = useState(initial?.genderId ?? "");
  const [navigation, setNavigation] = useState(initial?.navigation ?? "");
  const [productCategory, setProductCategory] = useState(
    initial?.productCategory ?? "",
  );
  const [category, setCategory] = useState(initial?.category ?? "");
  const [confirm, setConfirm] = useState<Confirm>(null);
  const draft = useMarkupDraft(initial?.markup);

  const tree = genderId ? CATEGORY_TREE[genderId] : undefined;
  const needsNavigation = (tree?.navigations.length ?? 0) > 0;

  const categoryOptions = useMemo(
    () =>
      tree?.productCategories.find((node) => node.name === productCategory)
        ?.categories ?? [],
    [tree, productCategory],
  );

  const isDuplicate = existing.some(
    (row) =>
      row.id !== initial?.id &&
      row.genderId === genderId &&
      (row.navigation ?? "") === (needsNavigation ? navigation : "") &&
      row.productCategory === productCategory &&
      row.category === category,
  );

  const selectionComplete = Boolean(
    genderId && (!needsNavigation || navigation) && productCategory && category,
  );
  const canSubmit = selectionComplete && draft.isValid && !isDuplicate;

  const submit = () => {
    if (!canSubmit || !draft.markup) return;

    onSave({
      genderId,
      navigation: needsNavigation ? navigation : null,
      productCategory,
      category,
      markup: draft.markup,
    });
  };

  return (
    <>
      <MarkupModal
        title={mode === "add" ? "Add category markup" : "Edit category markup"}
        onClose={mode === "add" ? () => setConfirm("discard") : onClose}
        hidden={confirm !== null}
        maxWidth={655}
        headerAction={
          mode === "edit" && onDelete ? (
            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 24,
                height: 24,
                marginLeft: "auto",
                border: 0,
                borderRadius: 4,
                background: "#fdeaea",
                color: "#e5484d",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
              aria-label="Delete markup"
              onClick={() => setConfirm("delete")}
            >
              <Trash2 size={16} />
            </button>
          ) : undefined
        }
      >
        <div
          style={{
            ...{
              flexDirection: "column",
              paddingTop: 16,
              paddingRight: 20,
              paddingLeft: 20,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px 15px",
              paddingBottom: 16,
            },
            ...(isMax820 ? { gridTemplateColumns: "1fr" } : {}),
          }}
        >
          <SelectField
            label="Gender"
            placeholder="Select gender"
            value={genderId}
            options={GENDER_OPTIONS.map((option) => ({
              value: option.id,
              label: option.label.toUpperCase(),
            }))}
            onChange={(value) => {
              setGenderId(value);
              setNavigation("");
              setProductCategory("");
              setCategory("");
            }}
          />

          <SelectField
            label="Category Navigation"
            placeholder="Select category navigation"
            value={navigation}
            options={toOptions(tree?.navigations ?? [])}
            disabled={!genderId || !needsNavigation}
            onChange={setNavigation}
          />

          <SelectField
            label="Product Category"
            placeholder="Select product category"
            value={productCategory}
            options={toOptions(
              tree?.productCategories.map((node) => node.name) ?? [],
            )}
            disabled={!genderId || (needsNavigation && !navigation)}
            onChange={(value) => {
              setProductCategory(value);
              setCategory("");
            }}
          />

          <SelectField
            label="Category"
            placeholder="Select category"
            value={category}
            options={toOptions(categoryOptions)}
            disabled={!productCategory}
            onChange={setCategory}
          />

          {isDuplicate && (
            <p
              style={{
                gridColumn: "1 / -1",
                margin: 0,
                fontSize: 11,
                color: "#d64545",
              }}
            >
              A markup already exists for this category.
            </p>
          )}
        </div>

        <hr
          style={{
            height: 4,
            margin: "4px 0 0",
            border: 0,
            background: "#eeeeec",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            padding: "16px 20px 0",
          }}
        >
          <p style={{ margin: "4px 0 0", fontSize: 13.5 }}>
            Select discount or hike
          </p>
          <MarkupTypeCards
            value={draft.kind}
            onChange={draft.setKind}
            size="sm"
          />
          {draft.kind && (
            <PercentField
              narrow
              kind={draft.kind}
              value={draft.percentRaw}
              onChange={draft.setPercentRaw}
            />
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 9,
            padding: 20,
          }}
        >
          <button
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 18px",
              border: "1px solid #2c2622",
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: 600,
              transition: "background 0.15s, border-color 0.15s, opacity 0.15s",
              background: "#fff",
              color: "#2c2622",
              fontFamily: "inherit",
              cursor: "pointer",
              height: 40,
            }}
            {...hoverStyle({ background: "#f7f5f3" }, { background: "#fff" })}
            onClick={mode === "add" ? () => setConfirm("discard") : onClose}
          >
            {mode === "add" ? "Discard" : "Cancel"}
          </button>
          <button
            type="button"
            style={{
              ...{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 18px",
                border: "1px solid transparent",
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 600,
                transition:
                  "background 0.15s, border-color 0.15s, opacity 0.15s",
                background: "#6d4c36",
                color: "#fff",
                fontFamily: "inherit",
                cursor: "pointer",
                height: 40,
              },
              ...(!canSubmit
                ? {
                    background: "#dcdcdc",
                    borderColor: "transparent",
                    color: "#a3a3a3",
                    cursor: "not-allowed",
                  }
                : {}),
            }}
            {...hoverStyle(
              { background: "#5c4030" },
              { background: "#6d4c36" },
              true,
            )}
            disabled={!canSubmit}
            onClick={submit}
          >
            {mode === "add" ? "Save" : "Update"}
          </button>
        </div>
      </MarkupModal>

      {confirm && (
        <ConfirmDialog
          message={
            confirm === "discard" ? (
              <>
                Are you sure you want to{" "}
                <strong style={{ fontWeight: 600 }}>discard Markup?</strong>
              </>
            ) : (
              <>
                Are you sure you want to{" "}
                <strong style={{ fontWeight: 600 }}>delete markup?</strong>
              </>
            )
          }
          onCancel={() => setConfirm(null)}
          onConfirm={() => (confirm === "discard" ? onClose() : onDelete?.())}
        />
      )}
    </>
  );
}
