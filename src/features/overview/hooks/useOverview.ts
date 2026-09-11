import { useEffect, useState } from "react";
import { overviewApi } from "../api/overviewApi";
import type { OverviewResponse } from "../types/overview.types";

export function useOverview() {
    const [overview, setOverview] = useState<OverviewResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        (async () => {
            setIsLoading(true);
            setError("");

            try {
                const data = await overviewApi.getOverview();
                if (isMounted) setOverview(data);
            } catch (err) {
                if (isMounted) setError(err instanceof Error ? err.message : "Failed to load overview.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return { overview, isLoading, error };
}
