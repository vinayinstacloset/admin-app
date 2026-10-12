import type { OrderDetail, OrderListRow } from "./types/order.types";

export const orderStatuses = ["New", "Packing", "Ready", "On the way", "Delivered", "Rejected"] as const;

export const statusCounts: Record<(typeof orderStatuses)[number], number> = {
  New: 56,
  Packing: 23,
  Ready: 19,
  "On the way": 24,
  Delivered: 43,
  Rejected: 26,
};

export const storeNames = [
  "All Store",
  "Nike – Bandra",
  "Puma – Banjara Hills",
  "Calvin Klein – Kondamgalla",
  "H&M – Lajpat Nagar",
  "Zara – Powai",
  "Nike – Lingampalli",
];

const baseRows: OrderListRow[] = [
  { id: "#DD-5428", items: "2 items", age: "20 min ago", store: "A-1 Fashion — Linking Road", city: "Mumbai", customer: "Arjun Mehta", customerLocation: "Dadar, 2.8 km", rider: "-", itemSummary: "Red T-shirt (M), Alone dark blue t-shirt (L)", itemCounts: "15      8", status: "New", amount: 1709, actionText: "", riderState: "not-accepted" },
  { id: "#DD-5421", items: "2 items", age: "20 min ago", store: "Nike — Bandra", city: "Mumbai", customer: "Ayan Qureshi", customerLocation: "Dadar, 2.8 km", rider: "-", itemSummary: "Pink Kurti (S), Leggings (28 inch)", itemCounts: "19      23", status: "New", amount: 890, actionText: "", riderState: "not-accepted" },
  { id: "#DD-5427", items: "1 item", age: "15 min ago", store: "Puma — Banjara Hills", city: "Hyderabad", customer: "Mukesh Kumar", customerLocation: "Banjara Hills, 1.9 km", rider: "-", itemSummary: "Blue Denim Jacket (L)", itemCounts: "12", status: "New", amount: 659, actionText: "", riderState: "not-accepted" },
  { id: "#DD-5426", items: "2 items", age: "23 min ago", store: "Nike — Bandra", city: "Mumbai", customer: "Rahul Sharma", customerLocation: "Bandra, 3.1 km", rider: "-", itemSummary: "Pink Kurti (S), Leggings (28 inch)", itemCounts: "19      23", status: "Packing", amount: 890, actionText: "--", riderState: "not-accepted" },
  { id: "#DD-5425", items: "2 items", age: "23 min ago", store: "Nike — Bandra", city: "Mumbai", customer: "Rahul Sharma", customerLocation: "Bandra, 3.1 km", rider: "Rajan Kumar", riderAvatar: "https://i.pravatar.cc/48?img=33", itemSummary: "Pink Kurti (S), Leggings (28 inch)", itemCounts: "19      23", status: "Ready", amount: 890, actionText: "Rider reached the store", riderState: "reached" },
  { id: "#DD-5424", items: "2 items", age: "23 min ago", store: "Puma — Banjara Hills", city: "Hyderabad", customer: "Ayan Qureshi", customerLocation: "Banjara Hills, 2.2 km", rider: "Nitish Kumar", riderAvatar: "https://i.pravatar.cc/48?img=12", itemSummary: "Pink Kurti (S), Leggings (28 inch)", itemCounts: "19      23", status: "Ready", amount: 890, actionText: "Rider is on the way\nETA: 12:30 PM", riderState: "on-way" },
  { id: "#DD-5423", items: "2 items", age: "20 min ago", store: "Nike — Lingampalli", city: "Hyderabad", customer: "Ayan Qureshi", customerLocation: "Lingampalli, 2.8 km", rider: "-", itemSummary: "Pink Kurti (S), Leggings (28 inch)", itemCounts: "19      23", status: "Ready", amount: 890, actionText: "Rider is not accepted yet", riderState: "not-accepted" },
  { id: "#DD-5428", items: "2 items", age: "20 min ago", store: "A-1 Fashion — Linking Road", city: "Mumbai", customer: "Arjun Mehta", customerLocation: "Dadar, 2.8 km", rider: "Rajan Kumar", riderAvatar: "https://i.pravatar.cc/48?img=33", itemSummary: "Red T-shirt (M), Alone dark blue t-shirt (L)", itemCounts: "15      8", status: "On the way", amount: 1709, actionText: "", riderState: "on-way" },
  { id: "#DD-5422", items: "2 items", age: "20 min ago", store: "Nike — Bandra", city: "Mumbai", customer: "Ayan Qureshi", customerLocation: "Dadar, 2.8 km", rider: "Nitish Kumar", riderAvatar: "https://i.pravatar.cc/48?img=12", itemSummary: "Pink Kurti (S), Leggings (28 inch)", itemCounts: "19      23", status: "On the way", amount: 890, actionText: "", riderState: "on-way" },
  { id: "#DD-5428", items: "2 items", age: "20 min ago", store: "A-1 Fashion — Linking Road", city: "Mumbai", customer: "Arjun Mehta", customerLocation: "Dadar, 2.8 km", rider: "Rajan Kumar", riderAvatar: "https://i.pravatar.cc/48?img=33", itemSummary: "Red T-shirt (M), Alone dark blue t-shirt (L)", itemCounts: "15      8", status: "Delivered", amount: 1709, actionText: "", rating: "4/5 rating", riderState: "on-way" },
  { id: "#DD-5421", items: "2 items", age: "20 min ago", store: "Nike — Bandra", city: "Mumbai", customer: "Ayan Qureshi", customerLocation: "Dadar, 2.8 km", rider: "Nitish Kumar", riderAvatar: "https://i.pravatar.cc/48?img=12", itemSummary: "Pink Kurti (S), Leggings (28 inch)", itemCounts: "19      23", status: "Delivered", amount: 890, actionText: "", rating: "5/5 rating", riderState: "on-way" },
  { id: "#DD-5428", items: "2 items", age: "20 min ago", store: "A-1 Fashion — Linking Road", city: "Mumbai", customer: "Arjun Mehta", customerLocation: "Dadar, 2.8 km", rider: "Rajan Kumar", riderAvatar: "https://i.pravatar.cc/48?img=33", itemSummary: "Red T-shirt (M), Alone dark blue t-shirt (L)", itemCounts: "15      8", status: "Rejected", amount: 1709, actionText: "20th Apr, 12:35 PM", rejectedAt: "20th Apr, 12:35 PM", riderState: "not-accepted" },
];

