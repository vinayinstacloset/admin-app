import { useEffect, useState } from "react";
import { orderApi } from "../api/orderApi";
import type { OrderDetail } from "../types/order.types";

export function useOrderDetails(orderId: string | undefined) {
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!orderId) return;

        let isMounted = true;

        (async () => {
            setIsLoading(true);
            setError("");

            try {
                const data = await orderApi.getOrderDetail(orderId);
                if (isMounted) setOrder(data);
            } catch (err) {
                if (isMounted) setError(err instanceof Error ? err.message : "Failed to load order.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [orderId]);

    return { order, isLoading, error };
}
