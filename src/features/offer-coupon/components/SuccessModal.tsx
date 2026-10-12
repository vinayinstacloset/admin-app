import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";
import { hoverStyle, focusStyle } from "../../../shared/utils/interactiveStyle";

interface Props {
  message: string;
  onClose: () => void;
}
export default function SuccessModal({ message, onClose }: Props) {
  const isMax560 = useMediaQuery("(max-width: 560px)");
  useEffect(() => {
    const handler = (event: KeyboardEvent) =>
      event.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div
      style={{
        ...{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "rgba(0, 0, 0, 0.23)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        },
        ...(isMax560 ? { padding: 12 } : {}),
      }}
    >
      <div
        style={{
          width: "min(390px, calc(100vw - 32px))",
          background: "#fff",
          padding: 30,
          textAlign: "center",
          position: "relative",
          boxSizing: "border-box",
          borderRadius: 11,
        }}
      >
        <button
          style={{
            position: "absolute",
            top: 11,
            right: 11,
            border: 0,
            background: "transparent",
            color: "#777",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <CheckCircle2
          size={42}
          style={{ color: "#32ba68", marginBottom: 8, justifySelf: "center" }}
        />
        <h3 style={{ margin: "0 0 5px", fontSize: 17 }}>Success</h3>
        <p style={{ margin: "0 0 20px", color: "#69635f", fontSize: 12 }}>
          {message}
        </p>
        <button
          type="button"
          style={{
            height: 38,
            padding: "0 18px",
            borderRadius: 5,
            border: "1px solid transparent",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            background: "#76523b",
            color: "#fff",
            width: "100%",
            fontFamily: "inherit",
          }}
          {...hoverStyle(
            { background: "#694831" },
            { background: "#76523b" },
            true,
          )}
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
}
