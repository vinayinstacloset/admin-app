import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface MarkupModalProps {
  title: ReactNode;
  children: ReactNode;
  /** Called for the header "x" and the Escape key. */
  onClose?: () => void;
  /** Renders the header "x" button. */
  showClose?: boolean;
  /** Extra control on the right of the title (e.g. the red delete button). */
  headerAction?: ReactNode;
  /** Keeps the modal mounted (so form state survives) while a confirm dialog is on top. */
  hidden?: boolean;
  /** Max width of the dialog in px. */
  maxWidth?: number;
}

export default function MarkupModal({
  title,
  children,
  onClose,
  showClose = false,
  headerAction,
  hidden = false,
  maxWidth = 405,
}: MarkupModalProps) {
  useEffect(() => {
    if (!onClose || hidden) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, hidden]);

  return (
    <div
      style={{
        ...{
          fontFamily: "inherit",
          color: "#1f1a17",
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          overflowY: "auto",
          background: "rgba(31, 26, 23, 0.34)",
        },
        ...(hidden ? { display: "none" } : {}),
      }}
    >
      <div
        style={{
          fontFamily: "inherit",
          color: "#1f1a17",
          width: "100%",
          margin: "auto",
          borderRadius: 12,
          background: "#fff",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.18)",
          maxWidth,
        }}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "0 20px",
            padding: "20px 0 12px",
            borderBottom: "1px solid #e3e0dd",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>{title}</h3>
          {headerAction}
          {showClose && (
            <button
              type="button"
              style={{
                marginLeft: "auto",
                display: "inline-flex",
                padding: 0,
                border: 0,
                background: "transparent",
                color: "#3b3530",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
              aria-label="Close"
              onClick={onClose}
            >
              <X size={22} strokeWidth={1.4} />
            </button>
          )}
        </header>

        {children}
      </div>
    </div>
  );
}
