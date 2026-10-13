import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  widthClassName?: string;
}

export default function Modal({
  open,
  onClose,
  children,
  widthClassName = "max-w-md",
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 p-4">
      <div
        className={`relative w-full ${widthClassName} rounded-2xl bg-white p-6 shadow-soft`}
      >
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
