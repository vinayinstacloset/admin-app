import { mockBrands, type Brand } from "../data/mockData";

export const brandsApi = {
  list: async (): Promise<Brand[]> => Promise.resolve([...mockBrands]),
  create: async (brand: Brand): Promise<Brand> => Promise.resolve(brand),
  update: async (brand: Brand): Promise<Brand> => Promise.resolve(brand),
  remove: async (id: string): Promise<void> =>
    Promise.resolve(id).then(() => undefined),
};
