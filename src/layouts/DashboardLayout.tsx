import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Drawer } from "@mui/material";

import Sidebar from "../shared/components/layout/Sidebar";
import Topbar, { type Breadcrumb } from "../shared/components/layout/Topbar";
import { useUiStore } from "../store/zustand/uiStore";
import { useAuthStore } from "../store/zustand/authStore";
import { ADMIN_NAV_SECTIONS } from "../shared/constants/navigation";

const DRAWER_WIDTH_EXPANDED = 256;
const DRAWER_WIDTH_COLLAPSED = 80;

export interface DashboardOutletContext {
    setPageAction: (node: ReactNode) => void;
    setExtraCrumbs: (crumbs: Breadcrumb[]) => void;
}

// Maps every registered sidebar path to its label so the topbar
// breadcrumb can resolve "Overview", "Orders", etc. automatically.
const pathToLabel: Record<string, string> = ADMIN_NAV_SECTIONS.flatMap((section) => section.items).reduce(
    (acc, item) => {
        acc[item.path] = item.label;
        return acc;
    },
    {} as Record<string, string>,
);

export default function DashboardLayout() {
    const location = useLocation();
    const mainScrollRef = useRef<HTMLElement>(null);

    const { isMobileSidebarOpen, isSidebarCollapsed, setMobileSidebarOpen, toggleSidebar } = useUiStore();

    const admin = useAuthStore((state) => state.admin);

    const [pageAction, setPageAction] = useState<ReactNode>(null);
    const [extraCrumbs, setExtraCrumbs] = useState<Breadcrumb[]>([]);

    useLayoutEffect(() => {
        mainScrollRef.current?.scrollTo(0, 0);
        window.scrollTo(0, 0);
        // Reset per-page chrome whenever the route changes so a stale
        // action button / breadcrumb from the previous screen doesn't linger.
        setPageAction(null);
        setExtraCrumbs([]);
    }, [location.pathname]);

    const rootLabel = pathToLabel[location.pathname] ?? "Overview";

    const breadcrumbs: Breadcrumb[] = useMemo(() => {
        if (extraCrumbs.length > 0) {
            return [{ label: "Overview", to: "/admin-dashboard" }, ...extraCrumbs];
        }

        return [{ label: rootLabel }];
    }, [extraCrumbs, rootLabel]);

    const currentDrawerWidth = isSidebarCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED;

    const SidebarContent = () => (
        <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebar}
            onMobileClose={() => setMobileSidebarOpen(false)}
        />
    );

    return (
        <div
            className="flex h-screen overflow-hidden"
            style={{ backgroundColor: "#F4F2EF" }}
        >
            <Drawer
                anchor="left"
                variant="temporary"
                open={isMobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", lg: "none" },
                    zIndex: 40,
                    "& .MuiDrawer-paper": {
                        width: currentDrawerWidth,
                        boxSizing: "border-box",
                        border: "none",
                        backgroundColor: "transparent",
                        zIndex: 40,
                    },
                }}
            >
                <SidebarContent />
            </Drawer>

            <Drawer
                anchor="left"
                variant="permanent"
                open
                sx={{
                    display: { xs: "none", lg: "block" },
                    width: currentDrawerWidth,
                    flexShrink: 0,
                    transition: "width 200ms ease",
                    zIndex: 40,
                    "& .MuiDrawer-paper": {
                        position: "relative",
                        width: currentDrawerWidth,
                        boxSizing: "border-box",
                        overflowX: "hidden",
                        border: "none",
                        backgroundColor: "transparent",
                        transition: "width 200ms ease",
                        willChange: "width",
                        zIndex: 40,
                    },
                }}
            >
                <SidebarContent />
            </Drawer>

            <main
                ref={mainScrollRef}
                className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto h-full"
            >
                <div className="sticky top-0 z-30">
                    <Topbar
                        breadcrumbs={breadcrumbs}
                        action={pageAction}
                        onMenuClick={() => setMobileSidebarOpen(true)}
                        adminName={admin?.name ?? "Admin"}
                    />
                </div>

                <div className="px-4 sm:px-6 pb-8 pt-5">
                    <Outlet context={{ setPageAction, setExtraCrumbs } satisfies DashboardOutletContext} />
                </div>
            </main>
        </div>
    );
}
