import { z } from "zod";

export const returnsSchema = z.object({
    id: z.string(),
});

export type ReturnsInput = z.infer<typeof returnsSchema>;
