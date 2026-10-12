export type CatalogueGender = "MEN" | "WOMEN" | "TEENS" | "KIDS" | "GENZ";
export type IntegrationType = "PRODUCT CATEGORY" | "CATEGORY" | "SUB-CATEGORY";
export type IntegrationStatus = "pending" | "approved" | "rejected";
export type CatalogueEntityType =
  "product-category" | "category" | "sub-category";

export interface CatalogueCategory {
  id: string;
  name: string;
  image: string;
  skus: number;
  lowStock: number;
  outOfStock: number;
}

export interface CatalogueNavigationTile {
  id: string;
  label: string;
  image: string;
  categories: CatalogueCategory[];
}

export interface CatalogueGenderSection {
  gender: CatalogueGender;
  categories?: CatalogueCategory[];
  navigation?: CatalogueNavigationTile[];
}

export interface CatalogueStoreRow {
  id: string;
  name: string;
  state: string;
  image: string;
  totalSkus: number;
  menSkus: number;
  womenSkus: number;
  teensSkus: number;
  kidsSkus: number;
  genzSkus: number;
  pending: number;
}

export interface IntegrationItem {
  id: string;
  entityType: CatalogueEntityType;
  gender: CatalogueGender;
  navigation?: string;
  productCategory?: string;
  category?: string;
  name: string;
  image: string;
  store: string;
  status: IntegrationStatus;
}

export interface CatalogueProduct {
  id: string;
  image: string;
  name: string;
  size: string;
  color: string;
  unitSold: number;
  revenue: number;
  stock: number;
  rating: number;
  price: number;
  productCategory: string;
  category: string;
  subCategory: string;
  fabrics: string;
  sustainable: string;
  material: string;
  care: string;
  discount: number;
  calculatedPrice: number;
  details: string[];
  fit: string;
}

export interface CatalogueAddForm {
  entityType: CatalogueEntityType;
  gender: CatalogueGender;
  navigation: string;
  productCategory: string;
  category: string;
  image: string;
  name: string;
}
