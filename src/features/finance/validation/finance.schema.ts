import { z } from "zod";

export const financeSchema = z.object({
    id: z.string(),
});

export type FinanceInput = z.infer<typeof financeSchema>;
