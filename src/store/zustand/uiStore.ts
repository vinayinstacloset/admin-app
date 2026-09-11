import { create } from "zustand";

interface UiState {
    isMobileSidebarOpen: boolean;
    isSidebarCollapsed: boolean;
    setMobileSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;

    activeStateFilter: string;
    setActiveStateFilter: (state: string) => void;

    reassignRiderOrderId: string | null;
    setReassignRiderOrderId: (orderId: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
    isMobileSidebarOpen: false,
    isSidebarCollapsed: false,
    setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
    toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

    activeStateFilter: "All State",
    setActiveStateFilter: (activeStateFilter) => set({ activeStateFilter }),

    reassignRiderOrderId: null,
    setReassignRiderOrderId: (reassignRiderOrderId) => set({ reassignRiderOrderId }),
}));
