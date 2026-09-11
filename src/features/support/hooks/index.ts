import { useEffect, useState } from "react";
import { supportApi } from "../api";
import type { SupportItem } from "../types/support.types";

export function useSupportList() {
    const [items, setItems] = useState<SupportItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            setIsLoading(true);
            const data = await supportApi.list();
            if (isMounted) setItems(data);
            if (isMounted) setIsLoading(false);
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return { items, isLoading };
}
