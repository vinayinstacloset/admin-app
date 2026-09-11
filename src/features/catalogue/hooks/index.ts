import { useEffect, useState } from "react";
import { catalogueApi } from "../api";
import type { CatalogueItem } from "../types/catalogue.types";

export function useCatalogueList() {
    const [items, setItems] = useState<CatalogueItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            setIsLoading(true);
            const data = await catalogueApi.list();
            if (isMounted) setItems(data);
            if (isMounted) setIsLoading(false);
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return { items, isLoading };
}
