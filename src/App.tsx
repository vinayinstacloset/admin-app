import { Routes, Route, Navigate } from "react-router-dom";

import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import LoginScreen from "./features/login/screens/LoginScreen";
import RegistrationScreen from "./features/registration/screens/RegistrationScreen";
import ForgotPasswordScreen from "./features/forgot-password/screens/ForgotPasswordScreen";

import OverviewScreen from "./features/overview/screens/OverviewScreen";

import OrdersScreen from "./features/orders/screens/OrdersScreen";
import OrderDetailsScreen from "./features/orders/screens/OrderDetailsScreen";

import CustomersScreen from "./features/customers/screens/CustomersScreen";
import CustomerDetailsScreen from "./features/customers/screens/CustomerDetailsScreen";

import VendorsScreen from "./features/vendors/screens/VendorsScreen";
import VendorDetailsScreen from "./features/vendors/screens/VendorDetailsScreen";

import RidersScreen from "./features/riders/screens/RidersScreen";
import RiderDetailsScreen from "./features/riders/screens/RiderDetailsScreen";

import StoreScreen from "./features/store/screens/StoreScreen";
import CatalogueScreen from "./features/catalogue/screens/CatalogueScreen";
import ApprovalsScreen from "./features/approvals/screens/ApprovalsScreen";
import AdminsScreen from "./features/admins/screens/AdminsScreen";
import SupportScreen from "./features/support/screens/SupportScreen";
import LiveDeliveryScreen from "./features/live-delivery/screens/LiveDeliveryScreen";
import TicketIssueScreen from "./features/ticket-issue/screens/TicketIssueScreen";
import EscalationTicketsScreen from "./features/escalation-tickets/screens/EscalationTicketsScreen";
import AnalyticsScreen from "./features/analytics/screens/AnalyticsScreen";
import PriceMarkupScreen from "./features/price-markup/screens/PriceMarkupScreen";
import BrandsScreen from "./features/brands/screens/BrandsScreen";
import BannerCampaignsScreen from "./features/banner-campaigns/screens/BannerCampaignsScreen";
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
                <Route
                    path="/register"
                    element={<RegistrationScreen />}
                />
                <Route
                    path="/forgot-password"
                    element={<ForgotPasswordScreen />}
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
                        path="customers"
                        element={<CustomersScreen />}
                    />
                    <Route
                        path="customers/:customerId"
                        element={<CustomerDetailsScreen />}
                    />

                    <Route
                        path="admins"
                        element={<AdminsScreen />}
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
                        path="riders"
                        element={<RidersScreen />}
                    />
                    <Route
                        path="riders/:riderId"
                        element={<RiderDetailsScreen />}
                    />

                    <Route
                        path="support"
                        element={<SupportScreen />}
                    />
                    <Route
                        path="live-delivery"
                        element={<LiveDeliveryScreen />}
                    />
                    <Route
                        path="ticket-issue"
                        element={<TicketIssueScreen />}
                    />
                    <Route
                        path="escalation-ticket"
                        element={<EscalationTicketsScreen />}
                    />

                    <Route
                        path="analytics"
                        element={<AnalyticsScreen />}
                    />
                    <Route
                        path="price-markup"
                        element={<PriceMarkupScreen />}
                    />
                    <Route
                        path="brands"
                        element={<BrandsScreen />}
                    />
                    <Route
                        path="banner-campaigns"
                        element={<BannerCampaignsScreen />}
                    />

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

            {/* <Route
                path="/"
                element={
                    <Navigate
                        to="/admin-dashboard"
                        replace
                    />
                }
            />
            <Route
                path="*"
                element={
                    <Navigate
                        to="/admin-dashboard"
                        replace
                    />
                }
            /> */}
        </Routes>
    );
}
