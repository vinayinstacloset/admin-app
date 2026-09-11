import { z } from "zod";

export const exchangeSchema = z.object({
    id: z.string(),
});

export type ExchangeInput = z.infer<typeof exchangeSchema>;
