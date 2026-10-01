import type {
    CustomerDetail,
    CustomerOrderDetail,
    CustomerRow,
} from "../types/customer.types";

const avatar = "https://i.pravatar.cc/80?img=47";

export const CUSTOMER_ROWS: CustomerRow[] = [
    { id: "1", name: "Priyansh Mehta", email: "priyanshmehta@gmail.com", ageGender: "28/Male", city: "Mumbai", totalOrders: 37, totalSpent: 42500, lastOrder: "Today", status: "Active" },
    { id: "2", name: "Priya Mehta", email: "meenaprakhar@gmail.com", ageGender: "28/Female", city: "Mumbai", totalOrders: 25, totalSpent: 21599, lastOrder: "Today", status: "Blocked" },
    { id: "3", name: "Priya Mehta", email: "meenaprakhar@gmail.com", ageGender: "28/Female", city: "Mumbai", totalOrders: 25, totalSpent: 21599, lastOrder: "Today", status: "Active" },
    { id: "4", name: "Priya Mehta", email: "meenaprakhar@gmail.com", ageGender: "28/Female", city: "Mumbai", totalOrders: 25, totalSpent: 21599, lastOrder: "Today", status: "Active" },
    { id: "5", name: "Priya Mehta", email: "meenaprakhar@gmail.com", ageGender: "28/Female", city: "Mumbai", totalOrders: 25, totalSpent: 21599, lastOrder: "Today", status: "Active" },
    { id: "6", name: "Priya Mehta", email: "meenaprakhar@gmail.com", ageGender: "28/Female", city: "Mumbai", totalOrders: 25, totalSpent: 21599, lastOrder: "Today", status: "Active" },
    { id: "7", name: "Priya Mehta", email: "meenaprakhar@gmail.com", ageGender: "28/Female", city: "Mumbai", totalOrders: 25, totalSpent: 21599, lastOrder: "Today", status: "Blocked" },
    { id: "8", name: "Priya Mehta", email: "meenaprakhar@gmail.com", ageGender: "28/Female", city: "Mumbai", totalOrders: 25, totalSpent: 21599, lastOrder: "Today", status: "Active" },
    { id: "9", name: "Priya Mehta", email: "meenaprakhar@gmail.com", ageGender: "28/Female", city: "Mumbai", totalOrders: 25, totalSpent: 21599, lastOrder: "Today", status: "Active" },
    { id: "10", name: "Priya Mehta", email: "meenaprakhar@gmail.com", ageGender: "28/Female", city: "Mumbai", totalOrders: 25, totalSpent: 21599, lastOrder: "Today", status: "Active" },
    { id: "11", name: "Priya Mehta", email: "meenaprakhar@gmail.com", ageGender: "28/Female", city: "Mumbai", totalOrders: 25, totalSpent: 21599, lastOrder: "Today", status: "Blocked" },
    { id: "12", name: "Priya Mehta", email: "meenaprakhar@gmail.com", ageGender: "28/Female", city: "Mumbai", totalOrders: 5, totalSpent: 91509, lastOrder: "Today", status: "Active" },
];

const orders = [
    { id: "#OD-5428", store: "A-1 Fashion", rider: "Rajan Kumar", items: 2, date: "20 min ago", details: "Red T-shirt (M), Alone dark blue t-shirt (L)", amount: 21709, status: "New" },
    { id: "#OD-5421", store: "Nike — Bandra", rider: "Rajan Kumar", items: 2, date: "20 min ago", details: "Pink Kurti (S), Leggings (28 inch)", amount: 12499, status: "Packing" },
    { id: "#OD-5421", store: "Nike — Bandra", rider: "Rajan Kumar", items: 2, date: "20 min ago", details: "Pink Kurti (S), Leggings (28 inch)", amount: 12499, status: "Ready" },
    { id: "#OD-5421", store: "Nike — Bandra", rider: "Rajan Kumar", items: 2, date: "20 min ago", details: "Pink Kurti (S), Leggings (28 inch)", amount: 12499, status: "On the way" },
    { id: "#OD-5421", store: "Nike — Bandra", rider: "Rajan Kumar", items: 2, date: "20 min ago", details: "Pink Kurti (S), Leggings (28 inch)", amount: 12499, status: "Delivered", rating: "5/5" },
    { id: "#OD-5421", store: "Nike — Bandra", rider: "Rajan Kumar", items: 2, date: "20 min ago", details: "Pink Kurti (S), Leggings (28 inch)", amount: 12499, status: "Rejected" },
    { id: "#OD-5421", store: "Nike — Bandra", rider: "Rajan Kumar", items: 2, date: "20 min ago", details: "Pink Kurti (S), Leggings (28 inch)", amount: 12499, status: "Delivered", rating: "5/5" },
    { id: "#OD-5421", store: "Nike — Bandra", rider: "Rajan Kumar", items: 2, date: "20 min ago", details: "Pink Kurti (S), Leggings (28 inch)", amount: 12499, status: "On the way" },
    { id: "#OD-5421", store: "Nike — Bandra", rider: "Rajan Kumar", items: 2, date: "20 min ago", details: "Pink Kurti (S), Leggings (28 inch)", amount: 12499, status: "Delivered", rating: "5/5" },
];

