import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export default function Input({ className = "", error = false, ...props }: InputProps) {
    return (
        <input
            {...props}
            aria-invalid={error || props["aria-invalid"] ? true : undefined}
            className={[
                "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition",
                "placeholder:text-ink/35 focus:border-brand-400 focus:ring-2 focus:ring-brand-100",
                "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70",
                error ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-black/10",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        />
    );
}
