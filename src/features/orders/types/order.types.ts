export interface AdminOrderSummary {
    id: string;
    customer: string;
    vendor: string;
    rider: string;
    amount: string;
    status: string;
}

export interface OrderItem {
    id: number;
    title: string;
    tags: string[];
    description: string;
    price: string;
    mrp: string;
    discount: string;
    image: string;
}

export interface OrderPerson {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    meta?: string;
}

export interface OrderRider {
    name: string;
    phone: string;
    rating: string;
    avatar: string;
}

export interface OrderPriceDetails {
    mrp: string;
    gst: string;
    total: string;
    vendorPayout: string;
    riderPayout: string;
    platformCommission: string;
}

export interface AvailableRider {
    id: string;
    name: string;
    phone: string;
    distance: string;
    avatar: string;
}

export interface OrderDetail {
    id: string;
    status: string;
    eta: string;
    items: OrderItem[];
    customer: OrderPerson;
    vendor: OrderPerson;
    rider: OrderRider;
    priceDetails: OrderPriceDetails;
    availableRiders: AvailableRider[];
}
