export type DeliveryStatus = "On time" | "On the way" | "Delayed";
export type RiderAvailability = "Online" | "Offline";

export interface DeliveryItem {
  id: string;
  rider: string;
  customer: string;
  amount: string;
  eta: string;
  status: DeliveryStatus;
  riderId: string;
  from: string;
  to: string;
  riderLat: number;
  riderLng: number;
  customerLat: number;
  customerLng: number;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  distance: string;
  availability: RiderAvailability;
  state: string;
  delivery: string;
  lat: number;
  lng: number;
  avatar: string;
}

export interface AssignableOrder {
  id: string;
  customer: string;
  amount: string;
  status: string;
}
