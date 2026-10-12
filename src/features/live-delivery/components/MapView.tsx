import { MapPin } from "lucide-react";
import { cityCenters } from "../data/mockData";
import { buildMapUrl } from "../utils/map.utils";
import type { Rider } from "../types/livedelivery.types";

export default function MapView({
  city,
  riders,
}: {
  city: string;
  riders: Rider[];
}) {
  const center = cityCenters[city] ?? cityCenters.Hyderabad;
  return (
    <div
      style={{
        position: "relative",
        height: 350,
        overflow: "hidden",
        borderRadius: 8,
        background: "#dfeadf",
      }}
    >
      <iframe
        title="Live delivery map"
        src={buildMapUrl(center.bbox)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
        loading="lazy"
      />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {riders.slice(0, 5).map((rider, index) => (
          <div
            key={rider.id}
            style={{
              position: "absolute",
              left: `${30 + index * 14}%`,
              top: `${20 + (index % 3) * 24}%`,
              transform: "translate(-50%,-50%)",
              padding: "5px 8px",
              borderRadius: 4,
              background: index === 2 ? "#ef7171" : "#39bd65",
              color: "#fff",
              fontSize: 8,
              fontWeight: 700,
              boxShadow: "0 2px 5px rgba(0,0,0,.16)",
            }}
          >
            {rider.name.split(" ")[0]} ({rider.id.toUpperCase()})
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            right: 10,
            bottom: 10,
            padding: "8px 10px",
            borderRadius: 7,
            background: "rgba(255,255,255,.96)",
            color: "#555",
            fontSize: 9,
            display: "grid",
            gap: 6,
          }}
        >
          <span>
            <i
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#39bd65",
                marginRight: 6,
              }}
            />
            On time
          </span>
          <span>
            <i
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#ef7171",
                marginRight: 6,
              }}
            />
            Delayed
          </span>
        </div>
      </div>
    </div>
  );
}
