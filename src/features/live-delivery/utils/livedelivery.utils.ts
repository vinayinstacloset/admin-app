import type { DeliveryItem } from "../types/livedelivery.types";

export function statusStyle(status: DeliveryItem["status"]) {
  if (status === "Delayed") return { background: "#fff0ef", color: "#ef7171" };
  if (status === "On the way")
    return { background: "#eee6f8", color: "#8c4bc4" };
  return { background: "#eaf9ef", color: "#16b45a" };
}
