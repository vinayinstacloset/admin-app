import { BadgePercent, Ribbon, X } from "lucide-react";
import type { OfferInput } from "../types/offerCoupon.types";

interface Props {
  onClose: () => void;
  onSelect: (type: OfferInput["offerType"]) => void;
}

export default function OfferTypeModal({ onClose, onSelect }: Props) {
  return (
    <div className="oc-overlay">
      <div className="oc-offer-type-modal">
        <div className="oc-modal-header">
          <h3>Select type</h3>
          <button
            type="button"
            className="oc-close-button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        <div className="oc-divider" />
        <div className="oc-offer-type-options">
          <button type="button" className="oc-offer-type-card" onClick={() => onSelect("flash-card")}>
            <Ribbon size={48} strokeWidth={1.6} />
            <span>FLASH CARD <b>→</b></span>
          </button>
          <button type="button" className="oc-offer-type-card" onClick={() => onSelect("deal")}>
            <BadgePercent size={48} strokeWidth={1.6} />
            <span>DEAL <b>→</b></span>
          </button>
        </div>
      </div>
    </div>
  );
}
