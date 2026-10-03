import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

interface Props {
  message: string;
  onClose: () => void;
}
export default function SuccessModal({ message, onClose }: Props) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) =>
      event.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div className="oc-overlay">
      <div className="oc-success-modal">
        <button className="oc-modal-x" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <CheckCircle2 className="oc-success-icon" size={42} />
        <h3>Success</h3>
        <p>{message}</p>
        <button
          type="button"
          className="oc-primary oc-success-button"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
}
