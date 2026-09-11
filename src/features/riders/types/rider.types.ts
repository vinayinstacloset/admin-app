export interface RiderStat {
    label: string;
    value: string;
    icon: string;
    tone: "green" | "purple" | "blue" | "orange" | "yellow" | "red";
}

export interface RiderPersonal {
    name: string;
    email: string;
    phone: string;
    ageGender: string;
    city: string;
    avatar: string;
}

export interface RiderVehicle {
    name: string;
    color: string;
    purchasedOn: string;
    number: string;
    year: string;
}

export interface RiderDocument {
    label: string;
    image: string;
}

export interface RiderDetail {
    stats: RiderStat[];
    personal: RiderPersonal;
    vehicle: RiderVehicle;
    documents: RiderDocument[];
}
