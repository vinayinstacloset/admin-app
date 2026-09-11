import { useEffect, useState } from "react";
import { escalationTicketsApi } from "../api";
import type { EscalationTicketsItem } from "../types/escalationtickets.types";

export function useEscalationTicketsList() {
    const [items, setItems] = useState<EscalationTicketsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            setIsLoading(true);
            const data = await escalationTicketsApi.list();
            if (isMounted) setItems(data);
            if (isMounted) setIsLoading(false);
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return { items, isLoading };
}
