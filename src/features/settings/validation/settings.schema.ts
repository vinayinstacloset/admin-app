import { z } from "zod";

export const settingsSchema = z.object({
    id: z.string(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
