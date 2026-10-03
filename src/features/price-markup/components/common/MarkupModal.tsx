import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface MarkupModalProps {
    title: ReactNode;
    children: ReactNode;
    /** Called for the header "x" and the Escape key. */
    onClose?: () => void;
    /** Renders the header "x" button. */
    showClose?: boolean;
    /** Extra control on the right of the title (e.g. the red delete button). */
    headerAction?: ReactNode;
    /** Keeps the modal mounted (so form state survives) while a confirm dialog is on top. */
    hidden?: boolean;
    widthClassName?: string;
}

export default function MarkupModal({
    title,
    children,
    onClose,
    showClose = false,
    headerAction,
    hidden = false,
    widthClassName = "pm-modal--sm",
}: MarkupModalProps) {
    useEffect(() => {
        if (!onClose || hidden) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose, hidden]);

    return (
        <div className={`pm-overlay ${hidden ? "is-hidden" : ""}`}>
            <div className={`pm-modal ${widthClassName}`} role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : undefined}>
                <header className="pm-modal__header">
                    <h3>{title}</h3>
                    {headerAction}
                    {showClose && (
                        <button type="button" className="pm-modal__close" aria-label="Close" onClick={onClose}>
                            <X size={22} strokeWidth={1.4} />
                        </button>
                    )}
                </header>

                {children}
            </div>
        </div>
    );
}
