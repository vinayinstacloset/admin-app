export type DeliveryStatus = "On the way" | "Delivered";

export interface RiderRow {
    id: string;
    name: string;
    phone: string;
    email: string;
    vehicle: string;
    todayDeliveries: number;
    earnings: string;
    rating: string;
    status: "Online" | "Offline" | "Suspend";
}

export interface Delivery {
    id: string;
    customer: string;
    customerAddress: string;
    store: string;
    city: string;
    item: string;
    itemMeta: string;
    delivered: string;
    amount: string;
    status: DeliveryStatus;
}

export const mockRiders: RiderRow[] = Array.from({ length: 24 }, (_, index) => ({
    id: String(index + 1),
    name: "Nitish Kumar",
    phone: "+91 82347 09765",
    email: "nitishkumar@gmail.com",
    vehicle: "Honda Activa",
    todayDeliveries: 12,
    earnings: index === 0 ? "₹27,599" : "₹2,599",
    rating: "4.4",
    status: index === 8 ? "Offline" : index === 10 ? "Suspend" : "Online",
}));

export const mockDeliveries: Delivery[] = Array.from({ length: 13 }, (_, index) => ({
    id: `DD-${5428 - index}`,
    customer: "Arjun Mehta",
    customerAddress: "Dadar, 2.8 km",
    store: "A-1 Fashion — Limgamp...",
    city: "Mumbai",
    item: "Red T-shirt (M), Alone dark blue t-shirt (L)",
    itemMeta: "15   8",
    delivered: "20th Apr",
    amount: "₹1,709",
    status: index % 4 === 0 ? "On the way" : "Delivered",
}));

export const riderProfile = {
    name: "Nitish Kumar",
    email: "nitishkumar@gmail.com",
    phone: "+91 82347 09765",
    ageGender: "21/Male",
    city: "Mumbai/Maharashtra",
    avatar: "/reference/riders/avatar.jpg",
    vehicle: {
        name: "Honda Activa 4G",
        color: "Light Green",
        purchasedOn: "26th Mar, 2023",
        number: "MH02-KV-4532",
        year: "2018",
        image: "/reference/riders/scooter.jpg",
    },
    documents: [
        { label: "Aadhar card front/back", image: "/reference/riders/aadhaar.jpg" },
        { label: "PAN card", image: "/reference/riders/pan.jpg" },
        { label: "RC book", image: "/reference/riders/rc.jpg" },
        { label: "Insurance", image: "/reference/riders/insurance.jpg" },
    ],
    stats: [
        { label: "Total Earnings", value: "₹27,599", icon: "Wallet", tone: "green" },
        { label: "Total Delivery", value: "51", icon: "Truck", tone: "orange" },
        { label: "Acceptance Rate", value: "96%", icon: "ClipboardCheck", tone: "blue" },
        { label: "Cancellation Rate", value: "4%", icon: "MinusCircle", tone: "red" },
        { label: "Rating", value: "4.6", icon: "Star", tone: "yellow" },
    ],
};

export type RiderProfile = typeof riderProfile;

export const earningData = [
    ["30 Mar", 300], ["31 Mar", 620], ["01 Apr", 800], ["02 Apr", 180],
    ["03 Apr", 900], ["04 Apr", 1500], ["05 Apr", 1150], ["06 Apr", 620],
    ["07 Apr", 1350], ["08 Apr", 900], ["09 Apr", 1500], ["10 Apr", 650],
] as const;

export const tracking = {
    eta: "12:30 PM",
    from: "Shimla park, near mm valley, rashid compound, Kausa, Mumbai - 400612",
    to: "Shimla park, near mm valley, rashid compound, Kausa, Mumbai - 400612",
};