const returns = [
    { id: "#RT-5490", store: "A-1 Fashion", rider: "Rajan Kumar", item: "Palazzo Pants (M)", reason: "Size too small", requested: "20th Apr", refund: 599, status: "New" },
    { id: "#RT-5490", store: "A-1 Fashion", rider: "Rajan Kumar", item: "Palazzo Pants (M)", reason: "Size too small", requested: "20th Apr", refund: 599, status: "Pickup started" },
    { id: "#RT-5490", store: "A-1 Fashion", rider: "Rajan Kumar", item: "Palazzo Pants (M)", reason: "Size too small", requested: "20th Apr", refund: 599, status: "Refunded" },
    { id: "#RT-5490", store: "A-1 Fashion", rider: "Rajan Kumar", item: "Palazzo Pants (M)", reason: "Size too small", requested: "20th Apr", refund: 599, status: "Collected" },
    { id: "#RT-5490", store: "A-1 Fashion", rider: "Rajan Kumar", item: "Palazzo Pants (M)", reason: "Size too small", requested: "20th Apr", refund: 599, status: "Collected" },
    { id: "#RT-5490", store: "A-1 Fashion", rider: "Rajan Kumar", item: "Palazzo Pants (M)", reason: "Size too small", requested: "20th Apr", refund: 599, status: "Rejected" },
];

const exchanges = [
    { id: "#EX-5490", store: "Meena Prakhar", rider: "Rajan Kumar", item: "Red T-shirt (M)", replace: "(L)", reason: "size too small", requested: "20th Apr", status: "New" },
    { id: "#EX-5490", store: "Meena Prakhar", rider: "Rajan Kumar", item: "Red T-shirt (M)", replace: "(L)", reason: "size too small", requested: "20th Apr", status: "Ready for delivery" },
    { id: "#EX-5490", store: "Meena Prakhar", rider: "Rajan Kumar", item: "Red T-shirt (M)", replace: "(L)", reason: "size too small", requested: "20th Apr", status: "On the way" },
    { id: "#EX-5490", store: "Meena Prakhar", rider: "Rajan Kumar", item: "Red T-shirt (M)", replace: "(L)", reason: "size too small", requested: "20th Apr", status: "Exchanged" },
    { id: "#EX-5490", store: "Meena Prakhar", rider: "Rajan Kumar", item: "Red T-shirt (M)", replace: "(L)", reason: "size too small", requested: "20th Apr", status: "Rejected" },
];

const moneySpent = [
    { day: "30 Mar", value: 900 }, { day: "31 Mar", value: 1600 }, { day: "01 Apr", value: 3400 }, { day: "02 Apr", value: 400 },
    { day: "03 Apr", value: 3300 }, { day: "04 Apr", value: 8600 }, { day: "05 Apr", value: 6300 }, { day: "06 Apr", value: 1900 },
    { day: "07 Apr", value: 7100 }, { day: "08 Apr", value: 2700 }, { day: "09 Apr", value: 8300 }, { day: "10 Apr", value: 2200 },
];

export const getCustomerDetail = async (customerId: string): Promise<CustomerDetail> => {
    const row = CUSTOMER_ROWS.find((item) => item.id === customerId) ?? CUSTOMER_ROWS[0];
    return {
        id: row.id,
        status: row.status,
        stats: [
            { label: "Total Order", value: "37", icon: "Package", tone: "purple" },
            { label: "Total spent", value: "₹42,500", icon: "Wallet", tone: "green" },
            { label: "Total Return", value: "4", icon: "RotateCcw", tone: "blue" },
            { label: "Total Exchange", value: "3", icon: "Repeat2", tone: "orange" },
        ],
        profile: {
            name: row.name,
            email: row.email,
            phone: "+91 9988755441",
            ageGender: row.ageGender,
            city: "Mumbai/Maharashtra",
            since: "21st Jan, 2026",
            avatar,
        },
        moneySpent,
        orders,
        returns,
        exchanges,
    };
};

export const getCustomerOrderDetail = async (kind: "order" | "return" | "exchange", id: string): Promise<CustomerOrderDetail> => {
    if (kind === "return") {
        return {
            kind, id, status: "Collected", title: "Item collected successfully", eventText: "Item collected successfully on 29th Mar, 5:20 PM", productName: "Alone dark blue T-shirt for Gen-Z", size: "XL", color: "Dark blue", price: 599, discount: 12, reason: "Size too small",
            vendor: { name: "A-1 Fashion", email: "alfashionstore@gmail.com", phone: "9259645722" }, rider: { name: "Rajan Kumar", phone: "+91 82347 09765", rating: "4.6 (116)" },
        };
    }
    if (kind === "exchange") {
        return {
            kind, id, status: "Exchanged", title: "Order exchanged on 26th Mar, 7:50 PM!", eventText: "Order exchanged on 26th Mar, 7:50 PM!", productName: "Red bright Anime cool T-shirt for Gen-Z", size: "2M", color: "Red", price: 1099, discount: 9,
            vendor: { name: "A-1 Fashion", email: "alfashionstore@gmail.com", phone: "8259645722" }, rider: { name: "Rajan Kumar", phone: "+91 82347 09765", rating: "4.6 (116)" },
        };
    }
    return {
        kind, id, status: "Delivered", title: "Order delivered on 26th Mar, 7:50 PM!", eventText: "Order delivered on 26th Mar, 7:50 PM!", productName: "Red T-shirt", size: "M", color: "Red", price: 1099, discount: 8,
        vendor: { name: "A-1 Fashion", email: "alfashionstore@gmail.com", phone: "9259645722" }, rider: { name: "Rajan Kumar", phone: "+91 82347 09765", rating: "4.6 (116)" },
        feedback: "Absolutely loved the Blue Kurti — material is great, stitching is perfect and delivery was super fast! Will definitely order again.",
    };
};

export const setCustomerStatus = (customerId: string, status: "Active" | "Blocked") => {
    const row = CUSTOMER_ROWS.find((item) => item.id === customerId);
    if (row) row.status = status;
};

export const customerApi = {
    getCustomerDetail,
    getCustomerOrderDetail,
};
