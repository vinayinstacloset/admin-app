import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
    open: boolean;
    onClose?: () => void;
    children: ReactNode;
    widthClassName?: string;
}

export default function Modal({ open, onClose, children, widthClassName = "max-w-md" }: ModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className={`relative w-full ${widthClassName} bg-white rounded-2xl shadow-soft p-6`}>
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
                {children}
            </div>
        </div>
    );
}
