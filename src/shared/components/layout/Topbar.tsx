import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Bell, ChevronRight, Menu } from "lucide-react";

export interface Breadcrumb {
    label: ReactNode;
    to?: string;
    badge?: string;
}

interface TopbarProps {
    breadcrumbs: Breadcrumb[];
    action?: ReactNode;
    onMenuClick?: () => void;
    showDefaultActions?: boolean;
    replaceDefaultActions?: boolean;
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
    replaceDefaultActions = false,
}: TopbarProps) {
    return (
        <header className="flex h-16 items-center justify-between gap-4 bg-[#eeeeee] px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="shrink-0 rounded-lg p-1.5 text-ink/60 hover:bg-black/5 lg:hidden"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>

                <div className="flex min-w-0 items-center gap-1.5 overflow-hidden text-xl text-ink/50">
                    {breadcrumbs.map((crumb, index) => (
                        <div
                            key={`${index}-${typeof crumb.label === "string" ? crumb.label : "breadcrumb"}`}
                            className="flex min-w-0 items-center gap-1.5"
                        >
                            {index > 0 && (
                                <ChevronRight
                                    size={13}
                                    className="shrink-0 text-ink/25"
                                />
                            )}

                            {crumb.to ? (
                                <Link
                                    to={crumb.to}
                                    className="truncate transition-colors hover:text-ink"
                                >
                                    {crumb.label}
                                </Link>
                            ) : (
                                <div className="min-w-0 font-semibold text-ink">
                                    {crumb.label}
                                </div>
                            )}

                            {crumb.badge && (
                                <span className="ml-1 shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-[11px] text-orange-700">
                                    {crumb.badge}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex max-w-full flex-wrap items-center justify-end gap-2 rounded-xl bg-white px-2 py-1.5 shadow-sm sm:gap-3 sm:px-4 sm:py-2 md:gap-5">
                {showDefaultActions && <DefaultHeaderActions />}
                {action}
            </div>
        </header>
    );
}