import type {
  CategoryMarkup,
  GenderCategoryTree,
  GenderOption,
  Markup,
  MarkupVendor,
  PriceMarkupSnapshot,
  ProductVariant,
  VendorListing,
  VendorMarkup,
} from "../types/pricemarkup.types";

const ASSET_ROOT = "/price-markup";
const VENDOR_IMAGE = "/store-fable-street.jpg";

/* ------------------------------- Vendors ------------------------------- */

export const MOCK_VENDORS: MarkupVendor[] = [
  {
    id: "v1",
    name: "A-1 Fashion",
    location: "Lingampelli",
    owner: "Ayan Qureshi",
    image: VENDOR_IMAGE,
    totalUnitSold: 226,
    totalRevenue: 256000,
    totalSkus: 840,
  },
  {
    id: "v2",
    name: "A-2 Fashion",
    location: "Lingampelli",
    owner: "Ayan Qureshi",
    image: VENDOR_IMAGE,
    totalUnitSold: 198,
    totalRevenue: 214500,
    totalSkus: 620,
  },
  {
    id: "v3",
    name: "A-1 Fashion",
    location: "Bandra",
    owner: "Rohan Mehta",
    image: VENDOR_IMAGE,
    totalUnitSold: 174,
    totalRevenue: 183200,
    totalSkus: 512,
  },
  {
    id: "v4",
    name: "Fable Street",
    location: "Madhapur",
    owner: "Sana Sheikh",
    image: VENDOR_IMAGE,
    totalUnitSold: 312,
    totalRevenue: 402000,
    totalSkus: 1120,
  },
  {
    id: "v5",
    name: "Urban Closet",
    location: "Kukatpally",
    owner: "Kiran Reddy",
    image: VENDOR_IMAGE,
    totalUnitSold: 141,
    totalRevenue: 152800,
    totalSkus: 430,
  },
  {
    id: "v6",
    name: "Style Hub",
    location: "Ameerpet",
    owner: "Neha Kapoor",
    image: VENDOR_IMAGE,
    totalUnitSold: 267,
    totalRevenue: 298600,
    totalSkus: 905,
  },
  {
    id: "v7",
    name: "Threadline",
    location: "Banjara Hills",
    owner: "Arjun Rao",
    image: VENDOR_IMAGE,
    totalUnitSold: 121,
    totalRevenue: 132400,
    totalSkus: 388,
  },
  {
    id: "v8",
    name: "Denim Den",
    location: "Jubilee Hills",
    owner: "Farhan Ali",
    image: VENDOR_IMAGE,
    totalUnitSold: 95,
    totalRevenue: 101900,
    totalSkus: 296,
  },
  {
    id: "v9",
    name: "Ethnic Edit",
    location: "Secunderabad",
    owner: "Meera Iyer",
    image: VENDOR_IMAGE,
    totalUnitSold: 158,
    totalRevenue: 176700,
    totalSkus: 470,
  },
  {
    id: "v10",
    name: "Loom & Co",
    location: "Gachibowli",
    owner: "Vikram Singh",
    image: VENDOR_IMAGE,
    totalUnitSold: 83,
    totalRevenue: 91200,
    totalSkus: 254,
  },
];

export const MOCK_VENDOR_MARKUPS: VendorMarkup[] = [
  { id: "vm1", vendorId: "v1", markup: { kind: "discount", percent: 5 } },
  { id: "vm2", vendorId: "v4", markup: { kind: "hike", percent: 4 } },
  { id: "vm3", vendorId: "v6", markup: { kind: "discount", percent: 5 } },
  { id: "vm4", vendorId: "v5", markup: { kind: "hike", percent: 2 } },
];

/* ------------------------------- Products ------------------------------ */

interface SeedProduct {
  id: string;
  name: string;
  gender: string;
  image: string;
  color: string;
  colorHex: string;
  basePrice: number;
  sizes: { size: string; marked: boolean }[];
}

const SEED_PRODUCTS: SeedProduct[] = [
  {
    id: "prod-anime-tee",
    name: "Red bright Anime cool T-shirt for Gen-Z",
    gender: "Male",
    image: `${ASSET_ROOT}/product-red-tee.png`,
    color: "Red",
    colorHex: "#E66F77",
    basePrice: 599,
    sizes: [
      { size: "M", marked: true },
      { size: "L", marked: true },
      { size: "XL", marked: true },
    ],
  },
  {
    id: "prod-bold-graphic-tee",
    name: "Bold red graphic tee for Gen-Z",
    gender: "Male",
    image: `${ASSET_ROOT}/product-red-tee.png`,
    color: "Red",
    colorHex: "#E66F77",
    basePrice: 549,
    sizes: [
      { size: "S", marked: true },
      { size: "M", marked: true },
      { size: "L", marked: true },
    ],
  },
  {
    id: "prod-alone-tee",
    name: "Alone dark blue T-shirt for Gen-Z",
    gender: "Male",
    image: `${ASSET_ROOT}/product-blue-tee.png`,
    color: "Dark blue",
    colorHex: "#0B2A55",
    basePrice: 599,
    sizes: [
      { size: "M", marked: true },
      { size: "L", marked: false },
      { size: "XL", marked: true },
    ],
  },
  {
    id: "prod-midnight-tee",
    name: "Midnight blue oversized tee for Gen-Z",
    gender: "Male",
    image: `${ASSET_ROOT}/product-blue-tee.png`,
    color: "Dark blue",
    colorHex: "#0B2A55",
    basePrice: 649,
    sizes: [
      { size: "M", marked: true },
      { size: "L", marked: true },
    ],
  },
  {
    id: "prod-neon-street-tee",
    name: "Neon red street tee for Gen-Z",
    gender: "Male",
    image: `${ASSET_ROOT}/product-red-tee.png`,
    color: "Red",
    colorHex: "#E66F77",
    basePrice: 579,
    sizes: [
      { size: "M", marked: true },
      { size: "L", marked: true },
    ],
  },
];

