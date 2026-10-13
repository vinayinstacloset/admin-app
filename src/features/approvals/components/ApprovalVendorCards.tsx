import { useState } from "react";
import type { ApprovalDocument, ApprovalItem } from "../types/approvals.types";
import { DocumentModal } from "./ApprovalModal";

interface ApprovalVendorCardsProps {
  items: ApprovalItem[];
  onReject: (item: ApprovalItem) => void;
  onApprove: (item: ApprovalItem) => void;
}

function Field({
  label,
  value,
  wrap = false,
}: {
  label: string;
  value?: string;
  wrap?: boolean;
}) {
  const displayValue = value || "—";

  return (
    <div className="min-w-0">
      <p className="text-[10px] text-ink/45">{label}</p>
      <p
        title={displayValue}
        className={`text-[12px] font-semibold text-ink ${
          wrap ? "break-words" : "truncate"
        }`}
      >
        {displayValue}
      </p>
    </div>
  );
}

export default function ApprovalVendorCards({
  items,
  onReject,
  onApprove,
}: ApprovalVendorCardsProps) {
  const [document, setDocument] = useState<ApprovalDocument | null>(null);
  const [documentImageIndex, setDocumentImageIndex] = useState(0);

  return (
    <>
      <div className="space-y-4">
        {items.map((item) => {
          const aadhaar = item.documents?.find((doc) =>
            /aadhar|aadhaar/i.test(doc.label),
          );
          const images = aadhaar?.imageUrls?.length
            ? aadhaar.imageUrls
            : aadhaar?.imageUrl
              ? [aadhaar.imageUrl]
              : [];

          return (
            <article
              key={item.id}
              className="rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
                {/* Vendor details: row 1 = personal, row 2 = business */}
                <div className="flex flex-col justify-center gap-y-5 p-2 px-4">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-[136fr_208fr_154fr_123fr_137fr]">
                    <Field
                      label="Full Name:"
                      value={item.personal?.name ?? item.name}
                    />
                    <Field
                      label="Email:"
                      value={item.personal?.email ?? item.email}
                    />
                    <Field
                      label="Mobile No:"
                      value={item.personal?.phone ?? item.contact}
                    />
                    <Field label="PAN No:" value={item.panNumber} />
                    <Field
                      label="City/State:"
                      value={
                        item.personal?.cityState ??
                        [item.city, item.state].filter(Boolean).join("/")
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-[187fr_175fr_396fr]">
                    <Field
                      label="Company/station name:"
                      value={item.storeName}
                    />
                    <Field label="GSTIN No:" value={item.gstin} />
                    <Field label="Address:" value={item.address} wrap />
                  </div>
                </div>

                {/* Aadhar card preview panel */}
                <div className="rounded-xl bg-[#f4f2ef] p-3 text-left">
                  <span className="inline-flex rounded-md bg-[#ece6df] px-3 py-1 text-[10px] font-semibold text-brand-700">
                    Aadhar card
                  </span>
                  <div className="mt-1 flex min-h-[100px] items-center justify-center gap-6">
                    {images.slice(0, 2).map((source, index) => (
                      <button
                        key={source}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          if (!aadhaar) return;
                          setDocument(aadhaar);
                          setDocumentImageIndex(index);
                        }}
                        aria-label={`View Aadhar card ${index === 0 ? "front" : "back"}`}
                        className="flex h-[78px] w-[118px] items-center justify-center overflow-hidden rounded bg-white shadow-sm transition hover:ring-1 hover:ring-brand-500"
                      >
                        <img
                          src={source}
                          alt={`Aadhaar ${index === 0 ? "front" : "back"}`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </button>
                    ))}
                    {images.length === 0 && (
                      <p className="text-[10px] text-ink/35">
                        Aadhaar images unavailable
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex justify-end gap-2 border-t border-black/10 pt-3">
                <button
                  type="button"
                  onClick={() => onReject(item)}
                  className="rounded-md bg-[#ed7777] px-5 py-2 text-xs font-semibold text-white"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => onApprove(item)}
                  className="rounded-md bg-[#2fbd66] px-5 py-2 text-xs font-semibold text-white"
                >
                  Approve
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <DocumentModal
        open={Boolean(document)}
        document={document}
        initialImageIndex={documentImageIndex}
        onClose={() => setDocument(null)}
      />
    </>
  );
}
