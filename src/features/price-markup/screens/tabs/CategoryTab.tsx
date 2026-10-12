import { useMemo, useState } from "react";
import { Funnel } from "lucide-react";
import CategoryMarkupModal from "../../components/category/CategoryMarkupModal";
import CategoryMarkupTable from "../../components/category/CategoryMarkupTable";
import DropdownMenu from "../../components/common/DropdownMenu";
import SuccessModal from "../../components/common/SuccessModal";
import { CATEGORY_ALL_FILTER } from "../../constants/priceMarkup.constants";
import { priceMarkupApi } from "../../api";
import { usePriceMarkupStore } from "../../store/priceMarkupStore";
import type { CategoryMarkup } from "../../types/pricemarkup.types";
import {
  hoverStyle,
  focusStyle,
} from "../../../../shared/utils/interactiveStyle";

type ModalState =
  { type: "add" } | { type: "edit"; row: CategoryMarkup } | null;

const FILTER_OPTIONS = [
  { value: CATEGORY_ALL_FILTER, label: "All" },
  ...priceMarkupApi
    .getMetadata()
    .genderOptions.map((option) => ({ value: option.id, label: option.label })),
];

export default function CategoryTab() {
  const {
    categoryMarkups,
    addCategoryMarkup,
    updateCategoryMarkup,
    removeCategoryMarkup,
  } = usePriceMarkupStore();

  const [genderFilter, setGenderFilter] = useState(CATEGORY_ALL_FILTER);
  const [modal, setModal] = useState<ModalState>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      genderFilter === CATEGORY_ALL_FILTER
        ? categoryMarkups
        : categoryMarkups.filter((row) => row.genderId === genderFilter),
    [categoryMarkups, genderFilter],
  );

  const close = () => setModal(null);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
          Markup category - {rows.length}
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <Funnel size={16} style={{ color: "#4b4540" }} aria-hidden="true" />
          <DropdownMenu
            compact
            value={genderFilter}
            options={FILTER_OPTIONS}
            onChange={setGenderFilter}
            ariaLabel="Filter by gender"
          />

          <button
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid transparent",
              fontWeight: 600,
              transition: "background 0.15s, border-color 0.15s, opacity 0.15s",
              background: "#6d4c36",
              color: "#fff",
              height: 36,
              padding: "0 16px",
              fontSize: 11.5,
              borderRadius: 4,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
            {...hoverStyle(
              { background: "#5c4030" },
              { background: "#6d4c36" },
              true,
            )}
            onClick={() => setModal({ type: "add" })}
          >
            Add Markup +
          </button>
        </div>
      </div>

      <CategoryMarkupTable
        rows={rows}
        onEdit={(row) => setModal({ type: "edit", row })}
      />

      {modal?.type === "add" && (
        <CategoryMarkupModal
          mode="add"
          existing={categoryMarkups}
          onClose={close}
          onSave={(input) => {
            addCategoryMarkup(input);
            close();
            setSuccessMessage("Category markup added successfully.");
          }}
        />
      )}

      {modal?.type === "edit" && (
        <CategoryMarkupModal
          key={modal.row.id}
          mode="edit"
          initial={modal.row}
          existing={categoryMarkups}
          onClose={close}
          onSave={(input) => {
            updateCategoryMarkup(modal.row.id, input);
            close();
            setSuccessMessage("Category markup updated successfully.");
          }}
          onDelete={() => {
            removeCategoryMarkup(modal.row.id);
            close();
            setSuccessMessage("Category markup deleted successfully.");
          }}
        />
      )}

      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </>
  );
}
