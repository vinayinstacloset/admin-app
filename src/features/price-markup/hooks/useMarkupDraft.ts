import { useMemo, useState } from "react";
import type { Markup, MarkupKind } from "../types/pricemarkup.types";
import { isValidPercentDraft, markupSchema } from "../validation/pricemarkup.schema";

// Shared form state for every "pick Discount / Hike, then type a %" panel.
export function useMarkupDraft(initial?: Markup | null) {
    const [kind, setKind] = useState<MarkupKind | null>(initial?.kind ?? null);
    const [percentRaw, setPercentRaw] = useState(initial ? String(initial.percent) : "");

    const updatePercent = (raw: string) => {
        if (isValidPercentDraft(raw)) setPercentRaw(raw);
    };

    const markup: Markup | null = useMemo(() => {
        if (!kind || percentRaw.trim() === "") return null;

        const parsed = markupSchema.safeParse({ kind, percent: Number(percentRaw) });
        return parsed.success ? parsed.data : null;
    }, [kind, percentRaw]);

    const isDirty = kind !== (initial?.kind ?? null) || percentRaw !== (initial ? String(initial.percent) : "");

    return { kind, setKind, percentRaw, setPercentRaw: updatePercent, markup, isValid: markup !== null, isDirty };
}
