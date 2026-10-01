export type CustomerStatus = "Active" | "Blocked";
export type CustomerTab = "ORDER" | "RETURN" | "EXCHANGE";
export type OrderStatus = "All" | "New" | "Packing" | "Ready" | "On the way" | "Delivered" | "Rejected";
export type ReturnStatus = "All" | "New" | "Refunded" | "Pickup started" | "Returning to vendor" | "Collected" | "Rejected";
export type ExchangeStatus = "All" | "New" | "Ready for delivery" | "On the way" | "Exchanged" | "Rejected";

export interface CustomerRow {
    id: string;
    name: string;
    email: string;
    ageGender: string;
    city: string;
    totalOrders: number;
    totalSpent: number;
    lastOrder: string;
    status: CustomerStatus;
}

export interface CustomerStat {
    label: string;
    value: string;
    icon: string;
    tone: "purple" | "green" | "blue" | "orange";
}

export interface CustomerProfile {
    name: string;
    email: string;
    phone: string;
    ageGender: string;
    city: string;
    since: string;
    avatar: string;
}

export interface MoneySpentPoint {
    day: string;
    value: number;
}

export interface CustomerOrderRow {
    id: string;
    store: string;
    rider: string;
    items: number;
    date: string;
    details: string;
    amount: number;
    status: string;
    rating?: string;
}

export interface CustomerReturnRow {
    id: string;
    store: string;
    rider: string;
    item: string;
    reason: string;
    requested: string;
    refund: number;
    status: string;
}

export interface CustomerExchangeRow {
    id: string;
    store: string;
    rider: string;
    item: string;
    replace: string;
    reason: string;
    requested: string;
    status: string;
}

export interface CustomerDetail {
    id: string;
    status: CustomerStatus;
    stats: CustomerStat[];
    profile: CustomerProfile;
    moneySpent: MoneySpentPoint[];
    orders: CustomerOrderRow[];
    returns: CustomerReturnRow[];
    exchanges: CustomerExchangeRow[];
}

export interface CustomerOrderDetail {
    kind: "order" | "return" | "exchange";
    id: string;
    status: string;
    title: string;
    eventText: string;
    productName: string;
    size: string;
    color: string;
    price: number;
    discount: number;
    reason?: string;
    vendor: {
        name: string;
        email: string;
        phone: string;
    };
    rider: {
        name: string;
        phone: string;
        rating: string;
    };
    feedback?: string;
}
