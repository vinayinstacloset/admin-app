export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const API_ADMIN_BASE_URL =
  (import.meta.env.VITE_API_ADMIN_BASE_URL as string) || API_BASE_URL;
export const API_ORDERS_BASE_URL =
  (import.meta.env.VITE_API_ORDERS_BASE_URL as string) || API_BASE_URL;
export const API_VENDORS_BASE_URL =
  (import.meta.env.VITE_API_VENDORS_BASE_URL as string) || API_BASE_URL;
export const API_RIDERS_BASE_URL =
  (import.meta.env.VITE_API_RIDERS_BASE_URL as string) || API_BASE_URL;
export const API_CUSTOMERS_BASE_URL =
  (import.meta.env.VITE_API_CUSTOMERS_BASE_URL as string) || API_BASE_URL;

export const ADMIN_ID_KEY =
  (import.meta.env.VITE_ADMIN_ID_KEY as string) || "adminReferenceId";
export const ADMIN_EMAIL_KEY =
  (import.meta.env.VITE_ADMIN_EMAIL_KEY as string) || "adminEmail";
export const ADMIN_NAME_KEY =
  (import.meta.env.VITE_ADMIN_NAME_KEY as string) || "adminName";
export const ADMIN_MOBILE_KEY =
  (import.meta.env.VITE_ADMIN_MOBILE_KEY as string) || "adminMobile";
