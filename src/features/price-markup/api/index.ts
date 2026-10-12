import {
  CATEGORY_TREE,
  GENDER_OPTIONS,
  NAVIGATION_IMAGES,
  PRODUCT_CATEGORY_IMAGES,
  buildMockSnapshot,
} from "../data/mockData";
import type {
  PriceMarkupMetadata,
  PriceMarkupSnapshot,
} from "../types/pricemarkup.types";

export const priceMarkupApi = {
  getSnapshot: (): PriceMarkupSnapshot => buildMockSnapshot(),
  getMetadata: (): PriceMarkupMetadata => ({
    genderOptions: GENDER_OPTIONS,
    categoryTree: CATEGORY_TREE,
    navigationImages: NAVIGATION_IMAGES,
    productCategoryImages: PRODUCT_CATEGORY_IMAGES,
  }),
};
