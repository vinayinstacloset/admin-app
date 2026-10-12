export interface SkuCategory {
  id: string;
  name: string;
  skus: number;
  lowStock: number;
  outOfStock: number;
  image: string;
}

export interface SkuTile {
  id: string;
  label: string;
  image: string;
}

export interface SkuGenderSection {
  gender: "MEN" | "WOMEN" | "TEENS" | "KIDS" | "GENZ";
  categories?: SkuCategory[];
  tiles?: Array<SkuTile & { categories: SkuCategory[] }>;
}
