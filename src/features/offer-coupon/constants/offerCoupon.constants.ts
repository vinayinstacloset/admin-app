export const OFFER_COUPON_ROUTE = "/admin-dashboard/offer-coupon";

export const OFFER_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "scheduled", label: "Scheduled" },
  { value: "expired", label: "Expired" },
] as const;

export const PLACEMENT_OPTIONS = ["Homepage", "Category page"] as const;
export const GENDER_OPTIONS = ["MEN", "WOMEN", "KIDS", "TEENS"] as const;
export const PRODUCT_CATEGORY_OPTIONS = [
  "Topwear",
  "Bottomwear",
  "Footwear",
  "Accessories",
  "Ethnicwear",
] as const;

export const CATEGORY_OPTIONS: Record<string, string[]> = {
  Topwear: ["T-Shirt", "Shirt", "Kurta", "Sweatshirt"],
  Bottomwear: ["Jeans", "Trousers", "Shorts", "Track Pants"],
  Footwear: ["Sports", "Casual", "Formal", "Sandals"],
  Accessories: ["Bags", "Belts", "Watches", "Sunglasses"],
  Ethnicwear: ["Kurta Set", "Saree", "Lehenga", "Sherwani"],
};

export const SUB_CATEGORY_OPTIONS: Record<string, string[]> = {
  "T-Shirt": ["Casual", "Oversized", "Printed"],
  Shirt: ["Casual", "Formal", "Checks"],
  Sports: ["Casual", "Running", "Training"],
  Casual: ["Everyday", "Slip-on", "Sneakers"],
  Jeans: ["Skinny", "Regular", "Relaxed"],
  Bags: ["Backpack", "Sling", "Handbag"],
};

export const CATEGORY_NAVIGATION_OPTIONS: Record<string, string[]> = {
  KIDS: ["Boys", "Girls"],
  TEENS: ["Boys", "Girls"],
};
