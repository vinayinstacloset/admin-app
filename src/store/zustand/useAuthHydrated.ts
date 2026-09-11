import { useEffect, useState } from "react";
import { useAuthStore } from "./authStore";

export function useAuthHydrated(): boolean {
    const [hydrated, setHydrated] = useState(useAuthStore.persist.hasHydrated());

    useEffect(() => {
        const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
            setHydrated(true);
        });

        return unsubscribe;
    }, []);

    return hydrated;
}
