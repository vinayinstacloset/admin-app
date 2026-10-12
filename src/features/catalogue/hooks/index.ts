import { useMemo } from "react";
import { catalogueApi } from "../api";

export function useCatalogueData() {
  const stores = useMemo(() => catalogueApi.listStores(), []);
  const sections = useMemo(() => catalogueApi.listSections(), []);
  return { stores, sections };
}

export function useCatalogueIntegration() {
  const items = useMemo(() => catalogueApi.listIntegration(), []);
  return { items };
}
