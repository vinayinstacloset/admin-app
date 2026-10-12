import { z } from "zod";

export const catalogueAddSchema = z.object({
  gender: z.enum(["MEN", "WOMEN", "TEENS", "KIDS", "GENZ"]),
  navigation: z.string(),
  productCategory: z.string(),
  category: z.string(),
  name: z.string().trim().min(1, "Name is required"),
});
