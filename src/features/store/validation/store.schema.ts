import { z } from "zod";

export const storeFilterSchema = z.object({
  search: z.string().max(100),
  status: z.enum(["All", "Open", "Closed"]),
  state: z.string().max(80),
});

export const reviewFilterSchema = z.object({
  rating: z.enum(["All ratings", "5", "4", "3", "2", "1"]),
  sort: z.enum(["Newest first", "Oldest first", "Reply given"]),
});

export type StoreFilterInput = z.infer<typeof storeFilterSchema>;
export type ReviewFilterInput = z.infer<typeof reviewFilterSchema>;
