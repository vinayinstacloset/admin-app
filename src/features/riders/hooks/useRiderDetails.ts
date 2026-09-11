import { useEffect, useState } from "react";
import { riderApi } from "../api/riderApi";
import type { RiderDetail } from "../types/rider.types";

export function useRiderDetails(riderId: string | undefined) {
    const [rider, setRider] = useState<RiderDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!riderId) return;

        let isMounted = true;

        (async () => {
            setIsLoading(true);
            setError("");

            try {
                const data = await riderApi.getRiderDetail(riderId);
                if (isMounted) setRider(data);
            } catch (err) {
                if (isMounted) setError(err instanceof Error ? err.message : "Failed to load rider.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [riderId]);

    return { rider, isLoading, error };
}
