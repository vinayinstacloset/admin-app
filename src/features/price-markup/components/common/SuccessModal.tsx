import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
    title?: string;
    message: string;
    buttonLabel?: string;
    onClose: () => void;
}

// Confirms that an add / edit / delete actually went through. Closing it
// never navigates anywhere by itself — the caller decides what happens next.
export default function SuccessModal({ title = "Success", message, buttonLabel = "Done", onClose }: SuccessModalProps) {
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    return (
        <div className="pm-overlay pm-overlay--confirm">
            <div className="pm-success" role="alertdialog" aria-modal="true" aria-label={title}>
                <span className="pm-success__icon">
                    <CheckCircle2 size={30} strokeWidth={1.6} />
                </span>
                <h3 className="pm-success__title">{title}</h3>
                <p className="pm-success__message">{message}</p>

                <button type="button" className="pm-btn pm-btn--primary pm-success__btn" onClick={onClose}>
                    {buttonLabel}
                </button>
            </div>
        </div>
    );
}
