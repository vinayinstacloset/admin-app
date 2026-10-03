import { useEffect, type ReactNode } from "react";

interface ConfirmDialogProps {
    message: ReactNode;
    /** Optional block above the message (e.g. the product being deleted). */
    header?: ReactNode;
    onCancel: () => void;
    onConfirm: () => void;
    cancelLabel?: string;
    confirmLabel?: string;
}

// "Are you sure you want to discard / delete …?" — No, Wait / Yes.
export default function ConfirmDialog({
    message,
    header,
    onCancel,
    onConfirm,
    cancelLabel = "No, Wait",
    confirmLabel = "Yes",
}: ConfirmDialogProps) {
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onCancel();
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onCancel]);

    return (
        <div className="pm-overlay pm-overlay--confirm">
            <div className="pm-confirm" role="alertdialog" aria-modal="true">
                {header && <div className="pm-confirm__header">{header}</div>}
                <p className="pm-confirm__message">{message}</p>

                <div className="pm-confirm__actions">
                    <button type="button" className="pm-btn pm-btn--outline" onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button type="button" className="pm-btn pm-btn--danger" onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
