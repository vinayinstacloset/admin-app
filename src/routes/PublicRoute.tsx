import { useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../store/zustand/authStore";
import LoadingScreen from "../features/loading/LoadingScreen";
import { useAuthHydrated } from "../store/zustand/useAuthHydrated";

export default function PublicRoute() {
  const hydrated = useAuthHydrated();

  // Only redirect users who ALREADY had a session when they arrived at a
  // public page (e.g. opening /login while logged in).
  //
  // We deliberately do not react to the token appearing later. During login,
  // the token is stored a moment before the dashboard is ready; redirecting
  // here would unmount the login screen and leave a blank page while the
  // dashboard mounts. Instead, the login flow navigates explicitly, so the
  // login screen stays visible until the dashboard is ready to replace it.
  const hadSessionOnEntry = useRef<boolean | null>(null);

  if (hydrated && hadSessionOnEntry.current === null) {
    hadSessionOnEntry.current = Boolean(useAuthStore.getState().accessToken);
  }

  if (!hydrated) {
    return <LoadingScreen message="Checking your session..." />;
  }

  if (hadSessionOnEntry.current) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return <Outlet />;
}
