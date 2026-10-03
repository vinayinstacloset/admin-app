import { useEffect } from "react";
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
  useEffect(() => {
    const handler = (event: KeyboardEvent) =>
      event.key === "Escape" && onCancel();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);
  return (
    <div className="oc-overlay">
      <div className="oc-delete-modal">
        <p>
          Are you sure you want to <strong>delete</strong>
          <br />
          <strong>“{name}”?</strong>
        </p>
        <div className="oc-delete-actions">
          <button type="button" className="oc-secondary" onClick={onCancel}>
            No, Wait
          </button>
          <button type="button" className="oc-danger" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
