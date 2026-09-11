import { z } from "zod";

export const approvalsSchema = z.object({
    id: z.string(),
});

export type ApprovalsInput = z.infer<typeof approvalsSchema>;
