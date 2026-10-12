import { X, Truck, PackageCheck, Clock3 } from "lucide-react";
import { tracking } from "../data/mockData";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";

export default function TrackingModal({
  open,
  orderId,
  onClose,
}: {
  open: boolean;
  orderId: string;
  onClose: () => void;
}) {
  const isMax760 = useMediaQuery("(max-width: 760px)");
  if (!open) return null;

  const mapUrl =
    "https://www.openstreetmap.org/export/embed.html?bbox=72.8100%2C19.0550%2C72.8750%2C19.0950&layer=mapnik&marker=19.0750%2C72.8420";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(40, 35, 30, 0.28)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onMouseDown={onClose}
    >
      <div
        style={{
          width: "min(900px, 95vw)",
          background: "#fff",
          borderRadius: 14,
          padding: "16px 18px 20px",
          boxShadow: "0 20px 70px rgba(0, 0, 0, 0.18)",
        }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 14,
            color: "#5d5852",
            marginBottom: 14,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <PackageCheck size={17} /> #{orderId} tracking
          </span>
          <button
            style={{ border: 0, background: "transparent", color: "#555" }}
            onClick={onClose}
          >
            <X style={{ width: 21 }} />
          </button>
        </div>
        <div
          style={{
            position: "relative",
            height: 330,
            borderRadius: 9,
            overflow: "hidden",
            background: "#e8ece5",
          }}
        >
          <iframe
            style={{
              width: "100%",
              height: "100%",
              border: 0,
              display: "block",
            }}
            title="Live delivery map"
            src={mapUrl}
            loading="lazy"
          />
          <div
            style={{
              position: "absolute",
              width: 56,
              height: 56,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              border: "6px solid #fff",
              boxShadow: "0 4px 12px #0002",
              left: "18%",
              top: "17%",
              background: "#ef5038",
            }}
          >
            <Truck size={21} />
          </div>
          <div
            style={{
              position: "absolute",
              width: 56,
              height: 56,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              border: "6px solid #fff",
              boxShadow: "0 4px 12px #0002",
              right: "18%",
              top: "35%",
              background: "#66c755",
            }}
          >
            <PackageCheck size={19} />
          </div>
          <div
            style={{
              ...{
                position: "absolute",
                left: "50%",
                bottom: 22,
                transform: "translateX(-50%)",
                background: "#fff",
                borderRadius: 6,
                boxShadow: "0 3px 12px #0002",
                padding: "14px 22px",
                display: "flex",
                gap: 90,
                alignItems: "center",
                fontSize: 11,
                minWidth: 240,
              },
              ...(isMax760 ? { gap: 25 } : {}),
            }}
          >
            <Clock3 size={13} /> ETA{" "}
            <b style={{ fontSize: 11 }}>{tracking.eta}</b>
          </div>
        </div>
        <div
          style={{
            ...{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginTop: 13,
            },
            ...(isMax760 ? { gridTemplateColumns: "1fr" } : {}),
          }}
        >
          <div>
            <small style={{ fontSize: 9, color: "#777" }}>From</small>
            <p
              style={{
                background: "#f3f2f0",
                borderRadius: 5,
                padding: 11,
                fontSize: 10,
                margin: "5px 0 0",
                minHeight: 42,
              }}
            >
              {tracking.from}
            </p>
          </div>
          <div>
            <small style={{ fontSize: 9, color: "#777" }}>To</small>
            <p
              style={{
                background: "#f3f2f0",
                borderRadius: 5,
                padding: 11,
                fontSize: 10,
                margin: "5px 0 0",
                minHeight: 42,
              }}
            >
              {tracking.to}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
