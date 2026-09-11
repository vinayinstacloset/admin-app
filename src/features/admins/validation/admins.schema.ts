import { z } from "zod";

export const adminsSchema = z.object({
    id: z.string(),
});

export type AdminsInput = z.infer<typeof adminsSchema>;
