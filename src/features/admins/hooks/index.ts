import { useEffect, useState } from "react";
import { adminsApi } from "../api";
import type { AdminsItem } from "../types/admins.types";

export function useAdminsList() {
    const [items, setItems] = useState<AdminsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            setIsLoading(true);
            const data = await adminsApi.list();
            if (isMounted) setItems(data);
            if (isMounted) setIsLoading(false);
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return { items, isLoading };
}
