import type { InputHTMLAttributes } from "react";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

export default function Checkbox({ className = "", ...props }: CheckboxProps) {
    return (
        <input
            {...props}
            type="checkbox"
            className={["w-4 h-4 rounded accent-brand-600 border-black/20", className].filter(Boolean).join(" ")}
        />
    );
}
