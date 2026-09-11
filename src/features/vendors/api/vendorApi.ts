import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientVendors } from "../../../shared/api/client/apiClient";
import type { VendorDetail } from "../types/vendor.types";

const MOCK_VENDOR_DETAIL: VendorDetail = {
    stats: [
        { label: "Total Revenue", value: "₹41,85,450", icon: "Wallet", tone: "green" },
        { label: "Total Order", value: "4,240", icon: "Package", tone: "yellow", link: true },
        { label: "Total SKUs", value: "658", icon: "Boxes", tone: "blue", link: true },
        { label: "Fulfillment rate", value: "95.8%", icon: "CheckCircle2", tone: "green" },
    ],
    profile: {
        name: "A-1 Fashion",
        tagline: "(India's finest ethnic & western wear)",
        address: "Shop 14, Linking Road, Bandra West, Mumbai – 400050",
        email: "a1fashionstore@gmail.com",
        phone: "8259645722",
        rating: "4.7 (320 ratings)",
        prepTime: "20 min prep",
        freeDelivery: "Free delivery ≥₹599",
        minOrder: "Min order ₹199",
        cover: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80",
    },
    salesRevenue: [
        { time: "9-10 AM", value: 900 },
        { time: "10-11 AM", value: 1900 },
        { time: "11-12 PM", value: 2700 },
        { time: "12-01 PM", value: 400 },
        { time: "01-02 PM", value: 3300 },
        { time: "02-03 PM", value: 6100 },
        { time: "03-04 PM", value: 3800 },
        { time: "04-05 PM", value: 1900 },
        { time: "05-06 PM", value: 2600 },
        { time: "06-07 PM", value: 3300 },
        { time: "07-08 PM", value: 5300 },
    ],
    topProducts: [
        { name: "Blue Cotton Kurti", meta: "Size: S – XL, 4 colors", sold: 18, revenue: "₹8,100", stock: "Good" },
        { name: "Palazzo Pants Set", meta: "Size: S – XL, 3 colors", sold: 14, revenue: "₹6,870", stock: "Low" },
    ],
    storeRating: {
        average: "4.6",
        reviews: "681 reviews this month",
        breakdown: [
            { star: 5, pct: 62 },
            { star: 4, pct: 22 },
            { star: 3, pct: 10 },
            { star: 2, pct: 4 },
            { star: 1, pct: 2 },
        ],
    },
};

export const vendorApi = {
    getVendorDetail: async (vendorId: string): Promise<VendorDetail> => {
        try {
            const { data } = await clientVendors.get<VendorDetail>(`/vendors/${vendorId}`);
            return data;
        } catch (error) {
            console.warn("Falling back to mock vendor detail:", getApiErrorMessage(error));
            return MOCK_VENDOR_DETAIL;
        }
    },
};
