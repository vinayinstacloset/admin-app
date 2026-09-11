import { useEffect, useState } from "react";
import { financeApi } from "../api";
import type { FinanceItem } from "../types/finance.types";

export function useFinanceList() {
    const [items, setItems] = useState<FinanceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            setIsLoading(true);
            const data = await financeApi.list();
            if (isMounted) setItems(data);
            if (isMounted) setIsLoading(false);
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return { items, isLoading };
}
