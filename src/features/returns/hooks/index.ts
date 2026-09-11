import { useEffect, useState } from "react";
import { returnsApi } from "../api";
import type { ReturnsItem } from "../types/returns.types";

export function useReturnsList() {
    const [items, setItems] = useState<ReturnsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            setIsLoading(true);
            const data = await returnsApi.list();
            if (isMounted) setItems(data);
            if (isMounted) setIsLoading(false);
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return { items, isLoading };
}
