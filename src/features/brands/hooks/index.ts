import { useEffect, useState } from "react";
import { brandsApi } from "../api";
import type { Brand } from "../data/mockData";

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    brandsApi
      .list()
      .then(setBrands)
      .finally(() => setIsLoading(false));
  }, []);
  return { brands, setBrands, isLoading };
}
