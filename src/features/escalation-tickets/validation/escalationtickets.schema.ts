import { z } from "zod";

export const escalationTicketsSchema = z.object({
    id: z.string(),
});

export type EscalationTicketsInput = z.infer<typeof escalationTicketsSchema>;
