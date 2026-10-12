import type { Markup } from "../../types/pricemarkup.types";
import { useMarkupDraft } from "../../hooks/useMarkupDraft";
import MarkupModal from "../common/MarkupModal";
import MarkupTypeCards from "../common/MarkupTypeCards";
import PercentField from "../common/PercentField";
import {
  hoverStyle,
  focusStyle,
} from "../../../../shared/utils/interactiveStyle";

interface MarkupTypeModalProps {
  /** "Markup for all" or "<Vendor> markup". */
  title: string;
  initial?: Markup | null;
  submitLabel: string;
  onSubmit: (markup: Markup) => void;
  onClose: () => void;
}

// Discount / Hike picker with a percentage box — used for "Markup for all"
// and for a single vendor's markup on the Add Markup page.
export default function MarkupTypeModal({
  title,
  initial = null,
  submitLabel,
  onSubmit,
  onClose,
}: MarkupTypeModalProps) {
  const draft = useMarkupDraft(initial);

  return (
    <MarkupModal title={title} onClose={onClose} showClose maxWidth={560}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          padding: "16px 20px 0",
        }}
      >
        <MarkupTypeCards
          value={draft.kind}
          onChange={draft.setKind}
          size="lg"
        />
      </div>

      {draft.kind && (
        <>
          <hr
            style={{
              margin: "16px 20px 0",
              borderRight: 0,
              borderBottom: 0,
              borderLeft: 0,
              borderTop: "1px solid #e3e0dd",
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
            <PercentField
              kind={draft.kind}
              value={draft.percentRaw}
              onChange={draft.setPercentRaw}
            />
          </div>

          <div
            style={{
              display: "grid",
              gap: 9,
              padding: 20,
              gridTemplateColumns: "1fr",
            }}
          >
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
              onClick={() => draft.markup && onSubmit(draft.markup)}
            >
              {submitLabel}
            </button>
          </div>
        </>
      )}
    </MarkupModal>
  );
}
