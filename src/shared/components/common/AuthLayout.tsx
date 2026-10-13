import type { ReactNode } from "react";
import Logo from "./Logo";

interface AuthLayoutProps {
  children: ReactNode;
}

const collage: string[] = [
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80",
  "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&q=80",
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
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
    <div className="min-h-screen w-full bg-cream relative overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="absolute inset-x-0 top-0 h-[280px] md:h-[320px] flex">
        {collage.map((src) => (
          <div key={src} className="flex-1 h-full overflow-hidden">
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <div
        className="absolute inset-x-[-10%] top-[190px] md:top-[230px] h-[70vh] rounded-t-[50%]"
        style={{
          backgroundColor: "#f8f8f8",
          backgroundImage: patternBackground,
          backgroundRepeat: "repeat",
          backgroundSize: "76px 76px",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 mt-28 w-full max-w-[480px] bg-white rounded-2xl shadow-soft p-8">
        <div className="flex items-center justify-center mb-4">
          <Logo size="text-base" />
        </div>

        {children}
      </div>
    </div>
  );
}
