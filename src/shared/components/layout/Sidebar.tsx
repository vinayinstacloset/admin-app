import { useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";

import Logo from "../common/Logo";
import { ADMIN_NAV_SECTIONS } from "../../constants/navigation";

interface SidebarProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    onMobileClose: () => void;
}

export default function Sidebar({ isCollapsed, onToggleCollapse, onMobileClose }: SidebarProps) {
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const savedScrollPos = sessionStorage.getItem("sidebar_scroll_pos");
        if (navRef.current && savedScrollPos) {
            navRef.current.scrollTop = Number(savedScrollPos);
        }
    }, []);

    const handleScroll = () => {
        if (navRef.current) {
            sessionStorage.setItem("sidebar_scroll_pos", navRef.current.scrollTop.toString());
        }
    };

    return (
        <aside
            className={`flex flex-col h-full bg-white border-r border-black/5 overflow-hidden transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"
                }`}
        >
            <div
                className={`flex items-center px-4 py-5 border-b border-black/5 shrink-0 ${isCollapsed ? "justify-center" : "justify-between"
                    }`}
            >
                {isCollapsed ? (
                    <Link
                        to="/admin-dashboard"
                        aria-label="Go to dashboard"
                        className="flex items-center justify-center w-7 h-7 rounded-md bg-brand-600 text-white shrink-0"
                    >
                        <Icons.Shirt size={15} />
                    </Link>
                ) : (
                    <Link
                        to="/admin-dashboard"
                        onClick={() => {
                            if (window.innerWidth < 1024) onMobileClose();
                        }}
                        className="cursor-pointer"
                        aria-label="Go to dashboard"
                    >
                        <Logo size="text-base" />
                    </Link>
                )}

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block"
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <ChevronsRight
                                size={16}
                                className="text-ink/30"
                            />
                        ) : (
                            <ChevronsLeft
                                size={16}
                                className="text-ink/30"
                            />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onMobileClose}
                        className="lg:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            <nav
                ref={navRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto scrollbar-hide px-2 py-5"
            >
                {ADMIN_NAV_SECTIONS.map((section) => (
                    <div
                        key={section.label}
                        className="mb-6"
                    >
                        {!isCollapsed && (
                            <p className="px-3 mb-2 text-[10px] font-bold tracking-wider text-ink/35 uppercase">
                                {section.label}
                            </p>
                        )}
                        <ul className="space-y-1">
                            {section.items.map((item) => {
                                const IconComponent =
                                    (Icons as unknown as Record<string, LucideIcon>)[item.icon] ?? Icons.Circle;

                                return (
                                    <li key={item.key}>
                                        <NavLink
                                            to={item.path}
                                            end={item.path === "/admin-dashboard"}
                                            onClick={() => {
                                                if (navRef.current) {
                                                    sessionStorage.setItem(
                                                        "sidebar_scroll_pos",
                                                        navRef.current.scrollTop.toString()
                                                    );
                                                }
                                                if (window.innerWidth < 1024) onMobileClose();
                                            }}
                                            title={isCollapsed ? item.label : undefined}
                                            className={({ isActive }) =>
                                                [
                                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                                                    isActive
                                                        ? "bg-brand-50 text-brand-700 font-semibold"
                                                        : "text-ink/60 hover:bg-cream hover:text-ink",
                                                    isCollapsed ? "justify-center" : "",
                                                ].join(" ")
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <IconComponent
                                                        size={17}
                                                        className={isActive ? "text-brand-600" : "text-ink/40"}
                                                    />
                                                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                                                </>
                                            )}
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    );
}