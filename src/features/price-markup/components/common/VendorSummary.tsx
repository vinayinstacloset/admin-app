import { User } from "lucide-react";
import type { CSSProperties } from "react";
import type { MarkupVendor } from "../../types/pricemarkup.types";

interface VendorSummaryProps {
  vendor: MarkupVendor;
  style?: CSSProperties;
}

// Store photo + "Name (Location)" + owner — used by the vendor cards and modals.
export default function VendorSummary({ vendor, style }: VendorSummaryProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 0,
        ...style,
      }}
    >
      <img
        style={{
          flex: "none",
          width: 128,
          height: 60,
          borderRadius: 4,
          objectFit: "cover",
        }}
        src={vendor.image}
        alt={`${vendor.name} storefront`}
      />

      <div>
        <p style={{ margin: "0 0 6px", fontSize: 12 }}>
          <strong>{vendor.name}</strong>{" "}
          <em style={{ fontSize: 11.5, color: "#4b4540" }}>
            ({vendor.location})
          </em>
        </p>
        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            margin: 0,
            fontSize: 11,
          }}
        >
          <User size={13} />
          {vendor.owner}
        </p>
      </div>
    </div>
  );
}
