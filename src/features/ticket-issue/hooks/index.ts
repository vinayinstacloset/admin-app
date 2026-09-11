import { useEffect, useState } from "react";
import { ticketIssueApi } from "../api";
import type { TicketIssueItem } from "../types/ticketissue.types";

export function useTicketIssueList() {
    const [items, setItems] = useState<TicketIssueItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            setIsLoading(true);
            const data = await ticketIssueApi.list();
            if (isMounted) setItems(data);
            if (isMounted) setIsLoading(false);
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return { items, isLoading };
}
