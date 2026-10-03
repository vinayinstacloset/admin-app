import { useState } from "react";
import { useMarkupDraft } from "../../hooks/useMarkupDraft";
import type { Markup, MarkupVendor } from "../../types/pricemarkup.types";
import { formatMoney } from "../../utils/pricemarkup.utils";
import ConfirmDialog from "../common/ConfirmDialog";
import { RevenueIcon, UnitSoldIcon } from "../common/MarkupIcons";
import MarkupModal from "../common/MarkupModal";
import MarkupTypeCards from "../common/MarkupTypeCards";
import PercentField from "../common/PercentField";
import StatTile from "../common/StatTile";
import VendorSummary from "../common/VendorSummary";
import { Package } from "lucide-react";

interface VendorMarkupModalProps {
    mode: "add" | "edit";
    vendor: MarkupVendor;
    initial?: Markup;
    onSave: (markup: Markup) => void;
    onClose: () => void;
}

// "Add vendor markup" / "Edit vendor markup".
export default function VendorMarkupModal({ mode, vendor, initial, onSave, onClose }: VendorMarkupModalProps) {
    const draft = useMarkupDraft(initial);
    const [confirmDiscard, setConfirmDiscard] = useState(false);

    const requestClose = mode === "add" ? () => setConfirmDiscard(true) : onClose;

    return (
        <>
            <MarkupModal
                title={mode === "add" ? "Add vendor markup" : "Edit vendor markup"}
                onClose={requestClose}
                hidden={confirmDiscard}
                widthClassName="pm-modal--vendor"
            >
                <div className="pm-modal__body">
                    <VendorSummary vendor={vendor} />

                    <div className="pm-modal__stats">
                        <StatTile tone="orange" label="TOTAL UNIT SOLD" value={vendor.totalUnitSold} icon={<UnitSoldIcon />} />
                        <StatTile tone="green" label="TOTAL REVENUE" value={formatMoney(vendor.totalRevenue)} icon={<RevenueIcon />} />
                        <StatTile tone="purple" label="TOTAL SKUS" value={vendor.totalSkus} icon={<Package size={12} />} />
                    </div>
                </div>

                <hr className="pm-modal__band" />

                <div className="pm-modal__body">
                    <p className="pm-modal__subtitle">Select discount or hike</p>
                    <MarkupTypeCards value={draft.kind} onChange={draft.setKind} size="sm" />
                    {draft.kind && <PercentField className="pm-field--narrow" kind={draft.kind} value={draft.percentRaw} onChange={draft.setPercentRaw} />}
                </div>

                <div className="pm-modal__actions">
                    <button type="button" className="pm-btn pm-btn--outline" onClick={requestClose}>
                        {mode === "add" ? "Discard" : "Cancel"}
                    </button>
                    <button type="button" className="pm-btn pm-btn--primary" disabled={!draft.isValid} onClick={() => draft.markup && onSave(draft.markup)}>
                        {mode === "add" ? "Save" : "Update"}
                    </button>
                </div>
            </MarkupModal>

            {confirmDiscard && (
                <ConfirmDialog
                    message={
                        <>
                            Are you sure you want to <strong>discard Markup?</strong>
                        </>
                    }
                    onCancel={() => setConfirmDiscard(false)}
                    onConfirm={onClose}
                />
            )}
        </>
    );
}
