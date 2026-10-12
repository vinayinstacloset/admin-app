import { mockOverview } from "../data/mockOverview";

export function useOverview() {
  return {
    overview: mockOverview,
    isLoading: false,
    error: "",
  };
}
