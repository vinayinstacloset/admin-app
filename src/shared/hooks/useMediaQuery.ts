import { useSyncExternalStore } from "react";

/**
 * Tracks a CSS media query from JavaScript so responsive rules can be applied
 * as inline styles (inline styles cannot contain @media blocks).
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", notify);
      return () => mql.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
