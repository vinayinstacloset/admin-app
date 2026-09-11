import { CheckCircle2, X } from "lucide-react";

interface SuccessModalProps {
    open: boolean;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    onClose?: () => void;
}

export default function SuccessModal({ open, message, actionLabel, onAction, onClose }: SuccessModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-soft p-6 text-center">
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-ink/30 hover:text-ink/70"
                        aria-label="Close"
                        type="button"
                    >
                        <X size={18} />
                    </button>
                )}

                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                    <CheckCircle2
                        className="text-emerald-500"
                        size={26}
                    />
                </div>

                <p className="text-sm text-ink/80">{message}</p>

                {actionLabel && onAction && (
                    <button
                        type="button"
                        onClick={onAction}
                        className="text-brand-600 text-[13px] hover:underline mt-1"
                    >
                        {actionLabel}
                    </button>
                )}
            </div>
        </div>
    );
}
