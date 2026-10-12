import {
  mockDeliveries,
  mockRiders,
  riderProfile,
  type Delivery,
  type RiderRow,
} from "../data/mockData";

const delay = <T>(value: T) => Promise.resolve(value);

export const riderApi = {
  list: async (): Promise<RiderRow[]> => delay(mockRiders),
  getDetail: async (): Promise<typeof riderProfile> => delay(riderProfile),
  getDeliveries: async (status?: Delivery["status"]): Promise<Delivery[]> =>
    delay(
      status
        ? mockDeliveries.filter((item) => item.status === status)
        : mockDeliveries,
    ),
};
