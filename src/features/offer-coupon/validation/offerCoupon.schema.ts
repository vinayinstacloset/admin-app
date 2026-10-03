import { z } from "zod";

export const offerSchema = z.object({
    offerType: z.enum(["flash-card", "deal"]),
    imageUrl: z.string().min(1, "Offer image is required"),
    placement: z.enum(["Homepage", "Category page"]),
    discount: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    gender: z.string().min(1, "Gender is required"),
    categoryNavigation: z.string().optional(),
    productCategory: z.string().min(1, "Product category is required"),
    category: z.string().min(1, "Category is required"),
    subCategory: z.string().min(1, "Sub-category is required"),
    status: z.enum(["active", "scheduled"]),
});

export const couponSchema = z.object({
    title: z.string().trim().min(1, "Title is required"),
    code: z.string().trim().min(1, "Code is required").max(30, "Code is too long"),
    expiryDate: z.string().min(1, "Expiry date is required"),
    discount: z.coerce.number().gt(0, "Discount must be greater than 0").lte(100, "Discount cannot exceed 100%"),
});
