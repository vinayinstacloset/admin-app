import { z } from "zod";

export const liveDeliverySchema = z.object({
    id: z.string(),
});

export type LiveDeliveryInput = z.infer<typeof liveDeliverySchema>;
