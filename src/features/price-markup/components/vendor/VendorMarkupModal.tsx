import { useState } from "react";
import { useMarkupDraft } from "../../hooks/useMarkupDraft";
import type { Markup, MarkupVendor } from "../../types/pricemarkup.types";
import { formatMoney } from "../../utils/pricemarkup.utils";
import ConfirmDialog from "../common/ConfirmDialog";
import { RevenueIcon, UnitSoldIcon } from "../common/MarkupIcons";
import MarkupModal from "../common/MarkupModal";
import MarkupTypeCards from "../common/MarkupTypeCards";
import PercentField from "../common/PercentField";
import StatTile from "../common/StatTile";
import VendorSummary from "../common/VendorSummary";
import { Package } from "lucide-react";
import {
  hoverStyle,
  focusStyle,
} from "../../../../shared/utils/interactiveStyle";

interface VendorMarkupModalProps {
  mode: "add" | "edit";
  vendor: MarkupVendor;
  initial?: Markup;
  onSave: (markup: Markup) => void;
  onClose: () => void;
}

// "Add vendor markup" / "Edit vendor markup".
export default function VendorMarkupModal({
  mode,
  vendor,
  initial,
  onSave,
  onClose,
}: VendorMarkupModalProps) {
  const draft = useMarkupDraft(initial);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const requestClose = mode === "add" ? () => setConfirmDiscard(true) : onClose;

  return (
    <>
      <MarkupModal
        title={mode === "add" ? "Add vendor markup" : "Edit vendor markup"}
        onClose={requestClose}
        hidden={confirmDiscard}
        maxWidth={505}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            padding: "16px 20px 0",
          }}
        >
          <VendorSummary vendor={vendor} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 15,
              height: 60,
              paddingBottom: 0,
              marginBottom: 16,
            }}
          >
            <StatTile
              tone="orange"
              label="TOTAL UNIT SOLD"
              value={vendor.totalUnitSold}
              icon={<UnitSoldIcon />}
            />
            <StatTile
              tone="green"
              label="TOTAL REVENUE"
              value={formatMoney(vendor.totalRevenue)}
              icon={<RevenueIcon />}
            />
            <StatTile
              tone="purple"
              label="TOTAL SKUS"
              value={vendor.totalSkus}
              icon={<Package size={12} />}
            />
          </div>
        </div>

        <hr
          style={{
            height: 4,
            margin: "4px 0 0",
            border: 0,
            background: "#eeeeec",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            padding: "16px 20px 0",
          }}
        >
          <p style={{ margin: "4px 0 0", fontSize: 13.5 }}>
            Select discount or hike
          </p>
          <MarkupTypeCards
            value={draft.kind}
            onChange={draft.setKind}
            size="sm"
          />
          {draft.kind && (
            <PercentField
              narrow
              kind={draft.kind}
              value={draft.percentRaw}
              onChange={draft.setPercentRaw}
            />
          )}
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
            onClick={requestClose}
          >
            {mode === "add" ? "Discard" : "Cancel"}
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
                transition:
                  "background 0.15s, border-color 0.15s, opacity 0.15s",
                background: "#6d4c36",
                color: "#fff",
                fontFamily: "inherit",
                cursor: "pointer",
                height: 40,
              },
              ...(!draft.isValid
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
            disabled={!draft.isValid}
            onClick={() => draft.markup && onSave(draft.markup)}
          >
            {mode === "add" ? "Save" : "Update"}
          </button>
        </div>
      </MarkupModal>

      {confirmDiscard && (
        <ConfirmDialog
          message={
            <>
              Are you sure you want to{" "}
              <strong style={{ fontWeight: 600 }}>discard Markup?</strong>
            </>
          }
          onCancel={() => setConfirmDiscard(false)}
          onConfirm={onClose}
        />
      )}
    </>
  );
}
