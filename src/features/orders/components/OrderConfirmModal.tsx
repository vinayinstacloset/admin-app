import { X } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  message: string;
  tone: "red" | "green" | "brown";
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}
export default function OrderConfirmModal({
  open,
  title,
  message,
  tone,
  confirmLabel = "Yes",
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;
  const button =
    tone === "red"
      ? "bg-[#e87373]"
      : tone === "green"
        ? "bg-[#39be69]"
        : "bg-[#805b42]";
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30 p-5"
      onMouseDown={onClose}
    >
      <div
        className="w-[420px] max-w-full rounded-xl bg-white p-6 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold text-ink">{title}</p>
          <button type="button" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="my-4 h-px bg-black/10" />
        <p className="text-[11px] leading-5 text-ink/60">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 flex-1 rounded-md border border-black/50 text-[10.5px] font-semibold"
          >
            No, Wait
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`h-9 flex-1 rounded-md text-[10.5px] font-semibold text-white ${button}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
