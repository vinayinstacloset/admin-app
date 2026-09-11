import { z } from "zod";

export const catalogueSchema = z.object({
    id: z.string(),
});

export type CatalogueInput = z.infer<typeof catalogueSchema>;
