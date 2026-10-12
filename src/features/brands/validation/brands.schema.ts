import { z } from "zod";
export const brandsSchema = z.object({
  name: z.string().trim().min(2, "Brand name is required"),
});
export type BrandsInput = z.infer<typeof brandsSchema>;
