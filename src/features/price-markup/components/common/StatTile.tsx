import type { CSSProperties, ReactNode } from "react";

export type StatTone = "orange" | "green" | "purple" | "blue";

interface StatTileProps {
  tone: StatTone;
  label: string;
  value: string | number;
  icon?: ReactNode;
  style?: CSSProperties;
}

const TONES: Record<StatTone, CSSProperties> = {
  orange: { background: "#fff1ec", color: "#ff6536" },
  green: { background: "#ecf9f0", color: "#39bd65" },
  purple: { background: "#f8efff", color: "#a335f1" },
  blue: { background: "#e9f2fd", color: "#0071e3" },
};

export default function StatTile({
  tone,
  label,
  value,
  icon,
  style,
}: StatTileProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        minWidth: 0,
        padding: "10px 8px",
        borderRadius: 8,
        ...TONES[tone],
        ...style,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontSize: 9.5,
          fontWeight: 500,
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
        }}
      >
        {icon}
        {label}
      </span>
      <strong style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.1 }}>
        {value}
      </strong>
    </div>
  );
}
