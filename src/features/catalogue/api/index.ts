import {
  catalogueProducts,
  catalogueSections,
  catalogueStores,
  integrationItems,
} from "../data/mockData";
import type {
  CatalogueGender,
  CatalogueProduct,
  CatalogueStoreRow,
  IntegrationItem,
} from "../types/catalogue.types";

export const catalogueApi = {
  listStores(): CatalogueStoreRow[] {
    return catalogueStores;
  },
  listSections() {
    return catalogueSections;
  },
  listIntegration(): IntegrationItem[] {
    return integrationItems;
  },
  listProducts(
    _gender: CatalogueGender,
    _productCategory: string,
  ): CatalogueProduct[] {
    return catalogueProducts;
  },
};
