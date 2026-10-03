import { User } from "lucide-react";
import type { MarkupVendor } from "../../types/pricemarkup.types";

interface VendorSummaryProps {
    vendor: MarkupVendor;
    className?: string;
}

// Store photo + "Name (Location)" + owner — used by the vendor cards and modals.
export default function VendorSummary({ vendor, className = "" }: VendorSummaryProps) {
    return (
        <div className={`pm-vendor-summary ${className}`}>
            <img className="pm-vendor-summary__image" src={vendor.image} alt={`${vendor.name} storefront`} />

            <div className="pm-vendor-summary__body">
                <p className="pm-vendor-summary__name">
                    <strong>{vendor.name}</strong> <em>({vendor.location})</em>
                </p>
                <p className="pm-vendor-summary__owner">
                    <User size={13} />
                    {vendor.owner}
                </p>
            </div>
        </div>
    );
}
