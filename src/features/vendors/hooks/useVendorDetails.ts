import { useEffect, useState } from "react";
import { vendorApi } from "../api/vendorApi";
import type { VendorDetail } from "../types/vendor.types";

export function useVendorDetails(vendorId: string | undefined) {
    const [vendor, setVendor] = useState<VendorDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!vendorId) return;

        let isMounted = true;

        (async () => {
            setIsLoading(true);
            setError("");

            try {
                const data = await vendorApi.getVendorDetail(vendorId);
                if (isMounted) setVendor(data);
            } catch (err) {
                if (isMounted) setError(err instanceof Error ? err.message : "Failed to load vendor.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [vendorId]);

    return { vendor, isLoading, error };
}
