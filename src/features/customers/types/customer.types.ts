export interface CustomerStat {
    label: string;
    value: string;
    icon: string;
    tone: "green" | "purple" | "blue" | "orange" | "yellow" | "red";
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
    items: number;
    date: string;
    details: string;
    amount: string;
}

export interface CustomerDetail {
    stats: CustomerStat[];
    profile: CustomerProfile;
    moneySpent: MoneySpentPoint[];
    orders: CustomerOrderRow[];
}
