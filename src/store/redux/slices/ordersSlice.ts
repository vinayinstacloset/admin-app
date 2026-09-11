import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AdminOrderSummary } from "../../../features/orders/types/order.types";

interface OrdersState {
    items: AdminOrderSummary[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: OrdersState = {
    items: [],
    status: "idle",
    error: null,
};

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        setOrders(state, action: PayloadAction<AdminOrderSummary[]>) {
            state.items = action.payload;
            state.status = "succeeded";
            state.error = null;
        },
        setOrdersLoading(state) {
            state.status = "loading";
        },
        setOrdersError(state, action: PayloadAction<string>) {
            state.status = "failed";
            state.error = action.payload;
        },
    },
});

export const { setOrders, setOrdersLoading, setOrdersError } = ordersSlice.actions;
export default ordersSlice.reducer;
