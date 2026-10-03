import type { SettingsState } from "../types/settings.types";

export const mockSettings: SettingsState = {
    profile: {
        fullName: "Ayan Qureshi",
        email: "ayanqureshi@gmail.com",
        mobile: "+91 82654 45132",
        pictureUrl: "https://i.pravatar.cc/160?img=12",
    },
    platform: {
        maintenanceMode: false,
        autoApproveLowRiskVendors: false,
        sendLowRatingWarnings: true,
        newOrderNotifications: false,
    },
    commission: {
        defaultVendorCommission: 10,
        riderPayoutPerDelivery: 40,
    },
};
