import { z } from "zod";
import { MAX_MARKUP_PERCENT } from "../constants/priceMarkup.constants";

export const markupSchema = z.object({
    kind: z.enum(["discount", "hike"]),
    percent: z
        .number()
        .gt(0, "Enter a value greater than 0")
        .max(MAX_MARKUP_PERCENT, `Value cannot exceed ${MAX_MARKUP_PERCENT}%`),
});

export type MarkupInput = z.infer<typeof markupSchema>;

/** Allows digits with at most two decimals — everything else is rejected while typing. */
export const isValidPercentDraft = (raw: string): boolean => /^\d{0,3}(\.\d{0,2})?$/.test(raw);