export function getOrderRows(): OrderListRow[] {
  return Array.from({ length: 10 }, (_, index) => {
    const row = baseRows[index % baseRows.length];
    return { ...row, id: index === 0 ? row.id : row.id === "#DD-5428" ? "#DD-5421" : row.id };
  });
}

export function getOrderDetail(orderId: string, status: OrderDetail["status"] = "New", riderStateOverride?: OrderDetail["riderState"]): OrderDetail {
  const common = {
    id: orderId.startsWith("#") ? orderId : `#${orderId}`,
    status,
    storeName: "A-1 Fashion",
    customerLocation: { latitude: 19.076, longitude: 72.8777 },
    storeLocation: { latitude: 19.0607, longitude: 72.8362 },
    riderLocation: { latitude: 19.082, longitude: 72.889 },
    eta: "12:30 PM",
    items: [
      { id: 1, title: "Alone dark blue T-shirt for Gen-Z", tags: ["T-Shirt", "L", "Dark blue"], description: "A versatile, casual garment named for its T-shaped body and sleeves, typically featuring a crew neck and short sleeves without buttons or collars.", price: "₹499", mrp: "₹549", discount: "12% off", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&q=85" },
      { id: 2, title: "Red bright Anime cool T-shirt for Gen-Z", tags: ["T-Shirt", "M", "Red"], description: "A versatile, casual garment named for its T-shaped body and sleeves, typically featuring a crew neck and short sleeves without buttons or collars.", price: "₹1,099", mrp: "₹1,249", discount: "21% off", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&q=85" },
    ],
    customer: { name: "Arjun Mehta", meta: "21/Female", email: "arjunmehta@gmail.com", phone: "8976129766", avatar: "https://i.pravatar.cc/100?img=12" },
    vendor: { name: "A-1 Fashion", email: "alfashionstore@gmail.com", phone: "8259645722", avatar: "/store-fable-street.jpg" },
    rider: { name: "Rajan Kumar", phone: "+91 82347 09765", rating: "4.6 (116)", avatar: "https://i.pravatar.cc/100?img=33" },
    priceDetails: { mrp: "₹1,589", gst: "₹50", total: "₹1,709", vendorPayout: "₹1,641", riderPayout: "₹39", platformCommission: "₹29" },
    availableRiders: [
      { id: "r1", name: "Rajan Kumar", phone: "+91 82347 09765", distance: "1.6 km", avatar: "https://i.pravatar.cc/64?img=33" },
      { id: "r2", name: "Nitish Kumar", phone: "+91 82347 09876", distance: "2.1 km", avatar: "https://i.pravatar.cc/64?img=12" },
      { id: "r3", name: "Vijay Kumar", phone: "+91 82347 09987", distance: "2.8 km", avatar: "https://i.pravatar.cc/64?img=20" },
    ],
    riderState: riderStateOverride ?? (status === "Ready" ? "not-accepted" : "on-way") as "reached" | "on-way" | "not-accepted",
  } satisfies OrderDetail;

  if (status === "Rejected") return { ...common, rider: null, rejectedReason: "It’s looking invalid to me." };
  if (status === "Delivered") return { ...common, deliveredAt: "26th Mar, 7:50 PM", feedback: { rating: 4, text: "Absolutely loved the Blue Kurti — material is great, stitching is perfect and delivery was super fast! Will definitely order again." } };
  if (status === "Ready") return { ...common };
  return common;
}
