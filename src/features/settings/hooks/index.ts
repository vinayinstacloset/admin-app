import { useEffect, useState } from "react";
import { brandsApi } from "../api";
import type { BrandsItem } from "../types/brands.types";

export function useBrandsList() {
    const [items, setItems] = useState<BrandsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            setIsLoading(true);
            const data = await brandsApi.list();
            if (isMounted) setItems(data);
            if (isMounted) setIsLoading(false);
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return { items, isLoading };
}
