import { z } from "zod";

export const storeSchema = z.object({
    id: z.string(),
});

export type StoreInput = z.infer<typeof storeSchema>;
