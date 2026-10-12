import { useEffect, useState } from "react";
import { CheckCircle2, Info, X } from "lucide-react";
import type { ApprovalDocument, ApprovalItem } from "../types/approvals.types";

interface ActionConfirmationModalProps {
  open: boolean;
  item?: ApprovalItem | null;
  action: "approve" | "reject";
  reason?: string;
  onReasonChange?: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ActionConfirmationModal({
  open,
  item,
  action,
  reason = "",
  onReasonChange,
  onCancel,
  onConfirm,
}: ActionConfirmationModalProps) {
  if (!open || !item) return null;

  const isApprove = action === "approve";

  return (
    <div className="fixed left-0 top-0 z-[9999] flex h-dvh w-screen items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-[410px] rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-ink">
            {isApprove ? "Approve application" : "Reject application"}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full p-1 text-ink/35 transition hover:bg-black/5 hover:text-ink"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        {isApprove ? (
          <p className="text-[13px] leading-5 text-ink/65">
            Are you sure you want to approve{" "}
            <span className="font-semibold text-ink">{item.name}</span>&apos;s
            application?
          </p>
        ) : (
          <>
            <textarea
              value={reason}
              onChange={(event) => onReasonChange?.(event.target.value)}
              placeholder="Aadhar card back image is blurry please send new image"
              className="h-28 w-full resize-none rounded-lg border border-black/15 p-3 text-xs text-ink outline-none placeholder:text-ink/30 focus:border-brand-400"
            />
            <div className="mt-3 flex items-start gap-2 text-[10px] leading-4 text-ink/50">
              <Info size={14} className="mt-[1px] shrink-0 text-brand-600" />
              <span>The message will be sent to the applicant.</span>
            </div>
          </>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-black/15 px-5 py-2 text-xs font-medium text-ink/65 transition hover:bg-black/[0.03]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isApprove && !reason.trim()}
            onClick={onConfirm}
            className={`rounded-md px-5 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${
              isApprove
                ? "bg-[#2fbd66] hover:bg-[#28aa5b]"
                : "bg-[#ed7777] hover:bg-[#df6868]"
            }`}
          >
            {isApprove ? "Approve application" : "Reject application"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface SuccessModalProps {
  open: boolean;
  item?: ApprovalItem | null;
  action: "approve" | "reject";
  onClose: () => void;
}

export function ApprovalSuccessModal({
  open,
  item,
  action,
  onClose,
}: SuccessModalProps) {
  if (!open || !item) return null;

  const isApprove = action === "approve";

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/35 p-4">
      <div className="relative w-full max-w-[390px] rounded-2xl bg-white px-8 py-9 text-center shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-ink/35 hover:bg-black/5"
          aria-label="Close"
        >
          <X size={17} />
        </button>
        <CheckCircle2 size={48} className="mx-auto mb-4 text-[#41be72]" />
        <p className="text-[14px] font-semibold text-ink">
          {item.name} has been {isApprove ? "approved" : "rejected"}{" "}
          successfully.
        </p>
      </div>
    </div>
  );
}

interface DocumentModalProps {
  open: boolean;
  document?: ApprovalDocument | null;
  initialImageIndex?: number;
  onClose: () => void;
}

export function DocumentModal({
  open,
  document,
  initialImageIndex = 0,
  onClose,
}: DocumentModalProps) {
  const sources = document?.imageUrls?.length
    ? document.imageUrls
    : document?.imageUrl
      ? [document.imageUrl]
      : [];
  const [activeIndex, setActiveIndex] = useState(initialImageIndex);

  useEffect(() => {
    setActiveIndex(initialImageIndex);
  }, [document, initialImageIndex]);

  if (!open || !document) return null;

  const activeSource = sources[activeIndex] ?? sources[0];
  const isAadhaar = /aadhar|aadhaar/i.test(document.label);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4">
      <div className="relative max-h-[90vh] w-full max-w-3xl rounded-xl bg-white p-4 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-white p-1 text-ink/45 shadow"
          aria-label="Close"
        >
          <X size={16} />
        </button>
        <h3 className="mb-3 text-sm font-semibold text-ink">
          {document.label}
        </h3>

        {isAadhaar && sources.length > 1 && (
          <div className="mb-4 flex gap-2">
            {sources.slice(0, 2).map((source, index) => (
              <button
                key={source}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`rounded-md border p-1 transition ${activeIndex === index ? "border-brand-500" : "border-black/10"}`}
                aria-label={`Show Aadhar card ${index === 0 ? "front" : "back"}`}
              >
                <img src={source} alt="" className="h-14 w-24 object-contain" />
                <span className="block pt-1 text-[9px] text-ink/50">
                  {index === 0 ? "Front" : "Back"}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="flex max-h-[72vh] min-h-64 items-center justify-center overflow-auto rounded-lg bg-[#fafafa] p-3">
          {activeSource ? (
            <img
              src={activeSource}
              alt={`${document.label}${isAadhaar ? ` ${activeIndex === 0 ? "Front" : "Back"}` : ""}`}
              className="max-h-[68vh] max-w-full object-contain"
            />
          ) : (
            <div className="text-xs text-ink/40">
              Document image unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
