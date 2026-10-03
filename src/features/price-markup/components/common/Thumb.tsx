import { useState } from "react";

interface ThumbProps {
    src?: string;
    alt: string;
    fallback: string;
    className?: string;
}

// Thumbnail with a graceful fallback tile (first letter) for records that
// have no artwork yet, or whose image fails to load.
export default function Thumb({ src, alt, fallback, className = "" }: ThumbProps) {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <span className={`pm-thumb pm-thumb--fallback ${className}`} role="img" aria-label={alt}>
                {fallback.charAt(0).toUpperCase()}
            </span>
        );
    }

    return <img className={`pm-thumb ${className}`} src={src} alt={alt} onError={() => setFailed(true)} />;
}
