import { z } from "zod";

export const skuCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  skus: z.number().nonnegative(),
  lowStock: z.number().nonnegative(),
  outOfStock: z.number().nonnegative(),
  image: z.string().url(),
});

export type SkuCategoryInput = z.infer<typeof skuCategorySchema>;
