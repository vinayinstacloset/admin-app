import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode;
    label?: string;
}

export default function IconButton({ icon, label, className = "", ...props }: IconButtonProps) {
    return (
        <button
            {...props}
            aria-label={label}
            title={label}
            className={[
                "inline-flex items-center justify-center w-9 h-9 rounded-full",
                "border border-black/5 bg-white text-ink/60 hover:text-ink hover:bg-cream transition-colors",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {icon}
        </button>
    );
}
