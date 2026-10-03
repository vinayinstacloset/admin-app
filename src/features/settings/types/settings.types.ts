export interface SettingsProfile {
    fullName: string;
    email: string;
    mobile: string;
    pictureUrl: string;
}

export interface PlatformSettings {
    maintenanceMode: boolean;
    autoApproveLowRiskVendors: boolean;
    sendLowRatingWarnings: boolean;
    newOrderNotifications: boolean;
}

export interface CommissionSettings {
    defaultVendorCommission: number;
    riderPayoutPerDelivery: number;
}

export interface SettingsState {
    profile: SettingsProfile;
    platform: PlatformSettings;
    commission: CommissionSettings;
}
