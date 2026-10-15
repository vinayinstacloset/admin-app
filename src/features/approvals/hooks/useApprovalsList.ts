import { useCallback, useEffect, useState } from "react";
import { approvalsApi, type ApprovalCounts } from "../api";
import type { ApprovalItem, ApprovalType } from "../types/approvals.types";
import { getApiErrorMessage } from "../../../shared/api/apiError";

export function useApprovalsList(
  type: ApprovalType,
  search: string,
  page: number,
) {
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [counts, setCounts] = useState<ApprovalCounts>({});
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const reload = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await approvalsApi.list(type, {
        search: search.trim(),
        page,
        size: 10,
      });
      setItems(result.items);
      setCounts(result.counts);
      setTotalElements(result.totalElements);
      setTotalPages(result.totalPages);
    } catch (e) {
      setItems([]);
      setCounts({});
      setTotalElements(0);
      setTotalPages(0);
      setError(
        getApiErrorMessage(e) || "Unable to load approvals. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [type, search, page]);
  useEffect(() => {
    void reload();
  }, [reload]);
  return { items, counts, totalElements, totalPages, isLoading, error, reload };
}
