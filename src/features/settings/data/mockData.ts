import type { SettingsState } from "../types/settings.types";

export const mockSettings: SettingsState = {
  profile: {
    fullName: "Ayan Qureshi",
    email: "ayanqureshi@gmail.com",
    mobile: "+91 82654 45132",
    pictureUrl: "https://picsum.photos/seed/admin-profile/64/64",
  },
  platform: {
    maintenanceMode: false,
    autoApproveLowRiskVendors: true,
    sendLowRatingWarnings: false,
    newOrderNotifications: false,
  },
  commission: {
    defaultVendorCommission: 10,
    riderPayoutPerDelivery: 40,
  },
  deliveryCharges: [
    { km: 1, amount: 30 },
    { km: 2, amount: 40 },
    { km: 3, amount: 45 },
    { km: 4, amount: null },
    { km: 5, amount: null },
  ],
};
