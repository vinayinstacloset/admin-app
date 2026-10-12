import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientAdmin } from "../../../shared/api/client/apiClient";
import type { OverviewResponse } from "../types/overview.types";

// Fallback data so the Overview screen still renders a fully designed
// dashboard before the real admin-overview endpoint is wired up.
const MOCK_OVERVIEW: OverviewResponse = {
    stats: [
        { key: "revenue", label: "All Revenue Today", value: "₹4,85,450", icon: "Wallet", tone: "green" },
        { key: "orders", label: "Orders Today", value: "756", icon: "Package", tone: "purple" },
        { key: "vendors", label: "Active Vendor", value: "44/64", icon: "Store", tone: "blue" },
        { key: "riders", label: "Active Riders", value: "69/78", icon: "Bike", tone: "orange" },
    ],
    revenueChart: [
        { day: "30 Mar", value: 180000 },
        { day: "31 Mar", value: 145000 },
        { day: "01 Apr", value: 210000 },
        { day: "02 Apr", value: 195000 },
        { day: "03 Apr", value: 260000 },
        { day: "04 Apr", value: 485000 },
        { day: "05 Apr", value: 300000 },
    ],
    revenueSummary: {
        weeklyRevenue: "₹23.4 Lac",
        avgOrderValue: "₹1,849",
        conversionRate: "43%",
    },
    alerts: [
        {
            id: 1,
            tone: "orange",
            icon: "Store",
            title: "3 vendors pending approval",
            subtitle: "Zara, Addidas, Nike",
            time: "5 hrs ago",
        },
        {
            id: 2,
            tone: "blue",
            icon: "Bike",
            title: "2 riders pending approval",
            subtitle: "Documents submitted, awaiting verify",
            time: "6 hrs ago",
        },
        {
            id: 3,
            tone: "red",
            icon: "Star",
            title: "Low-rated vendor – Nike (Mumbai)",
            subtitle: "Rating dropped to 3.1 star",
            time: "8 hrs ago",
        },
        {
            id: 4,
            tone: "yellow",
            icon: "RotateCcw",
            title: "3 orders require refund review",
            subtitle: "Customer disputes pending",
            time: "9 hrs ago",
        },
        {
            id: 5,
            tone: "purple",
            icon: "MessageCircle",
            title: "2 customer needs support",
            subtitle: "Customer have some queries",
            time: "12 hrs ago",
        },
    ],
    recentOrders: [
        {
            id: "#OD-5490",
            customer: "Arjun Mehta",
            vendor: "Nike – Bandra-Mumbai",
            rider: "Rajan Kumar",
            amount: "₹1,709",
            status: "On the way",
        },
        {
            id: "#OD-5490",
            customer: "Meena Prakhar",
            vendor: "Nike – Bandra-Mumbai",
            rider: "Rajan Kumar",
            amount: "₹2,599",
            status: "Delivered",
        },
        {
            id: "#OD-5490",
            customer: "Meena Prakhar",
            vendor: "Nike – Bandra-Mumbai",
            rider: "Rajan Kumar",
            amount: "₹2,599",
            status: "Pending",
        },
        {
            id: "#OD-5490",
            customer: "Meena Prakhar",
            vendor: "Nike – Bandra-Mumbai",
            rider: "Rajan Kumar",
            amount: "₹2,599",
            status: "Ready",
        },
    ],
    topVendors: [
        { name: "Nike – Bandra", orders: "110 orders", amount: "₹95,300", initial: "N" },
        { name: "Zara – Connaught Place", orders: "98 orders", amount: "₹92,340", initial: "Z" },
        { name: "H&M – Koramangala", orders: "82 orders", amount: "₹90,310", initial: "H" },
        { name: "Puma – Powai", orders: "71 orders", amount: "₹84,670", initial: "P" },
    ],
};

export const overviewApi = {
    getOverview: async (): Promise<OverviewResponse> => {
        try {
            const { data } = await clientAdmin.get<OverviewResponse>("/overview");
            return data;
        } catch (error) {
            // Backend not wired up yet in this environment — fall back to
            // the mock payload so the screen still renders end to end.
            console.warn("Falling back to mock overview data:", getApiErrorMessage(error));
            return MOCK_OVERVIEW;
        }
    },
};
