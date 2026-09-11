import { useEffect, useState } from "react";
import { analyticsApi } from "../api";
import type { AnalyticsItem } from "../types/analytics.types";

export function useAnalyticsList() {
    const [items, setItems] = useState<AnalyticsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            setIsLoading(true);
            const data = await analyticsApi.list();
            if (isMounted) setItems(data);
            if (isMounted) setIsLoading(false);
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return { items, isLoading };
}
