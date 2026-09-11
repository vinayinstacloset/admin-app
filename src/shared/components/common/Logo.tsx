import { Colors } from "../../../themes/colors";

interface LogoProps {
    className?: string;
    size?: string;
}

export default function Logo({ className = "", size = "text-xl" }: LogoProps) {
    return (
        <div className={`flex items-center gap-1.5 select-none ${className}`}>
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
            >
                <path
                    d="M7 8L4 9.5V19.5C4 20.3 4.7 21 5.5 21H18.5C19.3 21 20 20.3 20 19.5V9.5L17 8"
                    stroke={Colors.semantic.brandAlt}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M7 8C7 5.79 9.24 4 12 4C14.76 4 17 5.79 17 8"
                    stroke={Colors.semantic.brandAlt}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                />
                <path
                    d="M3.5 10.5L7 8.7M20.5 10.5L17 8.7"
                    stroke={Colors.semantic.accent}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                />
            </svg>
            <span className={`font-semibold tracking-tight ${size}`}>
                <span className="text-ink">INSTA</span>
                <span className="text-brand-500">CLOSET</span>
            </span>
        </div>
    );
}
