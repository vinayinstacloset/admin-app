import type {
  CatalogueEntityType,
  CatalogueGender,
  IntegrationItem,
} from "../types/catalogue.types";

export const genderOptions: CatalogueGender[] = [
  "MEN",
  "WOMEN",
  "TEENS",
  "KIDS",
  "GENZ",
];
export const navigationOptions: Record<CatalogueGender, string[]> = {
  MEN: [],
  WOMEN: [],
  TEENS: ["Boys", "Girls", "Unisex"],
  KIDS: ["Boys", "Girls", "Infants", "Add-ons"],
  GENZ: ["Boys", "Girls"],
};

export const productCategoryOptions = [
  "Topwear",
  "Bottomwear",
  "Ethnic Wear",
  "Accessories",
  "Footwear",
  "Sportswear",
];
export const categoryOptions = [
  "All",
  "Shirt",
  "T-Shirt",
  "Polo",
  "Jacket",
  "Hoodie",
  "Coat",
];
export const subCategoryOptions = [
  "All",
  "Casual",
  "Printed",
  "Formal",
  "Party",
  "Solid",
  "Checked",
  "Denim",
];

export const integrationLabel = (type: CatalogueEntityType) => {
  if (type === "product-category") return "product category";
  if (type === "sub-category") return "sub-category";
  return "category";
};

export const integrationCount = (
  items: IntegrationItem[],
  type: CatalogueEntityType,
  status?: IntegrationItem["status"],
) =>
  items.filter(
    (item) => item.entityType === type && (!status || item.status === status),
  ).length;

export const formatCurrency = (value: number) =>
  `₹${value.toLocaleString("en-IN")}`;
