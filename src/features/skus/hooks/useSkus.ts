import { useMemo } from "react";
import { skuApi } from "../api/skuApi";

export function useSkus() {
    const sections = useMemo(() => skuApi.getSections(), []);
    return { sections, isLoading: false };
}
