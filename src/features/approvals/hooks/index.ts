import { useEffect, useState } from "react";
import { approvalsApi } from "../api";
import type { ApprovalsItem } from "../types/approvals.types";

export function useApprovalsList() {
    const [items, setItems] = useState<ApprovalsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            setIsLoading(true);
            const data = await approvalsApi.list();
            if (isMounted) setItems(data);
            if (isMounted) setIsLoading(false);
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return { items, isLoading };
}
