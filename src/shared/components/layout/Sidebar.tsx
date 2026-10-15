import { useEffect, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";

import Logo from "../common/Logo";
import { ADMIN_NAV_SECTIONS } from "../../constants/navigation";
import Vector from "../../../assets/Vector.png";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onMobileClose: () => void;
}

export default function Sidebar({
  isCollapsed,
  onToggleCollapse,
  onMobileClose,
}: SidebarProps) {
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    const nav = navRef.current;

    if (!nav) return;

    const activeItem = nav.querySelector<HTMLElement>('a[aria-current="page"]');

    if (!activeItem) return;

    const savedScrollPos = sessionStorage.getItem("sidebar_scroll_pos");

    // Restore the previous position first, then ensure the current
    // route's active item is visible.
    if (savedScrollPos !== null) {
      nav.scrollTop = Number(savedScrollPos);
    }

    requestAnimationFrame(() => {
      const currentNav = navRef.current;

      if (!currentNav || !activeItem.isConnected) return;

      const navRect = currentNav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      if (itemRect.top < navRect.top) {
        currentNav.scrollTop -= navRect.top - itemRect.top;
      } else if (itemRect.bottom > navRect.bottom) {
        currentNav.scrollTop += itemRect.bottom - navRect.bottom;
      }

      sessionStorage.setItem(
        "sidebar_scroll_pos",
        currentNav.scrollTop.toString(),
      );
    });
  }, [location.pathname, isCollapsed]);

  const handleScroll = () => {
    if (navRef.current) {
      sessionStorage.setItem(
        "sidebar_scroll_pos",
        navRef.current.scrollTop.toString(),
      );
    }
  };

  return (
    <aside
      className={`flex h-full flex-col overflow-hidden border-r border-black/5 bg-white transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div
        className={`flex shrink-0 items-center border-b border-black/5 px-4 py-5 ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        {isCollapsed ? (
          <Link
            to="/admin-dashboard"
            aria-label="Go to dashboard"
            className="flex h-7 w-7 shrink-0 items-center justify-center text-white"
          >
            <img
              src={Vector}
              alt="Instacloset"
              width="22"
              height="22"
              className="h-[22px] w-[22px] shrink-0 object-contain"
            />
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
            className="hidden rounded-lg p-1 transition-colors hover:bg-gray-100 lg:block"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronsRight size={16} className="text-ink/30" />
            ) : (
              <ChevronsLeft size={16} className="text-ink/30" />
            )}
          </button>

          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-lg p-1 transition-colors hover:bg-gray-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <nav
        ref={navRef}
        onScroll={handleScroll}
        className="scrollbar-hide flex-1 overflow-y-auto px-2 py-5"
      >
        {ADMIN_NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-6">
            {!isCollapsed && (
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-ink/35">
                {section.label}
              </p>
            )}

            <ul className="space-y-1">
              {section.items.map((item) => {
                const IconComponent =
                  (Icons as unknown as Record<string, LucideIcon>)[item.icon] ??
                  Icons.Circle;

                return (
                  <li key={item.key}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/admin-dashboard"}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onMobileClose();
                        }
                      }}
                      title={isCollapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        [
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                          isActive
                            ? "bg-brand-50 font-semibold text-brand-700"
                            : "text-ink/60 hover:bg-cream hover:text-ink",
                          isCollapsed ? "justify-center" : "",
                        ].join(" ")
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <IconComponent
                            size={17}
                            className={
                              isActive ? "text-brand-600" : "text-ink/40"
                            }
                          />

                          {!isCollapsed && (
                            <span className="truncate">{item.label}</span>
                          )}
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
