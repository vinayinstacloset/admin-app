import type { AssignableOrder, DeliveryItem, Rider } from "../types/livedelivery.types";

export const cities = ["Bengaluru", "Chennai", "Chandigarh", "Hyderabad", "Mumbai", "Lingampelli", "Pune"];
export const states = ["All State", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Maharashtra"];


export const mockAssignableOrders: AssignableOrder[] = [
    { id: "#DD-5490", customer: "Meena Prakhar", amount: "₹2,599", status: "Ready" },
    { id: "#DD-5491", customer: "Meena Prakhar", amount: "₹2,599", status: "Ready" },
    { id: "#DD-5492", customer: "Meena Prakhar", amount: "₹2,599", status: "Ready" },
    { id: "#DD-5493", customer: "Meena Prakhar", amount: "₹2,599", status: "Ready" },
    { id: "#DD-5501", customer: "Ananya Reddy", amount: "₹1,899", status: "Ready" },
    { id: "#DD-5502", customer: "Rahul Verma", amount: "₹3,240", status: "Ready" },
    { id: "#DD-5503", customer: "Sneha Rao", amount: "₹1,499", status: "Ready" },
];

export const mockDeliveries: DeliveryItem[] = [
    { id: "#DD-5490", rider: "Rajan Kumar", customer: "Meena Prakhar", amount: "₹2,599", eta: "8 min", status: "On time", riderId: "r1", from: "Shimla park, near mm valley, rashid compound, Kausa, Mumbai - 400612", to: "Shimla park, near mm valley, rashid compound, Kausa, Mumbai - 400612", riderLat: 17.431, riderLng: 78.392, customerLat: 17.448, customerLng: 78.405 },
    { id: "#DD-5491", rider: "Rajan Kumar", customer: "Meena Prakhar", amount: "₹2,599", eta: "8 min", status: "On time", riderId: "r2", from: "Shimla park, near mm valley, rashid compound, Kausa, Mumbai - 400612", to: "Shimla park, near mm valley, rashid compound, Kausa, Mumbai - 400612", riderLat: 17.425, riderLng: 78.405, customerLat: 17.455, customerLng: 78.418 },
    { id: "#DD-5492", rider: "Amir Shaikh", customer: "Meena Prakhar", amount: "₹2,599", eta: "8 min", status: "On time", riderId: "r3", from: "Shimla park, near mm valley, rashid compound, Kausa, Mumbai - 400612", to: "Shimla park, near mm valley, rashid compound, Kausa, Mumbai - 400612", riderLat: 17.447, riderLng: 78.425, customerLat: 17.463, customerLng: 78.438 },
    { id: "#DD-5493", rider: "Amir Shaikh", customer: "Meena Prakhar", amount: "₹2,599", eta: "8 min", status: "On time", riderId: "r4", from: "Shimla park, near mm valley, rashid compound, Kausa, Mumbai - 400612", to: "Shimla park, near mm valley, rashid compound, Kausa, Mumbai - 400612", riderLat: 17.459, riderLng: 78.401, customerLat: 17.478, customerLng: 78.421 },
    { id: "#DD-5494", rider: "Amir Shaikh", customer: "Meena Prakhar", amount: "₹2,599", eta: "14 min", status: "Delayed", riderId: "r5", from: "Shimla park, near mm valley, rashid compound, Kausa, Mumbai - 400612", to: "Shimla park, near mm valley, rashid compound, Kausa, Mumbai - 400612", riderLat: 17.411, riderLng: 78.431, customerLat: 17.456, customerLng: 78.455 },
];

export const mockRiders: Rider[] = [
    { id: "r1", name: "Rajan Kumar", phone: "+91 82347 09765", distance: "1.6 km", availability: "Online", state: "Telangana", delivery: "Delivering #DD-5490", lat: 17.431, lng: 78.392, avatar: "https://i.pravatar.cc/80?img=12" },
    { id: "r2", name: "Amir Shaikh", phone: "+91 82347 09765", distance: "2.1 km", availability: "Online", state: "Telangana", delivery: "Delivering #DD-5491", lat: 17.425, lng: 78.405, avatar: "https://i.pravatar.cc/80?img=33" },
    { id: "r3", name: "Amir Shaikh", phone: "+91 82347 09765", distance: "2.6 km", availability: "Online", state: "Telangana", delivery: "Delivering #DD-5492", lat: 17.447, lng: 78.425, avatar: "https://i.pravatar.cc/80?img=33" },
    { id: "r4", name: "Amir Shaikh", phone: "+91 82347 09765", distance: "2.8 km", availability: "Online", state: "Telangana", delivery: "-", lat: 17.459, lng: 78.401, avatar: "https://i.pravatar.cc/80?img=33" },
    { id: "r5", name: "Amir Shaikh", phone: "+91 82347 09765", distance: "3.2 km", availability: "Online", state: "Telangana", delivery: "-", lat: 17.411, lng: 78.431, avatar: "https://i.pravatar.cc/80?img=33" },
    { id: "r6", name: "Sunit Salunkhe", phone: "+91 82347 09765", distance: "-", availability: "Offline", state: "Maharashtra", delivery: "-", lat: 17.44, lng: 78.39, avatar: "https://i.pravatar.cc/80?img=56" },
];

export const cityCenters: Record<string, { lat: number; lng: number; bbox: string }> = {
    Hyderabad: { lat: 17.385, lng: 78.4867, bbox: "77.0,17.8,79.1,18.5" },
    Bengaluru: { lat: 12.9716, lng: 77.5946, bbox: "76.9,12.7,78.2,13.3" },
    Chennai: { lat: 13.0827, lng: 80.2707, bbox: "79.8,12.7,80.8,13.4" },
    Chandigarh: { lat: 30.7333, lng: 76.7794, bbox: "76.5,30.5,77.1,31.0" },
    Mumbai: { lat: 19.076, lng: 72.8777, bbox: "72.6,18.8,73.2,19.5" },
    Lingampelli: { lat: 17.4933, lng: 78.315, bbox: "77.9,17.2,78.7,17.8" },
    Pune: { lat: 18.5204, lng: 73.8567, bbox: "73.5,18.2,74.2,18.8" },
};
