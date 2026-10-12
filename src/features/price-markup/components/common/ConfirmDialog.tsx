import { useEffect, type ReactNode } from "react";
import {
  hoverStyle,
  focusStyle,
} from "../../../../shared/utils/interactiveStyle";

interface ConfirmDialogProps {
  message: ReactNode;
  /** Optional block above the message (e.g. the product being deleted). */
  header?: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
}

// "Are you sure you want to discard / delete …?" — No, Wait / Yes.
export default function ConfirmDialog({
  message,
  header,
  onCancel,
  onConfirm,
  cancelLabel = "No, Wait",
  confirmLabel = "Yes",
}: ConfirmDialogProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <div
      style={{
        fontFamily: "inherit",
        color: "#1f1a17",
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        overflowY: "auto",
        background: "rgba(31, 26, 23, 0.34)",
        zIndex: 1100,
      }}
    >
      <div
        style={{
          fontFamily: "inherit",
          color: "#1f1a17",
          width: "100%",
          maxWidth: 474,
          padding: "24px 20px 20px",
          borderRadius: 12,
          background: "#fff",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.18)",
        }}
        role="alertdialog"
        aria-modal="true"
      >
        {header && (
          <div style={{ marginBottom: 14, textAlign: "left" }}>{header}</div>
        )}
        <p style={{ margin: "0 0 20px", fontSize: 15, lineHeight: 1.5 }}>
          {message}
        </p>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
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
              fontWeight: 600,
              transition: "background 0.15s, border-color 0.15s, opacity 0.15s",
              background: "#fff",
              color: "#2c2622",
              fontFamily: "inherit",
              cursor: "pointer",
              height: 35,
              fontSize: 11.5,
            }}
            {...hoverStyle({ background: "#f7f5f3" }, { background: "#fff" })}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 18px",
              border: "1px solid transparent",
              borderRadius: 6,
              fontWeight: 600,
              transition: "background 0.15s, border-color 0.15s, opacity 0.15s",
              background: "#e77b7b",
              color: "#fff",
              fontFamily: "inherit",
              cursor: "pointer",
              height: 35,
              fontSize: 11.5,
            }}
            {...hoverStyle(
              { background: "#de6a6a" },
              { background: "#e77b7b" },
            )}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
