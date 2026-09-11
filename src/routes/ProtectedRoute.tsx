import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "../store/zustand/authStore";
import LoadingScreen from "../features/loading/LoadingScreen";
import { useAuthHydrated } from "../store/zustand/useAuthHydrated";

export default function ProtectedRoute() {
    const location = useLocation();
    const hydrated = useAuthHydrated();

    const accessToken = useAuthStore((state) => state.accessToken);

    if (!hydrated) {
        return <LoadingScreen message="Checking your session..." />;
    }

    if (!accessToken) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return <Outlet />;
}
