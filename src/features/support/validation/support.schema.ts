import { z } from "zod";

export const supportSchema = z.object({
    id: z.string(),
});

export type SupportInput = z.infer<typeof supportSchema>;
