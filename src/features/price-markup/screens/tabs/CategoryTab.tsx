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

type ModalState = { type: "add" } | { type: "edit"; row: CategoryMarkup } | null;

const FILTER_OPTIONS = [{ value: CATEGORY_ALL_FILTER, label: "All" }, ...priceMarkupApi.getMetadata().genderOptions.map((option) => ({ value: option.id, label: option.label }))];

export default function CategoryTab() {
    const { categoryMarkups, addCategoryMarkup, updateCategoryMarkup, removeCategoryMarkup } = usePriceMarkupStore();

    const [genderFilter, setGenderFilter] = useState(CATEGORY_ALL_FILTER);
    const [modal, setModal] = useState<ModalState>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const rows = useMemo(
        () => (genderFilter === CATEGORY_ALL_FILTER ? categoryMarkups : categoryMarkups.filter((row) => row.genderId === genderFilter)),
        [categoryMarkups, genderFilter],
    );

    const close = () => setModal(null);

    return (
        <>
            <div className="pm-toolbar">
                <h2 className="pm-toolbar__title">Markup category - {rows.length}</h2>

                <div className="pm-toolbar__controls">
                    <Funnel size={16} className="pm-toolbar__filter-icon" aria-hidden="true" />
                    <DropdownMenu compact value={genderFilter} options={FILTER_OPTIONS} onChange={setGenderFilter} ariaLabel="Filter by gender" />

                    <button type="button" className="pm-btn pm-btn--primary pm-btn--toolbar" onClick={() => setModal({ type: "add" })}>
                        Add Markup +
                    </button>
                </div>
            </div>

            <CategoryMarkupTable rows={rows} onEdit={(row) => setModal({ type: "edit", row })} />

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

            {successMessage && <SuccessModal message={successMessage} onClose={() => setSuccessMessage(null)} />}
        </>
    );
}
