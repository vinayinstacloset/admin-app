import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientVendors } from "../../../shared/api/client/apiClient";
import {
  mockVendorDetail,
  mockVendorTotal,
  mockVendors,
} from "../data/mockData";
import type { VendorDetail, VendorListResponse } from "../types/vendor.types";

export const vendorApi = {
  getList: async (): Promise<VendorListResponse> => {
    try {
      const { data } = await clientVendors.get<VendorListResponse>("/vendors");
      return data;
    } catch (error) {
      console.warn(
        "Falling back to mock vendor list:",
        getApiErrorMessage(error),
      );
      return { total: mockVendorTotal, rows: mockVendors };
    }
  },
  getVendorDetail: async (vendorId: string): Promise<VendorDetail> => {
    try {
      const { data } = await clientVendors.get<VendorDetail>(
        `/vendors/${vendorId}`,
      );
      return data;
    } catch (error) {
      console.warn(
        "Falling back to mock vendor detail:",
        getApiErrorMessage(error),
      );
      return mockVendorDetail;
    }
  },
};
