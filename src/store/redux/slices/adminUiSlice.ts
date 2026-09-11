import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AdminUiState {
    selectedStateFilter: string;
    breadcrumbLabel: string | null;
}

const initialState: AdminUiState = {
    selectedStateFilter: "All State",
    breadcrumbLabel: null,
};

const adminUiSlice = createSlice({
    name: "adminUi",
    initialState,
    reducers: {
        setSelectedStateFilter(state, action: PayloadAction<string>) {
            state.selectedStateFilter = action.payload;
        },
        setBreadcrumbLabel(state, action: PayloadAction<string | null>) {
            state.breadcrumbLabel = action.payload;
        },
    },
});

export const { setSelectedStateFilter, setBreadcrumbLabel } = adminUiSlice.actions;
export default adminUiSlice.reducer;
