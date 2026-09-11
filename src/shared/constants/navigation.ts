export interface NavItem {
    key: string;
    label: string;
    icon: string;
    path: string;
}

export interface NavSectionConfig {
    label: string;
    items: NavItem[];
}

// Single source of truth for the admin sidebar. Both Sidebar and
// DashboardLayout (for breadcrumbs) read from this list.
export const ADMIN_NAV_SECTIONS: NavSectionConfig[] = [
    {
        label: "Main",
        items: [
            { key: "overview", label: "Overview", icon: "LayoutGrid", path: "/admin-dashboard" },
            { key: "store", label: "Store", icon: "Store", path: "/admin-dashboard/store" },
            { key: "orders", label: "Orders", icon: "ClipboardList", path: "/admin-dashboard/orders" },
            { key: "catalogue", label: "Catalogue", icon: "BookOpen", path: "/admin-dashboard/catalogue" },
            { key: "approvals", label: "Approvals", icon: "CheckSquare", path: "/admin-dashboard/approvals" },
        ],
    },
    {
        label: "Network",
        items: [
            { key: "customers", label: "Customers", icon: "Users", path: "/admin-dashboard/customers" },
            { key: "admins", label: "Admins", icon: "ShieldCheck", path: "/admin-dashboard/admins" },
            { key: "vendor", label: "Vendor", icon: "Store", path: "/admin-dashboard/vendor" },
            { key: "riders", label: "Riders", icon: "Bike", path: "/admin-dashboard/riders" },
            { key: "support", label: "Support", icon: "Headphones", path: "/admin-dashboard/support" },
            { key: "live-delivery", label: "Live Delivery", icon: "Truck", path: "/admin-dashboard/live-delivery" },
            { key: "ticket-issue", label: "Ticket Issue", icon: "Ticket", path: "/admin-dashboard/ticket-issue" },
            {
                key: "escalation-ticket",
                label: "Escalation Ticket",
                icon: "AlertTriangle",
                path: "/admin-dashboard/escalation-ticket",
            },
        ],
    },
    {
        label: "Growth",
        items: [
            { key: "analytics", label: "Analytics", icon: "BarChart3", path: "/admin-dashboard/analytics" },
            { key: "price-markup", label: "Price Markup", icon: "Tag", path: "/admin-dashboard/price-markup" },
            { key: "brands", label: "Brands", icon: "Award", path: "/admin-dashboard/brands" },
            {
                key: "banner-campaigns",
                label: "Banner Campaigns",
                icon: "Image",
                path: "/admin-dashboard/banner-campaigns",
            },
        ],
    },
    {
        label: "Ops & Finance",
        items: [
            { key: "finance", label: "Finance", icon: "Wallet", path: "/admin-dashboard/finance" },
            { key: "returns", label: "Returns", icon: "Undo2", path: "/admin-dashboard/returns" },
            { key: "exchange", label: "Exchange", icon: "Recycle", path: "/admin-dashboard/exchange" },
            { key: "settings", label: "Settings", icon: "Settings", path: "/admin-dashboard/settings" },
        ],
    },
];
