import type { ButtonHTMLAttributes } from "react";

type TabsButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function TabsButton({ className = "", type = "button", ...props }: TabsButtonProps) {
    return (
        <button
            {...props}
            type={type}
            className={className}
        />
    );
}
