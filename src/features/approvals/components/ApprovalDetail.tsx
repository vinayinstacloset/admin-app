import { useState } from "react";
import { FileText } from "lucide-react";
import type { ApprovalDocument, ApprovalItem } from "../types/approvals.types";
import { DocumentModal } from "./ApprovalModal";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] text-ink/45">{label}</p>
      <p className="truncate text-[12px] font-semibold text-ink">
        {value || "—"}
      </p>
    </div>
  );
}

interface DocumentCardProps {
  document: ApprovalDocument;
  onOpen: (document: ApprovalDocument, imageIndex?: number) => void;
}

function AadhaarCard({ document, onOpen }: DocumentCardProps) {
  const sources = document.imageUrls?.length
    ? document.imageUrls
    : document.imageUrl
      ? [document.imageUrl]
      : [];

  return (
    <div className="min-w-0 rounded-[5px] border border-[#aaa] bg-white p-2">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-[11px] font-semibold text-ink">Aadhar card</span>
        <span className="text-[9px] text-ink/40">Front & Back</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {sources.slice(0, 2).map((source, index) => (
          <button
            key={source}
            type="button"
            onClick={() => onOpen(document, index)}
            className="group min-w-0 text-left"
            aria-label={`View Aadhar card ${index === 0 ? "front" : "back"}`}
          >
            <div className="flex h-[105px] items-center justify-center overflow-hidden rounded-[5px] border border-black/10 bg-[#fafafa] transition group-hover:border-brand-500">
              <img
                src={source}
                alt={`Aadhar card ${index === 0 ? "front" : "back"}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <p className="mt-1.5 text-center text-[10px] font-medium text-ink/60">
              {index === 0 ? "Front" : "Back"}
            </p>
          </button>
        ))}
        {sources.length === 0 && (
          <div className="col-span-2 flex h-[105px] items-center justify-center text-[10px] text-ink/35">
            Aadhaar images unavailable
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentCard({ document, onOpen }: DocumentCardProps) {
  const source = document.imageUrls?.[0] ?? document.imageUrl;

  if (/aadhar|aadhaar/i.test(document.label)) {
    return <AadhaarCard document={document} onOpen={onOpen} />;
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(document, 0)}
      className="flex min-w-0 flex-col rounded-[5px] border border-[#aaa] bg-white p-2 text-center transition hover:border-brand-500"
    >
      <div className="flex h-[130px] items-center justify-center overflow-hidden bg-[#fafafa]">
        {source ? (
          <img
            src={source}
            alt={document.label}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <FileText size={34} className="text-ink/20" />
        )}
      </div>
      <span className="mt-2 text-[11px] font-medium text-ink">
        {document.label}
      </span>
    </button>
  );
}

export default function ApprovalDetail({ item }: { item: ApprovalItem }) {
  const [document, setDocument] = useState<ApprovalDocument | null>(null);
  const [documentImageIndex, setDocumentImageIndex] = useState(0);
  const personal = item.personal ?? {
    name: item.name,
    email: item.email,
    phone: item.contact,
    ageGender: "",
    cityState: [item.city, item.state].filter(Boolean).join(" / "),
    avatarUrl: item.avatarUrl,
  };
  const vehicle = item.vehicleDetails ?? {
    name: item.vehicle,
    color: "",
    purchasedOn: "",
    number: item.vehicleNumber,
    modelYear: "",
    imageUrl: null,
  };
  const isRider = item.type === "rider";

  const openDocument = (nextDocument: ApprovalDocument, imageIndex = 0) => {
    setDocument(nextDocument);
    setDocumentImageIndex(imageIndex);
  };

  return (
    <>
      <div className="space-y-5">
        <section>
          <h2 className="mb-3 text-[15px] font-semibold text-ink">
            Personal details
          </h2>
          <div className="rounded-xl bg-white px-6 py-5 shadow-sm">
            <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-[90px_repeat(4,minmax(0,1fr))]">
              <div className="flex justify-center">
                {personal.avatarUrl ? (
                  <img
                    src={personal.avatarUrl}
                    alt={personal.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f3f5] text-[11px] font-semibold text-ink/35">
                    {personal.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <Field label="Full Name:" value={personal.name} />
              <Field label="Email:" value={personal.email} />
              <Field label="Mobile No:" value={personal.phone} />
              <div className="grid grid-cols-2 gap-5">
                <Field label="Age/Gender:" value={personal.ageGender} />
                <Field label="City/State:" value={personal.cityState} />
              </div>
            </div>
          </div>
        </section>

        {isRider && (
          <section>
            <h2 className="mb-3 text-[15px] font-semibold text-ink">
              Vehicle details
            </h2>
            <div className="rounded-xl bg-white px-6 py-5 shadow-sm">
              <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[150px_repeat(5,minmax(0,1fr))]">
                <div className="flex h-20 items-center justify-center overflow-hidden">
                  {vehicle.imageUrl ? (
                    <img
                      src={vehicle.imageUrl}
                      alt={vehicle.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-[#f2f2f2] text-[10px] text-ink/30">
                      Vehicle image
                    </div>
                  )}
                </div>
                <Field label="Vehicle Name:" value={vehicle.name} />
                <Field label="Color:" value={vehicle.color} />
                <Field label="Purchased On:" value={vehicle.purchasedOn} />
                <Field label="Vehicle Number:" value={vehicle.number} />
                <Field label="Model Year:" value={vehicle.modelYear} />
              </div>
            </div>
          </section>
        )}

        {isRider && item.riderDetail && (
          <>
            {(["bank", "emergencyContact"] as const).map((sectionKey) => {
              const section = item.riderDetail?.[sectionKey];
              if (!section || typeof section !== "object") return null;
              const values = section as Record<string, unknown>;
              const labels =
                sectionKey === "bank"
                  ? [
                      ["Account holder", "accountHolderName"],
                      ["Account number", "accountNumber"],
                      ["IFSC", "ifscCode"],
                      ["Bank name", "bankName"],
                      ["UPI ID", "upiId"],
                    ]
                  : [
                      ["Contact name", "contactName"],
                      ["Relation", "relation"],
                      ["Mobile", "mobile"],
                      ["Alternate number", "alternateNumber"],
                    ];
              return (
                <section key={sectionKey}>
                  <h2 className="mb-3 text-[15px] font-semibold text-ink">
                    {sectionKey === "bank"
                      ? "Bank details"
                      : "Emergency contact"}
                  </h2>
                  <div className="rounded-xl bg-white px-6 py-5 shadow-sm">
                    <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                      {labels.map(([label, key]) => (
                        <Field
                          key={key}
                          label={`${label}:`}
                          value={String(values[key] ?? "")}
                        />
                      ))}
                      <div>
                        <p className="text-[10px] text-ink/45">Status</p>
                        <p className="text-[12px] font-semibold text-ink">
                          {String(values.status ?? "PENDING")}
                        </p>
                      </div>
                    </div>
                    {values.rejectionReason ? (
                      <p className="mt-3 rounded-md bg-[#fff1f1] p-2 text-xs text-[#c33]">
                        Reason: {String(values.rejectionReason)}
                      </p>
                    ) : null}
                  </div>
                </section>
              );
            })}
            {(["aadhaar", "pan", "drivingLicense"] as const).map(
              (sectionKey) => {
                const section = item.riderDetail?.[sectionKey];
                if (!section || typeof section !== "object") return null;
                const values = section as Record<string, unknown>;
                return (
                  <section key={sectionKey}>
                    <h2 className="mb-3 text-[15px] font-semibold capitalize text-ink">
                      {sectionKey === "drivingLicense"
                        ? "Driving license"
                        : sectionKey}
                    </h2>
                    <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs text-ink/55">
                          Document status
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold ${String(values.status) === "APPROVED" ? "bg-[#e8f8ee] text-[#21834a]" : String(values.status) === "REJECTED" ? "bg-[#fff0f0] text-[#c33]" : "bg-[#fff7e6] text-[#9a6700]"}`}
                        >
                          {String(values.status ?? "NOT_UPLOADED").replaceAll(
                            "_",
                            " ",
                          )}
                        </span>
                      </div>
                      {values.rejectionReason ? (
                        <p className="mt-2 text-xs text-[#c33]">
                          Reason: {String(values.rejectionReason)}
                        </p>
                      ) : null}
                    </div>
                  </section>
                );
              },
            )}
          </>
        )}

        <section>
          <h2 className="mb-3 text-[15px] font-semibold text-ink">
            Document details
          </h2>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {(item.documents ?? []).map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onOpen={openDocument}
                />
              ))}
            </div>
            {(!item.documents || item.documents.length === 0) && (
              <div className="flex h-32 items-center justify-center text-xs text-ink/40">
                No documents available
              </div>
            )}
          </div>
        </section>
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
