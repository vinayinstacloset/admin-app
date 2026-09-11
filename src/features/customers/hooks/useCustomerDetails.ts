import { useEffect, useState } from "react";
import { customerApi } from "../api/customerApi";
import type { CustomerDetail } from "../types/customer.types";

export function useCustomerDetails(customerId: string | undefined) {
    const [customer, setCustomer] = useState<CustomerDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!customerId) return;

        let isMounted = true;

        (async () => {
            setIsLoading(true);
            setError("");

            try {
                const data = await customerApi.getCustomerDetail(customerId);
                if (isMounted) setCustomer(data);
            } catch (err) {
                if (isMounted) setError(err instanceof Error ? err.message : "Failed to load customer.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [customerId]);

    return { customer, isLoading, error };
}
