import { z } from "zod";

export const brandsSchema = z.object({
    id: z.string(),
});

export type BrandsInput = z.infer<typeof brandsSchema>;
