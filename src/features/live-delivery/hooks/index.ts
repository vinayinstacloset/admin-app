import { useEffect, useState } from "react";
import { liveDeliveryApi } from "../api";
import type { LiveDeliveryItem } from "../types/livedelivery.types";

export function useLiveDeliveryList() {
    const [items, setItems] = useState<LiveDeliveryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            setIsLoading(true);
            const data = await liveDeliveryApi.list();
            if (isMounted) setItems(data);
            if (isMounted) setIsLoading(false);
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return { items, isLoading };
}
