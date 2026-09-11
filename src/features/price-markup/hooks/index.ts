import { useEffect, useState } from "react";
import { priceMarkupApi } from "../api";
import type { PriceMarkupItem } from "../types/pricemarkup.types";

export function usePriceMarkupList() {
    const [items, setItems] = useState<PriceMarkupItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            setIsLoading(true);
            const data = await priceMarkupApi.list();
            if (isMounted) setItems(data);
            if (isMounted) setIsLoading(false);
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return { items, isLoading };
}
