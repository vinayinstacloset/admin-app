import type { ReactNode } from "react";

interface FormFieldProps {
    label: string;
    htmlFor?: string;
    error?: string;
    children: ReactNode;
    className?: string;
}

export default function FormField({ label, htmlFor, error, children, className = "" }: FormFieldProps) {
    return (
        <div className={className}>
            <label
                htmlFor={htmlFor}
                className="block text-xs text-ink/70 mb-1.5"
            >
                {label}
            </label>
            {children}
            {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
        </div>
    );
}
