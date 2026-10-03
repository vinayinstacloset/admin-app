import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { priceMarkupApi } from "../../api";
import { useMarkupDraft } from "../../hooks/useMarkupDraft";
import type { CategoryMarkup, CategoryMarkupInput } from "../../types/pricemarkup.types";
import ConfirmDialog from "../common/ConfirmDialog";
import MarkupModal from "../common/MarkupModal";
import MarkupTypeCards from "../common/MarkupTypeCards";
import PercentField from "../common/PercentField";
import SelectField from "../common/SelectField";

interface CategoryMarkupModalProps {
    mode: "add" | "edit";
    initial?: CategoryMarkup;
    existing: CategoryMarkup[];
    onSave: (input: CategoryMarkupInput) => void;
    onDelete?: () => void;
    onClose: () => void;
}

const { categoryTree: CATEGORY_TREE, genderOptions: GENDER_OPTIONS } = priceMarkupApi.getMetadata();
type Confirm = "discard" | "delete" | null;

const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

// "Add category markup" / "Edit category markup" — cascading Gender →
// Navigation → Product category → Category, then Discount or Hike.
export default function CategoryMarkupModal({ mode, initial, existing, onSave, onDelete, onClose }: CategoryMarkupModalProps) {
    const [genderId, setGenderId] = useState(initial?.genderId ?? "");
    const [navigation, setNavigation] = useState(initial?.navigation ?? "");
    const [productCategory, setProductCategory] = useState(initial?.productCategory ?? "");
    const [category, setCategory] = useState(initial?.category ?? "");
    const [confirm, setConfirm] = useState<Confirm>(null);
    const draft = useMarkupDraft(initial?.markup);

    const tree = genderId ? CATEGORY_TREE[genderId] : undefined;
    const needsNavigation = (tree?.navigations.length ?? 0) > 0;

    const categoryOptions = useMemo(
        () => tree?.productCategories.find((node) => node.name === productCategory)?.categories ?? [],
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

    const selectionComplete = Boolean(genderId && (!needsNavigation || navigation) && productCategory && category);
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
                widthClassName="pm-modal--lg"
                headerAction={
                    mode === "edit" && onDelete ? (
                        <button type="button" className="pm-trash-btn" aria-label="Delete markup" onClick={() => setConfirm("delete")}>
                            <Trash2 size={16} />
                        </button>
                    ) : undefined
                }
            >
                <div className="pm-modal__body pm-modal__grid">
                    <SelectField
                        label="Gender"
                        placeholder="Select gender"
                        value={genderId}
                        options={GENDER_OPTIONS.map((option) => ({ value: option.id, label: option.label.toUpperCase() }))}
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
                        options={toOptions(tree?.productCategories.map((node) => node.name) ?? [])}
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

                    {isDuplicate && <p className="pm-error pm-modal__grid-full">A markup already exists for this category.</p>}
                </div>

                <hr className="pm-modal__band" />

                <div className="pm-modal__body">
                    <p className="pm-modal__subtitle">Select discount or hike</p>
                    <MarkupTypeCards value={draft.kind} onChange={draft.setKind} size="sm" />
                    {draft.kind && <PercentField className="pm-field--narrow" kind={draft.kind} value={draft.percentRaw} onChange={draft.setPercentRaw} />}
                </div>

                <div className="pm-modal__actions">
                    <button type="button" className="pm-btn pm-btn--outline" onClick={mode === "add" ? () => setConfirm("discard") : onClose}>
                        {mode === "add" ? "Discard" : "Cancel"}
                    </button>
                    <button type="button" className="pm-btn pm-btn--primary" disabled={!canSubmit} onClick={submit}>
                        {mode === "add" ? "Save" : "Update"}
                    </button>
                </div>
            </MarkupModal>

            {confirm && (
                <ConfirmDialog
                    message={
                        confirm === "discard" ? (
                            <>
                                Are you sure you want to <strong>discard Markup?</strong>
                            </>
                        ) : (
                            <>
                                Are you sure you want to <strong>delete markup?</strong>
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
