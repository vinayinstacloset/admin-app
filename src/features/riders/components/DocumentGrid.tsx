import type { RiderDocument } from "../types/rider.types";

interface DocumentGridProps {
    documents: RiderDocument[];
}

export default function DocumentGrid({ documents }: DocumentGridProps) {
    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5">
            <h2 className="text-[13px] font-semibold text-ink/50 uppercase tracking-wide mb-4">Document details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {documents.map((document) => (
                    <div key={document.label}>
                        <div className="rounded-lg overflow-hidden border border-black/5 aspect-[4/3] bg-cream">
                            <img
                                src={document.image}
                                alt={document.label}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="text-[11.5px] text-ink/50 mt-1.5 text-center">{document.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
