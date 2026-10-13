import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface RejectOrderModalProps {
  open: boolean;
  orderId?: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function RejectOrderModal({
  open,
  orderId,
  onClose,
  onConfirm,
}: RejectOrderModalProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) setReason("");
  }, [open, orderId]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center bg-black/30 p-5"
      onMouseDown={onClose}
    >
      <div
        className="w-[405px] max-w-full rounded-xl bg-white p-5 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-ink">Reject order</h3>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="my-3 h-px bg-black/10" />
        <label className="text-[11px] font-semibold text-ink/65">
          Rejection message
        </label>
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Write your message to customer..."
          className="mt-2 h-[175px] w-full resize-none border border-black/40 p-3 text-[11px] outline-none placeholder:text-ink/35"
          autoFocus
        />
        <p className="mt-2 text-[9px] italic leading-4 text-ink/55">
          ⓘ The customer and vendor will be able to see this message to
          understand why the order was rejected.
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 flex-1 rounded-md border border-black/60 text-[10.5px] font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!reason.trim()}
            onClick={() => onConfirm(reason.trim())}
            className="h-9 flex-1 rounded-md bg-[#ed7373] text-[10.5px] font-semibold text-white disabled:bg-[#d7d7d7]"
          >
            Confirm rejection
          </button>
        </div>
      </div>
    </div>
  );
}
