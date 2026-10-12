import { useState, type CSSProperties } from "react";

interface ThumbProps {
  src?: string;
  alt: string;
  fallback: string;
  size?: "square" | "wide";
}

// Thumbnail with a graceful fallback tile (first letter) for records that
// have no artwork yet, or whose image fails to load.
export default function Thumb({ src, alt, fallback, size }: ThumbProps) {
  const [failed, setFailed] = useState(false);
  const dimensions: CSSProperties =
    size === "square"
      ? { width: 28, height: 28 }
      : size === "wide"
        ? { width: 62, height: 27 }
        : {};

  if (!src || failed) {
    return (
      <span
        style={{
          flex: "none",
          borderRadius: 3,
          objectFit: "cover",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#e3ded9",
          color: "#6d4c36",
          fontWeight: 600,
          fontSize: 11,
          ...dimensions,
        }}
        role="img"
        aria-label={alt}
      >
        {fallback.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      style={{
        flex: "none",
        borderRadius: 3,
        objectFit: "cover",
        ...dimensions,
      }}
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}
