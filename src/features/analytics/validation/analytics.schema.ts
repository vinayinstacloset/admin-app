import { z } from "zod";

export const analyticsSchema = z.object({
    id: z.string(),
});

export type AnalyticsInput = z.infer<typeof analyticsSchema>;
