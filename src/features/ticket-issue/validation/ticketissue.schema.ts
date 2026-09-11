import { z } from "zod";

export const ticketIssueSchema = z.object({
    id: z.string(),
});

export type TicketIssueInput = z.infer<typeof ticketIssueSchema>;
