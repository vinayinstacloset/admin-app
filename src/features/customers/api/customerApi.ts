import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientCustomers } from "../../../shared/api/client/apiClient";
import type { CustomerDetail } from "../types/customer.types";

const MOCK_CUSTOMER_DETAIL: CustomerDetail = {
    stats: [
        { label: "Total Order", value: "37", icon: "Package", tone: "purple" },
        { label: "Total Spent", value: "₹42,500", icon: "Wallet", tone: "green" },
        { label: "Total Return", value: "4", icon: "Undo2", tone: "blue" },
        { label: "Total Exchange", value: "3", icon: "Repeat", tone: "orange" },
    ],
    profile: {
        name: "Arjun Mehta",
        email: "arjunmehta@gmail.com",
        phone: "+91 99087 55441",
        ageGender: "21/Female",
        city: "Mumbai/Maharashtra",
        since: "21st Jan, 2026",
        avatar: "https://i.pravatar.cc/80?img=12",
    },
    moneySpent: [
        { day: "30 Mar", value: 900 },
        { day: "31 Mar", value: 1600 },
        { day: "01 Apr", value: 3400 },
        { day: "02 Apr", value: 400 },
        { day: "03 Apr", value: 3300 },
        { day: "04 Apr", value: 8600 },
        { day: "05 Apr", value: 6300 },
        { day: "06 Apr", value: 1900 },
        { day: "07 Apr", value: 7100 },
        { day: "08 Apr", value: 2700 },
        { day: "09 Apr", value: 8300 },
        { day: "10 Apr", value: 2200 },
    ],
    orders: [
        {
            id: "#OD-5490",
            items: 3,
            date: "21st Mar",
            details: "Red T-shirt (M), White Linen shirt (XL)",
            amount: "₹1,689",
        },
        {
            id: "#OD-5490",
            items: 3,
            date: "21st Mar",
            details: "Red T-shirt (M), White Linen shirt (XL)",
            amount: "₹1,689",
        },
        {
            id: "#OD-5490",
            items: 3,
            date: "21st Mar",
            details: "Red T-shirt (M), White Linen shirt (XL)",
            amount: "₹1,689",
        },
    ],
};

export const customerApi = {
    getCustomerDetail: async (customerId: string): Promise<CustomerDetail> => {
        try {
            const { data } = await clientCustomers.get<CustomerDetail>(`/customers/${customerId}`);
            return data;
        } catch (error) {
            console.warn("Falling back to mock customer detail:", getApiErrorMessage(error));
            return MOCK_CUSTOMER_DETAIL;
        }
    },
};
