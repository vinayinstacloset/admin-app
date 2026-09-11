import { useEffect, useState } from "react";
import { storeApi } from "../api";
import type { StoreItem } from "../types/store.types";

export function useStoreList() {
    const [items, setItems] = useState<StoreItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            setIsLoading(true);
            const data = await storeApi.list();
            if (isMounted) setItems(data);
            if (isMounted) setIsLoading(false);
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return { items, isLoading };
}
