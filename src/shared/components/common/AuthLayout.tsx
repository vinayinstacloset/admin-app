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

// A faint, repeating fashion-doodle motif (bag / hanger / shirt) used to
// texture the lower cream section, echoing the collage above it.
const patternSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <g fill="none" stroke="#26201B" stroke-width="1.4" opacity="0.06">
    <path d="M20 24l-6 4v20a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V28l-6-4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20 24a6 6 0 0 1 12 0" stroke-linecap="round"/>
    <path d="M74 18a5 5 0 1 1 10 0" stroke-linecap="round"/>
    <path d="M56 26l23-8 23 8-9 6H65z" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M65 32v26h28V32" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M30 78h20l4 24H26z" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M35 78v-6a5 5 0 0 1 10 0v6" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="92" cy="86" r="10" stroke-linecap="round"/>
    <path d="M92 76v-6m-5 3 5 3 5-3" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`);

// Shared shell for every auth screen (login, register, forgot password).
// A photo collage strip up top with a soft rounded overlay, and a
// centered white card that holds the actual form.
export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full bg-cream relative overflow-hidden flex items-center justify-center px-4 py-10">
            <div className="absolute inset-x-0 top-0 h-[280px] md:h-[320px] flex">
                {collage.map((src) => (
                    <div
                        key={src}
                        className="flex-1 h-full overflow-hidden"
                    >
                        <img
                            src={src}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            <div
                className="absolute inset-x-[-10%] top-[190px] md:top-[230px] h-[70vh] bg-cream rounded-t-[50%]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,${patternSvg}")`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "120px 120px",
                }}
            />

            <div className="relative z-10 w-full max-w-[420px] bg-white rounded-2xl shadow-soft p-8">
                <div className="flex items-center justify-center mb-6">
                    <Logo size="text-base" />
                </div>
                {children}
            </div>
        </div>
    );
}
