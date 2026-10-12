import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  hoverStyle,
  focusStyle,
} from "../../../../shared/utils/interactiveStyle";

interface SuccessModalProps {
  title?: string;
  message: string;
  buttonLabel?: string;
  onClose: () => void;
}

// Confirms that an add / edit / delete actually went through. Closing it
// never navigates anywhere by itself — the caller decides what happens next.
export default function SuccessModal({
  title = "Success",
  message,
  buttonLabel = "Done",
  onClose,
}: SuccessModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 380,
          padding: "30px 24px 24px",
          borderRadius: 12,
          background: "#fff",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.18)",
        }}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            marginBottom: 14,
            borderRadius: "50%",
            background: "#ecf9f0",
            color: "#39bd65",
          }}
        >
          <CheckCircle2 size={30} strokeWidth={1.6} />
        </span>
        <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 600 }}>
          {title}
        </h3>
        <p style={{ margin: "0 0 22px", fontSize: 13, color: "#6b6560" }}>
          {message}
        </p>

        <button
          type="button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: 40,
            padding: "0 18px",
            border: "1px solid transparent",
            borderRadius: 6,
            fontSize: 12.5,
            fontWeight: 600,
            transition: "background 0.15s, border-color 0.15s, opacity 0.15s",
            background: "#6d4c36",
            color: "#fff",
            width: "100%",
            fontFamily: "inherit",
            cursor: "pointer",
          }}
          {...hoverStyle(
            { background: "#5c4030" },
            { background: "#6d4c36" },
            true,
          )}
          onClick={onClose}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
