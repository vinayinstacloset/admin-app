import axios, { type AxiosInstance } from "axios";

import {
    API_BASE_URL,
    API_ADMIN_BASE_URL,
    API_ORDERS_BASE_URL,
    API_VENDORS_BASE_URL,
    API_RIDERS_BASE_URL,
    API_CUSTOMERS_BASE_URL,
} from "../../../config/env";

import { configureClient } from "./interceptors";
import { API_TIMEOUT, DEFAULT_HEADERS } from "../constants";

const createApiClient = (baseURL: string): AxiosInstance => {
    return axios.create({
        baseURL,
        timeout: API_TIMEOUT,
        headers: DEFAULT_HEADERS,
    });
};

export const clientAdmin = createApiClient(API_ADMIN_BASE_URL);
export const clientOrders = createApiClient(API_ORDERS_BASE_URL);
export const clientVendors = createApiClient(API_VENDORS_BASE_URL);
export const clientRiders = createApiClient(API_RIDERS_BASE_URL);
export const clientCustomers = createApiClient(API_CUSTOMERS_BASE_URL);
export const clientBase = createApiClient(API_BASE_URL);

const apiClients: AxiosInstance[] = [
    clientAdmin,
    clientOrders,
    clientVendors,
    clientRiders,
    clientCustomers,
    clientBase,
];

apiClients.forEach(configureClient);

export const apiClient = clientAdmin;

export default apiClient;
