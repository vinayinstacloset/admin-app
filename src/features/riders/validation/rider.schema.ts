import { z } from "zod";

export const riderFilterSchema = z.object({
    search: z.string().default(""),
    status: z.enum(["All", "Online", "Offline", "Suspend"]).default("All"),
    sort: z.enum(["A to Z", "Z to A", "Newest first", "Oldest first"]).default("A to Z"),
});

export type RiderFilterInput = z.infer<typeof riderFilterSchema>;
