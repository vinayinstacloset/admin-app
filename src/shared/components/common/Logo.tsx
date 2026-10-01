import Vector from "../../../assets/Vector.png";

interface LogoProps {
    className?: string;
    size?: string;
}

export default function Logo({ className = "", size = "text-xl" }: LogoProps) {
    return (
        <div className={`flex items-center gap-1 select-none ${className}`}>
            <img
                src={Vector}
                alt="Instacloset"
                width="22"
                height="22"
                className="h-[22px] w-[22px] shrink-0 object-contain"
            />

            <span className={`font-semibold tracking-tight ${size}`}>
                <span className="text-ink">INSTA</span>
                <span className="text-brand-500">CLOSET</span>
            </span>
        </div>
    );
}