import type { Markup } from "../../types/pricemarkup.types";
import { useMarkupDraft } from "../../hooks/useMarkupDraft";
import MarkupModal from "../common/MarkupModal";
import MarkupTypeCards from "../common/MarkupTypeCards";
import PercentField from "../common/PercentField";

interface MarkupTypeModalProps {
    /** "Markup for all" or "<Vendor> markup". */
    title: string;
    initial?: Markup | null;
    submitLabel: string;
    onSubmit: (markup: Markup) => void;
    onClose: () => void;
}

// Discount / Hike picker with a percentage box — used for "Markup for all"
// and for a single vendor's markup on the Add Markup page.
export default function MarkupTypeModal({ title, initial = null, submitLabel, onSubmit, onClose }: MarkupTypeModalProps) {
    const draft = useMarkupDraft(initial);

    return (
        <MarkupModal title={title} onClose={onClose} showClose widthClassName="pm-modal--md">
            <div className="pm-modal__body">
                <MarkupTypeCards value={draft.kind} onChange={draft.setKind} size="lg" />
            </div>

            {draft.kind && (
                <>
                    <hr className="pm-modal__rule" />

                    <div className="pm-modal__body">
                        <PercentField kind={draft.kind} value={draft.percentRaw} onChange={draft.setPercentRaw} />
                    </div>

                    <div className="pm-modal__actions pm-modal__actions--single">
                        <button type="button" className="pm-btn pm-btn--primary" disabled={!draft.isValid} onClick={() => draft.markup && onSubmit(draft.markup)}>
                            {submitLabel}
                        </button>
                    </div>
                </>
            )}
        </MarkupModal>
    );
}
