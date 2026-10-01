import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Bell, ChevronRight, Menu } from "lucide-react";

export interface Breadcrumb {
    label: string;
    to?: string;
    badge?: string;
}

interface TopbarProps {
    breadcrumbs: Breadcrumb[];
    action?: ReactNode;
    onMenuClick?: () => void;
    showDefaultActions?: boolean;
}

function DefaultHeaderActions() {
    return (
        <div className="flex items-center gap-3 sm:gap-4">
            <button
                type="button"
                aria-label="Notifications"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink/80 shadow-sm transition-colors hover:bg-[#f5f5f5]"
            >
                <Bell size={18} />
            </button>
            <img
                src="https://i.pravatar.cc/64?img=68"
                alt="User profile"
                className="h-8 w-8 rounded-full object-cover shadow-sm ring-1 ring-black/5"
            />
        </div>
    );
}

export default function Topbar({
    breadcrumbs,
    action,
    onMenuClick,
    showDefaultActions = true,
}: TopbarProps) {
    return (
        <header className="flex items-center justify-between gap-4 h-16 px-4 sm:px-6 bg-[#eeeeee]">
            <div className="flex items-center gap-3 min-w-0">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="lg:hidden p-1.5 rounded-lg hover:bg-black/5 text-ink/60 shrink-0"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>

                <div className="flex items-center gap-1.5 text-xl text-ink/50 min-w-0 overflow-hidden">
                    {breadcrumbs.map((crumb, index) => (
                        <span
                            key={`${crumb.label}-${index}`}
                            className="flex items-center gap-1.5 min-w-0"
                        >
                            {index > 0 && (
                                <ChevronRight
                                    size={13}
                                    className="text-ink/25 shrink-0"
                                />
                            )}
                            {crumb.to ? (
                                <Link
                                    to={crumb.to}
                                    className="truncate hover:text-ink transition-colors"
                                >
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="truncate font-semibold text-ink">{crumb.label}</span>
                            )}
                            {crumb.badge && (
                                <span className="ml-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[11px] shrink-0">
                                    {crumb.badge}
                                </span>
                            )}
                        </span>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl px-2 sm:px-4 py-1.5 sm:py-2 flex items-center flex-wrap justify-end gap-2 sm:gap-3 md:gap-5 shadow-sm max-w-full">
                { <DefaultHeaderActions />}
                {action}
            </div>
        </header>
    );
}