const MARKUP_PATTERN: Markup[] = [
  { kind: "hike", percent: 5 },
  { kind: "discount", percent: 5 },
  { kind: "hike", percent: 5 },
  { kind: "discount", percent: 9 },
  { kind: "hike", percent: 12 },
];

const VENDORS_PER_VARIANT = ["v2", "v3", "v4", "v5", "v6"];
const MARKED_VENDOR_ROTATION = ["v1", "v4", "v5", "v6", "v2"];

const buildListings = (
  basePrice: number,
  marked: boolean,
  seed: number,
): VendorListing[] => {
  if (!marked) {
    // Un-marked variants list every vendor with no markup yet (the "Add Markup" flow).
    return VENDORS_PER_VARIANT.map((vendorId) => ({
      vendorId,
      sellingPrice: basePrice,
      markup: null,
    }));
  }

  const count = 3 + (seed % 3);
  return Array.from({ length: count }, (_, index) => ({
    vendorId:
      MARKED_VENDOR_ROTATION[(index + seed) % MARKED_VENDOR_ROTATION.length],
    sellingPrice: basePrice + (index === 1 ? 10 : 0),
    markup: MARKUP_PATTERN[(index + seed) % MARKUP_PATTERN.length],
  }));
};

const buildVariants = (): ProductVariant[] => {
  const variants: ProductVariant[] = [];
  let seed = 0;

  SEED_PRODUCTS.forEach((product) => {
    product.sizes.forEach(({ size, marked }) => {
      const unitSold = 226 - seed * 11;
      const revenue =
        Math.round((unitSold * product.basePrice * 1.85) / 1000) * 1000;

      variants.push({
        id: `${product.id}-${size.toLowerCase()}`,
        productId: product.id,
        name: product.name,
        gender: product.gender,
        size,
        color: product.color,
        colorHex: product.colorHex,
        image: product.image,
        unitSold,
        revenue,
        averagePrice: product.basePrice - 32,
        listings: buildListings(product.basePrice, marked, seed),
      });

      seed += 1;
    });
  });

  // Numbers taken straight from the design so the first two records read the same.
  const anime = variants.find((variant) => variant.id === "prod-anime-tee-m");
  if (anime) {
    anime.unitSold = 226;
    anime.revenue = 256000;
  }

  const alone = variants.find((variant) => variant.id === "prod-alone-tee-l");
  if (alone) {
    alone.unitSold = 207;
    alone.revenue = 134455;
    alone.averagePrice = 567;
  }

  return variants;
};

/* ------------------------------- Categories ---------------------------- */

export const GENDER_OPTIONS: GenderOption[] = [
  { id: "men", label: "Men", icon: `${ASSET_ROOT}/gender-men.png` },
  { id: "women", label: "Women", icon: `${ASSET_ROOT}/gender-women.png` },
  { id: "teens", label: "Teens", icon: `${ASSET_ROOT}/gender-teens.png` },
  { id: "kids", label: "Kids", icon: `${ASSET_ROOT}/gender-kids.png` },
  { id: "genz", label: "Genz", icon: `${ASSET_ROOT}/gender-genz.png` },
];

export const CATEGORY_TREE: Record<string, GenderCategoryTree> = {
  men: {
    navigations: [],
    productCategories: [
      {
        name: "Ethnic wear",
        categories: ["Kurta", "Sherwani", "Nehru jacket"],
      },
      { name: "Top wear", categories: ["T-shirt", "Shirt", "Polo"] },
      { name: "Bottom wear", categories: ["Jeans", "Chinos", "Track pants"] },
    ],
  },
  women: {
    navigations: [],
    productCategories: [
      { name: "Suits", categories: ["Lehenga", "Anarkali", "Salwar suit"] },
      { name: "Western wear", categories: ["Dress", "Top", "Jumpsuit"] },
      { name: "Ethnic wear", categories: ["Saree", "Kurti"] },
    ],
  },
  teens: {
    navigations: ["Boys", "Girls"],
    productCategories: [
      { name: "Sportswear", categories: ["T-shirt", "Track pants", "Shorts"] },
      { name: "Top wear", categories: ["Polo", "Shirt"] },
    ],
  },
  kids: {
    navigations: ["Boys", "Girls"],
    productCategories: [
      {
        name: "Loungewear",
        categories: ["Lounge Tops", "Lounge Bottoms", "Night suit"],
      },
      { name: "Top wear", categories: ["T-shirt", "Shirt"] },
    ],
  },
  genz: {
    navigations: ["Boys", "Girls"],
    productCategories: [
      { name: "Top wear", categories: ["Polo", "Graphic tee", "Hoodie"] },
      { name: "Bottom wear", categories: ["Cargo pants", "Jeans"] },
    ],
  },
};

