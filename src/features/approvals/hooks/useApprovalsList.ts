import { mockApprovals } from "../data/mockApprovals";

export function useApprovalsList() {
  return {
    items: mockApprovals,
    isLoading: false,
    error: "",
    reload: async () => mockApprovals,
  };
}
