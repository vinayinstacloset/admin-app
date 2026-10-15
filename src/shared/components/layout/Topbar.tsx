import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronRight, LogOut, Menu, UserRound } from "lucide-react";
import Button from "../common/buttons/Button";
import { authService } from "../../../features/login/api/authApi";

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
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!logoutModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoggingOut) {
        setLogoutModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [logoutModalOpen, isLoggingOut]);

  const confirmLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();

      setProfileOpen(false);
      setLogoutModalOpen(false);
      setIsLoggingOut(false);

      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-ink/80 shadow-sm transition-colors hover:bg-[#f5f5f5]"
        >
          <Bell size={18} />
        </button>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((open) => !open)}
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-[#765038]/30"
          >
            <img
              src="https://picsum.photos/seed/admin-profile/64/64"
              alt="Admin profile"
              className="h-8 w-8 shrink-0 rounded-full object-cover shadow-sm ring-1 ring-black/5"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-lg border border-black/10 bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/admin-dashboard/settings");
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-ink transition-colors hover:bg-[#f5f1ee]"
              >
                <UserRound size={16} />
                Go to Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  setLogoutModalOpen(true);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {logoutModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !isLoggingOut) {
                setLogoutModalOpen(false);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-modal-title"
              className="relative z-[100000] w-full max-w-[420px] rounded-xl bg-white p-6 shadow-2xl"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="px-2 text-center">
                <h2
                  id="logout-modal-title"
                  className="text-lg font-semibold text-ink"
                >
                  Confirm Logout
                </h2>

                <p className="mt-2 text-sm leading-6 text-ink/65">
                  Are you sure you want to logout?
                </p>
              </div>

              <div className="mt-6 flex justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  disabled={isLoggingOut}
                  onClick={() => setLogoutModalOpen(false)}
                >
                  No, wait
                </Button>

                <Button
                  type="button"
                  variant="danger"
                  size="md"
                  loading={isLoggingOut}
                  onClick={confirmLogout}
                >
                  Yes
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
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
