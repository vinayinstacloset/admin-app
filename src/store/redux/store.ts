import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from "./slices/ordersSlice";
import adminUiReducer from "./slices/adminUiSlice";

export const store = configureStore({
    reducer: {
        orders: ordersReducer,
        adminUi: adminUiReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
