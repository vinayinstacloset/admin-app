import { z } from "zod";

export const bannerCampaignsSchema = z.object({
    id: z.string(),
});

export type BannerCampaignsInput = z.infer<typeof bannerCampaignsSchema>;
