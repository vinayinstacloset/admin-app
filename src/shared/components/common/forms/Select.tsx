import type { SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean;
}

export default function Select({ className = "", error = false, children, ...props }: SelectProps) {
    return (
        <select
            {...props}
            aria-invalid={error || undefined}
            className={[
                "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition",
                "focus:border-brand-400 focus:ring-2 focus:ring-brand-100",
                "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70",
                error ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-black/10",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {children}
        </select>
    );
}
