import type { ReactNode } from "react";
import Logo from "./Logo";

interface AuthLayoutProps {
  children: ReactNode;
}

const collage: string[] = [
  "https://instacloset-images.s3.ap-south-1.amazonaws.com/Static-images/Rectangle+86.jpg.jpeg",
  "https://instacloset-images.s3.ap-south-1.amazonaws.com/Static-images/Rectangle+88.jpg.jpeg",
  "https://instacloset-images.s3.ap-south-1.amazonaws.com/Static-images/Sculptural+Gold+Earrings+Editorial+Portrait.png",
  "https://instacloset-images.s3.ap-south-1.amazonaws.com/Static-images/Minimalist+Rust+Corduroy+Editorial+Portrait.png",
  "https://instacloset-images.s3.ap-south-1.amazonaws.com/Static-images/Rectangle+73.jpg.jpeg",
  "https://instacloset-images.s3.ap-south-1.amazonaws.com/Static-images/Aloof+in+Earth-Tone+Tailoring.png",
];

const fashionPattern = `
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <g fill="#d8d8d8" opacity="0.38">
    <path d="M13 8 18 5 23 8 28 6 34 12 29 18 26 15 26 27 15 27 15 15 12 18 7 12Z" transform="rotate(-14 21 16)"/>
    <path d="M61 9H76L78 25H59Z" transform="rotate(12 68 17)"/>
    <path d="M64 10Q68 1 73 10" fill="none" stroke="#d8d8d8" stroke-width="2.2"/>
    <path d="M15 52Q15 47 19 47T22 53L8 62H33L22 53" fill="none" stroke="#d8d8d8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-12 20 55)"/>
    <path d="M65 38 70 35 75 38 73 44 80 59H60L67 44Z" transform="rotate(10 70 47)"/>
    <path d="M12 79Q17 78 20 72L24 77 32 81V85H11Q8 83 12 79Z" transform="rotate(-8 20 79)"/>
    <path d="M51 76 61 70 71 76 68 81V88H53V81Z" transform="rotate(18 61 79)"/>
    <path d="M83 42 88 45 85 52 80 49Z"/>
  </g>
  <g fill="none" stroke="#d8d8d8" stroke-width="1.5" opacity="0.38">
    <path d="M43 15 48 18 44 23 39 20Z"/>
    <path d="M40 43Q44 38 48 43L44 48Z"/>
    <path d="M44 68 49 65 52 70 47 73Z"/>
    <path d="M87 72Q83 69 80 73L84 78Z"/>
    <path d="M8 35 12 32 15 37 11 40Z"/>
  </g>
</svg>`;

const patternBackground = `url("data:image/svg+xml,${encodeURIComponent(
  fashionPattern,
)}")`;

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cream px-4 py-8 sm:py-10">
      {/* Fashion image collage */}
      <div className="absolute inset-x-0 top-0 z-0 flex h-[230px] overflow-hidden sm:h-[280px] md:h-[320px]">
        {collage.map((src) => (
          <div key={src} className="h-full min-w-0 flex-1 overflow-hidden">
            <img
              src={src}
              alt=""
              aria-hidden="true"
              loading="eager"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Responsive curved SVG-pattern background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] overflow-hidden"
        style={{
          top: "clamp(175px, 27vh, 250px)",
        }}
      >
        <div
          className="absolute bottom-0 left-[-25%] right-[-25%] top-0"
          style={{
            backgroundColor: "#f8f8f8",
            backgroundImage: patternBackground,
            backgroundRepeat: "repeat",
            backgroundSize: "76px 76px",
            backgroundPosition: "center top",
            borderRadius: "50% 50% 0 0 / 282px 282px 0 0",
          }}
        />
      </div>

      {/* Login content */}
      <div className="relative z-10 mt-28 w-full max-w-[480px] rounded-2xl bg-white p-5 shadow-soft sm:p-8">
        <div className="mb-4 flex items-center justify-center">
          <Logo size="text-base" />
        </div>

        {children}
      </div>
    </div>
  );
}
