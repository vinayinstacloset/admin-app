import { useEffect, useMemo, useState } from "react";
import { riderApi } from "../api/riderApi";
import type { RiderRow } from "../data/mockData";

export function useRiders() {
  const [items, setItems] = useState<RiderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    riderApi
      .list()
      .then(setItems)
      .finally(() => setIsLoading(false));
  }, []);

  return { items, isLoading };
}

export function useRiderDeliveries() {
  const [items, setItems] = useState<
    Awaited<ReturnType<typeof riderApi.getDeliveries>>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    setIsLoading(true);
    riderApi
      .getDeliveries()
      .then(setItems)
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const today = useMemo(
    () => items.filter((item) => item.status === "On the way"),
    [items],
  );
  const completed = useMemo(
    () => items.filter((item) => item.status === "Delivered"),
    [items],
  );

  return { items, today, completed, isLoading, reload: load };
}

export function useRiderDetails(riderId?: string) {
  const [rider, setRider] = useState<Awaited<
    ReturnType<typeof riderApi.getDetail>
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    riderApi
      .getDetail()
      .then(setRider)
      .finally(() => setIsLoading(false));
  }, [riderId]);

  return { rider, isLoading };
}
