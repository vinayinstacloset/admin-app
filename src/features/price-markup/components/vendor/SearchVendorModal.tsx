import { useMemo, useState } from "react";
import type { MarkupVendor } from "../../types/pricemarkup.types";
import MarkupModal from "../common/MarkupModal";
import SearchSelect from "../common/SearchSelect";
import {
  hoverStyle,
  focusStyle,
} from "../../../../shared/utils/interactiveStyle";

interface SearchVendorModalProps {
  vendors: MarkupVendor[];
  onContinue: (vendorId: string) => void;
  onClose: () => void;
}

// "Search vendor" — pick a vendor / store that has no markup yet.
export default function SearchVendorModal({
  vendors,
  onContinue,
  onClose,
}: SearchVendorModalProps) {
  const [query, setQuery] = useState("");
  const [vendorId, setVendorId] = useState<string | null>(null);

  const options = useMemo(() => {
    const term = query.trim().toLowerCase();

    return vendors
      .filter((vendor) =>
        `${vendor.name} ${vendor.location}`.toLowerCase().includes(term),
      )
      .map((vendor) => ({
        id: vendor.id,
        label: vendor.name,
        description: vendor.location,
        image: vendor.image,
      }));
  }, [vendors, query]);

  const selected = vendors.find((vendor) => vendor.id === vendorId);

  return (
    <MarkupModal title="Search vendor" onClose={onClose}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          padding: "16px 20px 6px",
        }}
      >
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 9,
          padding: 20,
        }}
      >
        <button
          type="button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 18px",
            border: "1px solid #2c2622",
            borderRadius: 6,
            fontSize: 12.5,
            fontWeight: 600,
            transition: "background 0.15s, border-color 0.15s, opacity 0.15s",
            background: "#fff",
            color: "#2c2622",
            fontFamily: "inherit",
            cursor: "pointer",
            height: 40,
          }}
          {...hoverStyle({ background: "#f7f5f3" }, { background: "#fff" })}
          onClick={onClose}
        >
          Discard
        </button>
        <button
          type="button"
          style={{
            ...{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 18px",
              border: "1px solid transparent",
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: 600,
              transition: "background 0.15s, border-color 0.15s, opacity 0.15s",
              background: "#6d4c36",
              color: "#fff",
              fontFamily: "inherit",
              cursor: "pointer",
              height: 40,
            },
            ...(!vendorId
              ? {
                  background: "#dcdcdc",
                  borderColor: "transparent",
                  color: "#a3a3a3",
                  cursor: "not-allowed",
                }
              : {}),
          }}
          {...hoverStyle(
            { background: "#5c4030" },
            { background: "#6d4c36" },
            true,
          )}
          disabled={!vendorId}
          onClick={() => vendorId && onContinue(vendorId)}
        >
          Continue
        </button>
      </div>
    </MarkupModal>
  );
}
