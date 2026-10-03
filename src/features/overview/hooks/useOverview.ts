import { useEffect, useState } from "react";
import { overviewApi } from "../api/overviewApi";
import type { OverviewResponse } from "../types/overview.types";

export function useOverview() {
    const [overview, setOverview] = useState<OverviewResponse>(null as unknown as OverviewResponse);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;
        setIsLoading(true);
        overviewApi.getOverview()
            .then((data) => {
                if (mounted) setOverview(data);
            })
            .catch((err) => {
                if (mounted) setError(err instanceof Error ? err.message : "Failed to load overview.");
            })
            .finally(() => {
                if (mounted) setIsLoading(false);
            });
        return () => { mounted = false; };
    }, []);

    return { overview, isLoading, error };
}