/** Thumbnails that exist in the design; anything else falls back to an initial-letter tile. */
export const NAVIGATION_IMAGES: Record<string, string> = {
  "teens:Boys": `${ASSET_ROOT}/nav-teens-boys.png`,
  "kids:Boys": `${ASSET_ROOT}/nav-kids-boys.png`,
  "genz:Boys": `${ASSET_ROOT}/nav-genz-boys.png`,
};

export const PRODUCT_CATEGORY_IMAGES: Record<string, string> = {
  "Ethnic wear": `${ASSET_ROOT}/pc-ethnic-wear.png`,
  Suits: `${ASSET_ROOT}/pc-suits.png`,
  Sportswear: `${ASSET_ROOT}/pc-sportswear.png`,
  Loungewear: `${ASSET_ROOT}/pc-loungewear.png`,
  "Top wear": `${ASSET_ROOT}/pc-top-wear.png`,
};

export const MOCK_CATEGORY_MARKUPS: CategoryMarkup[] = [
  {
    id: "cm1",
    genderId: "men",
    navigation: null,
    productCategory: "Ethnic wear",
    category: "Kurta",
    markup: { kind: "discount", percent: 6 },
  },
  {
    id: "cm2",
    genderId: "women",
    navigation: null,
    productCategory: "Suits",
    category: "Lehenga",
    markup: { kind: "hike", percent: 3 },
  },
  {
    id: "cm3",
    genderId: "teens",
    navigation: "Boys",
    productCategory: "Sportswear",
    category: "T-shirt",
    markup: { kind: "discount", percent: 5 },
  },
  {
    id: "cm4",
    genderId: "kids",
    navigation: "Boys",
    productCategory: "Loungewear",
    category: "Lounge Tops",
    markup: { kind: "hike", percent: 2 },
  },
  {
    id: "cm5",
    genderId: "teens",
    navigation: "Boys",
    productCategory: "Sportswear",
    category: "Track pants",
    markup: { kind: "discount", percent: 5 },
  },
  {
    id: "cm6",
    genderId: "kids",
    navigation: "Boys",
    productCategory: "Loungewear",
    category: "Night suit",
    markup: { kind: "hike", percent: 2 },
  },
  {
    id: "cm7",
    genderId: "genz",
    navigation: "Boys",
    productCategory: "Top wear",
    category: "Polo",
    markup: { kind: "discount", percent: 4 },
  },
  {
    id: "cm8",
    genderId: "women",
    navigation: null,
    productCategory: "Suits",
    category: "Anarkali",
    markup: { kind: "hike", percent: 3 },
  },
  {
    id: "cm9",
    genderId: "men",
    navigation: null,
    productCategory: "Ethnic wear",
    category: "Sherwani",
    markup: { kind: "discount", percent: 6 },
  },
  {
    id: "cm10",
    genderId: "genz",
    navigation: "Boys",
    productCategory: "Top wear",
    category: "Hoodie",
    markup: { kind: "discount", percent: 4 },
  },
  {
    id: "cm11",
    genderId: "men",
    navigation: null,
    productCategory: "Top wear",
    category: "T-shirt",
    markup: { kind: "hike", percent: 3 },
  },
  {
    id: "cm12",
    genderId: "women",
    navigation: null,
    productCategory: "Western wear",
    category: "Dress",
    markup: { kind: "discount", percent: 7 },
  },
  {
    id: "cm13",
    genderId: "kids",
    navigation: "Girls",
    productCategory: "Loungewear",
    category: "Lounge Tops",
    markup: { kind: "hike", percent: 2 },
  },
  {
    id: "cm14",
    genderId: "teens",
    navigation: "Girls",
    productCategory: "Top wear",
    category: "Shirt",
    markup: { kind: "discount", percent: 3 },
  },
  {
    id: "cm15",
    genderId: "genz",
    navigation: "Girls",
    productCategory: "Bottom wear",
    category: "Jeans",
    markup: { kind: "hike", percent: 6 },
  },
];

export const buildMockSnapshot = (): PriceMarkupSnapshot => ({
  vendors: MOCK_VENDORS,
  variants: buildVariants(),
  categoryMarkups: MOCK_CATEGORY_MARKUPS,
  vendorMarkups: MOCK_VENDOR_MARKUPS,
});
