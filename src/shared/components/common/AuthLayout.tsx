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

            <div className="absolute inset-x-[-10%] top-[190px] md:top-[230px] h-[70vh] bg-cream rounded-t-[50%] " />

            <div className="relative z-10 w-full max-w-[420px] bg-white rounded-2xl shadow-soft p-8">
                <div className="flex items-center justify-center mb-6">
                    <Logo size="text-base" />
                </div>
                {children}
            </div>
        </div>
    );
}
