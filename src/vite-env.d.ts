/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_API_ADMIN_BASE_URL: string;
    readonly VITE_API_ORDERS_BASE_URL: string;
    readonly VITE_API_VENDORS_BASE_URL: string;
    readonly VITE_API_RIDERS_BASE_URL: string;
    readonly VITE_API_CUSTOMERS_BASE_URL: string;
    readonly VITE_ADMIN_ID_KEY: string;
    readonly VITE_ADMIN_EMAIL_KEY: string;
    readonly VITE_ADMIN_NAME_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
