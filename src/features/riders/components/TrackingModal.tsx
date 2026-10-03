import { X, Truck, PackageCheck, Clock3 } from "lucide-react";
import { tracking } from "../data/mockData";

export default function TrackingModal({
  open,
  orderId,
  onClose,
}: {
  open: boolean;
  orderId: string;
  onClose: () => void;
}) {
  if (!open) return null;

  const mapUrl =
    "https://www.openstreetmap.org/export/embed.html?bbox=72.8100%2C19.0550%2C72.8750%2C19.0950&layer=mapnik&marker=19.0750%2C72.8420";

  return (
    <div className="rider-modal-backdrop" onMouseDown={onClose}>
      <div
        className="tracking-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="tracking-title">
          <span>
            <PackageCheck size={17} /> #{orderId} tracking
          </span>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="real-map">
          <iframe title="Live delivery map" src={mapUrl} loading="lazy" />
          <div className="map-route-marker truck">
            <Truck size={21} />
          </div>
          <div className="map-route-marker destination">
            <PackageCheck size={19} />
          </div>
          <div className="map-eta">
            <Clock3 size={13} /> ETA <b>{tracking.eta}</b>
          </div>
        </div>
        <div className="tracking-addresses">
          <div>
            <small>From</small>
            <p>{tracking.from}</p>
          </div>
          <div>
            <small>To</small>
            <p>{tracking.to}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
