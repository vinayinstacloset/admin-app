import type { CSSProperties, ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Colors } from "../../../../themes/colors";

export type ButtonVariant =
    | "brand"
    | "blue"
    | "dark"
    | "success"
    | "danger"
    | "dangerSoft"
    | "secondary"
    | "outline"
    | "amber"
    | "unstyled";

export type ButtonSize = "none" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    loadingText?: string;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
    fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    brand: "text-white disabled:opacity-40 disabled:cursor-not-allowed",
    blue: "text-white disabled:opacity-40 disabled:cursor-not-allowed",
    dark: "text-white disabled:opacity-40 disabled:cursor-not-allowed",
    success: "text-white disabled:opacity-40 disabled:cursor-not-allowed",
    danger: "text-white disabled:opacity-40 disabled:cursor-not-allowed",
    dangerSoft: "disabled:opacity-50",
    secondary: "text-gray-700",
    outline: "border hover:bg-gray-50 text-gray-500",
    amber: "text-white disabled:opacity-50",
    unstyled: "",
};

const variantStyles: Record<ButtonVariant, CSSProperties> = {
    brand: { backgroundColor: Colors.primary.brand },
    blue: { backgroundColor: Colors.secondary.buttonBlue },
    dark: { backgroundColor: Colors.secondary.buttonDark },
    success: { backgroundColor: Colors.secondary.buttonSuccess },
    danger: { backgroundColor: Colors.secondary.buttonDanger },
    dangerSoft: { backgroundColor: Colors.secondary.buttonDangerSoft, color: Colors.secondary.buttonDanger },
    secondary: { backgroundColor: Colors.secondary.buttonSecondary },
    outline: { borderColor: Colors.secondary.buttonBorder },
    amber: { backgroundColor: Colors.secondary.amber },
    unstyled: {},
};

const sizeClasses: Record<ButtonSize, string> = {
    none: "",
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-4 py-3 text-sm rounded-lg",
};

export default function Button({
    children,
    variant = "unstyled",
    size = "none",
    loading = false,
    loadingText,
    icon,
    iconPosition = "left",
    fullWidth = false,
    disabled,
    className = "",
    type = "button",
    style,
    ...props
}: ButtonProps) {
    const content = loading && loadingText ? loadingText : children;

    return (
        <button
            {...props}
            type={type}
            disabled={disabled || loading}
            style={{ ...variantStyles[variant], ...style }}
            className={[
                "inline-flex items-center justify-center gap-2",
                "transition-colors hover:brightness-95",
                sizeClasses[size],
                variantClasses[variant],
                fullWidth ? "w-full" : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {loading && <Loader2 size={14} className="shrink-0 animate-spin" />}
            {!loading && iconPosition === "left" && icon}
            {content}
            {!loading && iconPosition === "right" && icon}
        </button>
    );
}
