import { z } from "zod";

export const priceMarkupSchema = z.object({
    id: z.string(),
});

export type PriceMarkupInput = z.infer<typeof priceMarkupSchema>;
