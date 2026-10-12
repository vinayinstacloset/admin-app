import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { PriceMarkupTab } from "../types/pricemarkup.types";

const TABS: PriceMarkupTab[] = ["product", "category", "vendor"];

// The active tab lives in the URL (?tab=category) so Back / Discard from the
// Add Markup page returns to the same tab, and tabs can be deep-linked.
export function usePriceMarkupTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("tab") as PriceMarkupTab | null;
  const activeTab: PriceMarkupTab =
    requested && TABS.includes(requested) ? requested : "product";

  const setActiveTab = useCallback(
    (tab: PriceMarkupTab) =>
      setSearchParams(tab === "product" ? {} : { tab }, { replace: true }),
    [setSearchParams],
  );

  return { activeTab, setActiveTab };
}
