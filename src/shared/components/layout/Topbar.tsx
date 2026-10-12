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
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-ink/80 shadow-sm transition-colors hover:bg-[#f5f5f5]"
      >
        <Bell size={18} />
      </button>

      <img
        src="https://picsum.photos/seed/admin-profile/64/64"
        alt="User profile"
        className="h-8 w-8 shrink-0 rounded-full object-cover shadow-sm ring-1 ring-black/5"
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
  const renderDefaultActions = showDefaultActions && !replaceDefaultActions;
  const hasActions = renderDefaultActions || Boolean(action);

  return (
    <header className="flex min-h-16 flex-wrap items-center gap-x-3 gap-y-2 bg-[#eeeeee] px-4 py-3 sm:px-6 lg:flex-nowrap lg:py-2">
      <button
        type="button"
        onClick={onMenuClick}
        className="order-1 shrink-0 rounded-lg p-1.5 text-ink/60 hover:bg-black/5 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <nav
        aria-label="Breadcrumb"
        className="order-3 w-full min-w-0 sm:order-2 sm:w-auto sm:flex-1"
      >
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-base text-ink/50 sm:text-lg lg:text-xl">
          {breadcrumbs.map((crumb, index) => (
            <li
              key={`${index}-${typeof crumb.label === "string" ? crumb.label : "breadcrumb"}`}
              className="flex min-w-0 max-w-full items-center gap-1.5"
            >
              {index > 0 && (
                <ChevronRight size={13} className="shrink-0 text-ink/25" />
              )}

              {crumb.to ? (
                <Link
                  to={crumb.to}
                  className="break-words transition-colors hover:text-ink"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="min-w-0 break-words font-semibold text-ink">
                  {crumb.label}
                </span>
              )}

              {crumb.badge && (
                <span
                  className={`ml-1 shrink-0 rounded-full px-2.5 py-1 text-[11px] ${
                    crumb.badge === "New"
                      ? "bg-[#fff9df] text-[#e6b900]"
                      : crumb.badge === "Packing"
                        ? "bg-[#fffbe5] text-[#e3bd00]"
                        : crumb.badge === "Approved"
                          ? "bg-[#ecfbf2] text-[#37b86a]"
                          : crumb.badge === "Ready" ||
                              crumb.badge === "Ready for delivery"
                            ? "bg-[#ecfbf1] text-[#22b962]"
                            : crumb.badge === "On the way"
                              ? "bg-[#f5eaff] text-[#a24ae8]"
                              : crumb.badge === "Delivered"
                                ? "bg-[#fff0eb] text-[#ef765c]"
                                : crumb.badge === "Exchanged"
                                  ? "bg-[#eaf4ff] text-[#438fe9]"
                                  : crumb.badge === "Rejected"
                                    ? "bg-[#fff0f0] text-[#ed7373]"
                                    : crumb.badge === "Refunded"
                                      ? "bg-[#ecfbf2] text-[#39bd65]"
                                      : crumb.badge === "Collected"
                                        ? "bg-[#e8f3ff] text-[#1682e8]"
                                        : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {crumb.badge}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {hasActions && (
        <div className="order-2 ml-auto flex max-w-full flex-wrap items-center justify-end gap-2 rounded-xl bg-white px-2 py-1.5 shadow-sm sm:order-3 sm:gap-3 sm:px-4 sm:py-2 md:gap-5">
          {renderDefaultActions && <DefaultHeaderActions />}
          {action}
        </div>
      )}
    </header>
  );
}
