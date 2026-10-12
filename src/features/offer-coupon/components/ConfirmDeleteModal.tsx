import { useEffect } from "react";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";
import { hoverStyle, focusStyle } from "../../../shared/utils/interactiveStyle";
interface Props {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}
export default function ConfirmDeleteModal({
  name,
  onCancel,
  onConfirm,
}: Props) {
  const isMax560 = useMediaQuery("(max-width: 560px)");
  useEffect(() => {
    const handler = (event: KeyboardEvent) =>
      event.key === "Escape" && onCancel();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);
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
          width: "min(475px, calc(100vw - 32px))",
          background: "#fff",
          borderRadius: 9,
          padding: "28px 20px 24px",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>
          Are you sure you want to <strong>delete</strong>
          <br />
          <strong>“{name}”?</strong>
        </p>
        <div
          style={{
            ...{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginTop: 22,
            },
            ...(isMax560 ? { gridTemplateColumns: "1fr", gap: 8 } : {}),
          }}
        >
          <button
            type="button"
            style={{
              padding: "0 18px",
              borderRadius: 5,
              border: "1px solid #2e2a27",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              background: "#fff",
              color: "#5d5752",
              fontFamily: "inherit",
              height: 36,
            }}
            {...hoverStyle({ background: "#f6f4f2" }, { background: "#fff" })}
            onClick={onCancel}
          >
            No, Wait
          </button>
          <button
            type="button"
            style={{
              padding: "0 18px",
              border: "1px solid transparent",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              background: "#eb7a7d",
              color: "#fff",
              fontFamily: "inherit",
              height: 36,
              borderRadius: 5,
            }}
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
