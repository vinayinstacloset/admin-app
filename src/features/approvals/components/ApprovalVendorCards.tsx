import { useState } from "react";
import type { ApprovalDocument, ApprovalItem } from "../types/approvals.types";
import { DocumentModal } from "./ApprovalModal";

interface ApprovalVendorCardsProps {
    items: ApprovalItem[];
    onReject: (item: ApprovalItem) => void;
    onApprove: (item: ApprovalItem) => void;
}

function Field({ label, value }: { label: string; value?: string }) {
    return (
        <div className="min-w-0">
            <p className="text-[10px] text-ink/45">{label}</p>
            <p className="truncate text-[12px] font-semibold text-ink">{value || "—"}</p>
        </div>
    );
}

export default function ApprovalVendorCards({ items, onReject, onApprove }: ApprovalVendorCardsProps) {
    const [document, setDocument] = useState<ApprovalDocument | null>(null);
    const [documentImageIndex, setDocumentImageIndex] = useState(0);

    return (
        <>
            <div className="space-y-4">
                {items.map((item) => {
                    const aadhaar = item.documents?.find((doc) => /aadhar|aadhaar/i.test(doc.label));
                    const images = aadhaar?.imageUrls?.length
                        ? aadhaar.imageUrls
                        : aadhaar?.imageUrl
                          ? [aadhaar.imageUrl]
                          : [];

                    return (
                        <article key={item.id} className="rounded-xl bg-white p-4 shadow-sm">
                            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-5 p-2 sm:grid-cols-3">
                                    <Field label="Full Name:" value={item.personal?.name ?? item.name} />
                                    <Field label="Email:" value={item.personal?.email ?? item.email} />
                                    <Field label="Mobile No:" value={item.personal?.phone ?? item.contact} />
                                    <Field label="Age/Gender:" value={item.personal?.ageGender} />
                                    <Field label="City/State:" value={item.personal?.cityState ?? [item.city, item.state].filter(Boolean).join(" / ")} />
                                </div>

                                <div className="rounded-xl bg-[#f4f2ef] p-3 text-left">
                                    <span className="mb-2 inline-flex rounded-md bg-[#ece6df] px-3 py-1 text-[10px] font-semibold text-brand-700">
                                        Aadhar card
                                    </span>
                                    <div className="grid grid-cols-2 gap-2">
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
                                                className="group rounded-lg bg-white/70 p-1.5 text-center"
                                            >
                                                <div className="flex h-[82px] items-center justify-center overflow-hidden rounded border border-black/10 bg-white group-hover:border-brand-500">
                                                    <img src={source} alt={`Aadhaar ${index === 0 ? "front" : "back"}`} className="max-h-full max-w-full object-contain" />
                                                </div>
                                                <span className="mt-1 block text-[9px] font-medium text-ink/50">{index === 0 ? "Front" : "Back"}</span>
                                            </button>
                                        ))}
                                        {images.length === 0 && (
                                            <div className="col-span-2 flex h-[100px] items-center justify-center text-[10px] text-ink/35">Aadhaar images unavailable</div>
                                        )}
                                    </div>
                                    <p className="mt-2 text-[9px] text-ink/40">Click front or back to view separately</p>
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
