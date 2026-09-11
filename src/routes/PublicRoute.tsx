import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../store/zustand/authStore";
import LoadingScreen from "../features/loading/LoadingScreen";
import { useAuthHydrated } from "../store/zustand/useAuthHydrated";

export default function PublicRoute() {
    const hydrated = useAuthHydrated();

    const accessToken = useAuthStore((state) => state.accessToken);

    if (!hydrated) {
        return <LoadingScreen message="Checking your session..." />;
    }

    if (accessToken) {
        return (
            <Navigate
                to="/admin-dashboard"
                replace
            />
        );
    }

    return <Outlet />;
}
