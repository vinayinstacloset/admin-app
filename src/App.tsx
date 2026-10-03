import { Routes, Route, Navigate } from "react-router-dom";

import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import LoginScreen from "./features/login/screens/LoginScreen";

import OverviewScreen from "./features/overview/screens/OverviewScreen";

import OrdersScreen from "./features/orders/screens/OrdersScreen";
import OrderDetailsScreen from "./features/orders/screens/OrderDetailsScreen";

import CustomersScreen from "./features/customers/screens/CustomersScreen";
import CustomerDetailsScreen from "./features/customers/screens/CustomerDetailsScreen";
import CustomerOrderDetailsScreen from "./features/customers/screens/CustomerOrderDetailsScreen";

import VendorsScreen from "./features/vendors/screens/VendorsScreen";
import VendorDetailsScreen from "./features/vendors/screens/VendorDetailsScreen";

import RidersScreen from "./features/riders/screens/RidersScreen";
import RiderDetailsScreen from "./features/riders/screens/RiderDetailsScreen";
import RiderOrderDetailsScreen from "./features/riders/screens/RiderOrderDetailsScreen";
import BrandsScreen from "./features/brands/screens/BrandsScreen";

import StoreScreen from "./features/store/screens/StoreScreen";
import CatalogueScreen from "./features/catalogue/screens/CatalogueScreen";
import ApprovalsScreen from "./features/approvals/screens/ApprovalsScreen";
import ApprovalDetailScreen from "./features/approvals/screens/ApprovalDetailScreen";
import LiveDeliveryScreen from "./features/live-delivery/screens/LiveDeliveryScreen";
import PriceMarkupScreen from "./features/price-markup/screens/PriceMarkupScreen";
import AddMarkupScreen from "./features/price-markup/screens/AddMarkupScreen";
import OfferCouponScreen from "./features/offer-coupon/screens/OfferCouponScreen";
import FinanceScreen from "./features/finance/screens/FinanceScreen";
import ReturnsScreen from "./features/returns/screens/ReturnsScreen";
import ExchangeScreen from "./features/exchange/screens/ExchangeScreen";
import SettingsScreen from "./features/settings/screens/SettingsScreen";

export default function App() {
    return (
        <Routes>
            {/* Public / auth routes */}
            {/* <Route element={<PublicRoute />}> */}
                <Route
                    path="/"
                    element={<LoginScreen />}
            />

            <Route
                path="/login"
                element={<LoginScreen />}
            />

            {/* </Route> */}

            {/* Protected admin dashboard */}
            {/* <Route element={<ProtectedRoute />}> */}
                <Route
                    path="/admin-dashboard"
                    element={<DashboardLayout />}
                >
                    <Route
                        index
                        element={<OverviewScreen />}
                    />

                    <Route
                        path="store"
                        element={<StoreScreen />}
                    />
                    <Route
                        path="store/:storeId"
                        element={<StoreScreen />}
                    />
                    <Route
                        path="store/:storeId/orders"
                        element={<StoreScreen />}
                    />
                    <Route
                        path="store/:storeId/skus"
                        element={<StoreScreen />}
                    />
                    <Route
                        path="store/:storeId/reviews"
                        element={<StoreScreen />}
                    />

                    <Route
                        path="orders"
                        element={<OrdersScreen />}
                    />
                    <Route
                        path="orders/:orderId"
                        element={<OrderDetailsScreen />}
                    />

                    <Route
                        path="catalogue"
                        element={<CatalogueScreen />}
                    />
                    <Route
                        path="approvals"
                        element={<ApprovalsScreen />}
                    />
                    <Route
                        path="approvals/:approvalId"
                        element={<ApprovalDetailScreen />}
                    />

                    <Route
                        path="customers"
                        element={<CustomersScreen />}
                    />
                    <Route
                        path="customers/:customerId"
                        element={<CustomerDetailsScreen />}
                    />
                    <Route
                        path="customers/:customerId/orders/:orderId"
                        element={<CustomerOrderDetailsScreen kind="order" />}
                    />
                    <Route
                        path="customers/:customerId/returns/:orderId"
                        element={<CustomerOrderDetailsScreen kind="return" />}
                    />
                    <Route
                        path="customers/:customerId/exchanges/:orderId"
                        element={<CustomerOrderDetailsScreen kind="exchange" />}
                    />

                    <Route
                        path="vendor"
                        element={<VendorsScreen />}
                    />
                    <Route
                        path="vendor/:vendorId"
                        element={<VendorDetailsScreen />}
                    />
                    <Route
                        path="vendor/:vendorId/orders"
                        element={<VendorDetailsScreen />}
                    />
                    <Route
                        path="vendor/:vendorId/skus"
                        element={<VendorDetailsScreen />}
                    />
                    <Route
                        path="vendor/:vendorId/chats"
                        element={<VendorDetailsScreen />}
                    />
                    <Route
                        path="vendor/:vendorId/reviews"
                        element={<VendorDetailsScreen />}
                    />

                    <Route
                        path="riders"
                        element={<RidersScreen />}
                    />
                    <Route
                        path="riders/:riderId"
                        element={<RiderDetailsScreen />}
                    />
                    <Route
                        path="riders/:riderId/orders/:orderId"
                        element={<RiderOrderDetailsScreen />}
                    />

                    <Route
                        path="live-delivery"
                        element={<LiveDeliveryScreen />}
                    />
                    <Route path="price-markup" element={<PriceMarkupScreen />} />
                    <Route path="price-markup/add/:variantId" element={<AddMarkupScreen />} />
                    <Route path="offer-coupon" element={<OfferCouponScreen />} />
                    <Route path="brands" element={<BrandsScreen />} />

                    <Route
                        path="finance"
                        element={<FinanceScreen />}
                    />
                    <Route
                        path="returns"
                        element={<ReturnsScreen />}
                    />
                <Route
                    path="exchange"
                    element={<ExchangeScreen />}
                />
                <Route
                    path="settings"
                    element={<SettingsScreen />}
                />
                </Route>
            {/* </Route> */}

        </Routes>
    );
}
