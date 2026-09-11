import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "./DashboardLayout";

// Lets any dashboard screen push a page-specific action button
// (e.g. "Export", "Reassign rider") and extra breadcrumb segments
// (e.g. "#OD-5490 > Vendor details") up into the shared Topbar.
export function useDashboardOutletContext(): DashboardOutletContext {
    return useOutletContext<DashboardOutletContext>();
}
