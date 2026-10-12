import type { OrderStatus } from "./types/order.types";

const KEY = "admin-order-status-overrides";
const REASON_KEY = "admin-order-rejection-reasons";

export function getStatusOverrides(): Record<string, OrderStatus> {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, OrderStatus>; } catch { return {}; }
}
export function setOrderStatus(orderId: string, status: OrderStatus) {
  const current = getStatusOverrides();
  localStorage.setItem(KEY, JSON.stringify({ ...current, [orderId]: status }));
}
export function getOrderStatus(orderId: string, fallback: OrderStatus): OrderStatus {
  return getStatusOverrides()[orderId] ?? fallback;
}


export function setOrderRejectionReason(orderId: string, reason: string) {
  try {
    const current = JSON.parse(localStorage.getItem(REASON_KEY) ?? "{}") as Record<string, string>;
    localStorage.setItem(REASON_KEY, JSON.stringify({ ...current, [orderId]: reason }));
  } catch {
    localStorage.setItem(REASON_KEY, JSON.stringify({ [orderId]: reason }));
  }
}

export function getOrderRejectionReason(orderId: string, fallback = "It’s looking invalid to me.") {
  try {
    const current = JSON.parse(localStorage.getItem(REASON_KEY) ?? "{}") as Record<string, string>;
    return current[orderId] ?? fallback;
  } catch {
    return fallback;
  }
}
