import { mockApprovals } from "../data/mockApprovals";

export function useApprovalDetail(id: string) {
  const item = mockApprovals.find((approval) => approval.id === id) ?? null;

  return {
    item,
    isLoading: false,
    error: item ? "" : "Approval details could not be found.",
  };
}
