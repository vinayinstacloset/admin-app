import { useEffect, useState } from "react";
import { approvalsApi } from "../api";
import type { ApprovalItem } from "../types/approvals.types";
import { getApiErrorMessage } from "../../../shared/api/apiError";
export function useApprovalDetail(id: string) {
  const [item, setItem] = useState<ApprovalItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    setIsLoading(true);
    setError("");
    approvalsApi
      .detail(id)
      .then((value) => {
        if (alive) setItem(value);
      })
      .catch((e) => {
        if (alive)
          setError(getApiErrorMessage(e) || "Unable to load rider details.");
      })
      .finally(() => {
        if (alive) setIsLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id]);
  return { item, isLoading, error };
}
