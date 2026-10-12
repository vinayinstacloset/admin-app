export type MarkupKind = "discount" | "hike";

export interface Markup {
  kind: MarkupKind;
  percent: number;
}

export type PriceMarkupTab = "product" | "category" | "vendor";

export type ProductSortKey =
  "sold-desc" | "sold-asc" | "revenue-desc" | "revenue-asc";

/* ------------------------------ Vendors ------------------------------ */

export interface MarkupVendor {
  id: string;
  name: string;
  location: string;
  owner: string;
  image: string;
  totalUnitSold: number;
  totalRevenue: number;
  totalSkus: number;
}

export interface VendorMarkup {
  id: string;
  vendorId: string;
  markup: Markup;
}

/* ------------------------------ Products ----------------------------- */

export interface VendorListing {
  vendorId: string;
  sellingPrice: number;
  markup: Markup | null;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  gender: string;
  size: string;
  color: string;
  colorHex: string;
  image: string;
  unitSold: number;
  revenue: number;
  averagePrice: number;
  listings: VendorListing[];
}

/* ------------------------------ Categories --------------------------- */

export interface GenderOption {
  id: string;
  label: string;
  icon: string;
}

export interface ProductCategoryNode {
  name: string;
  categories: string[];
}

export interface GenderCategoryTree {
  navigations: string[];
  productCategories: ProductCategoryNode[];
}

export interface CategoryMarkup {
  id: string;
  genderId: string;
  navigation: string | null;
  productCategory: string;
  category: string;
  markup: Markup;
}

export type CategoryMarkupInput = Omit<CategoryMarkup, "id">;

export interface PriceMarkupSnapshot {
  vendors: MarkupVendor[];
  variants: ProductVariant[];
  categoryMarkups: CategoryMarkup[];
  vendorMarkups: VendorMarkup[];
}

export interface PriceMarkupMetadata {
  genderOptions: GenderOption[];
  categoryTree: Record<string, GenderCategoryTree>;
  navigationImages: Record<string, string>;
  productCategoryImages: Record<string, string>;
}
