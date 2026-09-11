import { useEffect, useState } from "react";
import { bannerCampaignsApi } from "../api";
import type { BannerCampaignsItem } from "../types/bannercampaigns.types";

export function useBannerCampaignsList() {
    const [items, setItems] = useState<BannerCampaignsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            setIsLoading(true);
            const data = await bannerCampaignsApi.list();
            if (isMounted) setItems(data);
            if (isMounted) setIsLoading(false);
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return { items, isLoading };
}
