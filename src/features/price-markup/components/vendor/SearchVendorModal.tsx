import { useMemo, useState } from "react";
import type { MarkupVendor } from "../../types/pricemarkup.types";
import MarkupModal from "../common/MarkupModal";
import SearchSelect from "../common/SearchSelect";

interface SearchVendorModalProps {
    vendors: MarkupVendor[];
    onContinue: (vendorId: string) => void;
    onClose: () => void;
}

// "Search vendor" — pick a vendor / store that has no markup yet.
export default function SearchVendorModal({ vendors, onContinue, onClose }: SearchVendorModalProps) {
    const [query, setQuery] = useState("");
    const [vendorId, setVendorId] = useState<string | null>(null);

    const options = useMemo(() => {
        const term = query.trim().toLowerCase();

        return vendors
            .filter((vendor) => `${vendor.name} ${vendor.location}`.toLowerCase().includes(term))
            .map((vendor) => ({ id: vendor.id, label: vendor.name, description: vendor.location, image: vendor.image }));
    }, [vendors, query]);

    const selected = vendors.find((vendor) => vendor.id === vendorId);

    return (
        <MarkupModal title="Search vendor" onClose={onClose} widthClassName="pm-modal--xs">
            <div className="pm-modal__body">
                <SearchSelect
                    label="Vendor"
                    placeholder="Search vendor or store name"
                    query={query}
                    onQueryChange={setQuery}
                    options={options}
                    selectedLabel={selected?.name ?? null}
                    emptyText="No vendors found"
                    onSelect={setVendorId}
                    onClear={() => setVendorId(null)}
                />
            </div>

            <div className="pm-modal__actions">
                <button type="button" className="pm-btn pm-btn--outline" onClick={onClose}>
                    Discard
                </button>
                <button type="button" className="pm-btn pm-btn--primary" disabled={!vendorId} onClick={() => vendorId && onContinue(vendorId)}>
                    Continue
                </button>
            </div>
        </MarkupModal>
    );
}
