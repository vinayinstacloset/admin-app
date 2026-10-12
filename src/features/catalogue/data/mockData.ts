import type {
  CatalogueAddForm,
  CatalogueCategory,
  CatalogueGenderSection,
  CatalogueNavigationTile,
  CatalogueProduct,
  CatalogueStoreRow,
  IntegrationItem,
} from "../types/catalogue.types";

const img = (url: string) => `${url}?auto=format&fit=crop&w=720&q=85`;

const category = (
  id: string,
  name: string,
  image: string,
  skus = 112,
  lowStock = 5,
  outOfStock = 2,
): CatalogueCategory => ({
  id,
  name,
  image: img(image),
  skus,
  lowStock,
  outOfStock,
});

const menCategories = [
  category(
    "men-all",
    "All categories",
    "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
    210,
    24,
    11,
  ),
  category(
    "men-topwear",
    "Topwear",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  ),
  category(
    "men-bottomwear",
    "Bottomwear",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
  ),
  category(
    "men-ethnic",
    "Ethnic Wear",
    "https://images.unsplash.com/photo-1610652492500-ded49ceeb378",
  ),
  category(
    "men-accessories",
    "Accessories",
    "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561",
  ),
  category(
    "men-footwear",
    "Footwear",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  ),
  category(
    "men-sportswear",
    "Sportswear",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  ),
];

const womenCategories = [
  category(
    "women-all",
    "All categories",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    184,
    18,
    10,
  ),
  category(
    "women-suits",
    "Suits",
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
  ),
  category(
    "women-wedding",
    "Wedding",
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
  ),
  category(
    "women-ethnic",
    "Ethnic Wear",
    "https://images.unsplash.com/photo-1583391733956-6c78276477e2",
  ),
  category(
    "women-accessories",
    "Accessories",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338",
  ),
];

const makeCategories = (
  prefix: string,
  photo: string,
  names: string[] = ["All categories", "Topwear", "Sportswear", "Accessories"],
): CatalogueCategory[] =>
  names.map((name, index) =>
    category(
      `${prefix}-${index}`,
      name,
      index === 0
        ? photo
        : ([
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338",
          ][index - 1] ?? photo),
      index === 0 ? 67 : 112,
      index === 0 ? 16 : 5,
      index === 0 ? 13 : 2,
    ),
  );

const tile = (
  id: string,
  label: string,
  image: string,
  categories: CatalogueCategory[],
): CatalogueNavigationTile => ({
  id,
  label,
  image: img(image),
  categories,
});

export const catalogueSections: CatalogueGenderSection[] = [
  { gender: "MEN", categories: menCategories },
  { gender: "WOMEN", categories: womenCategories },
  {
    gender: "TEENS",
    navigation: [
      tile(
        "teens-boys",
        "Boys",
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
        makeCategories(
          "teens-boys",
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
        ),
      ),
      tile(
        "teens-girls",
        "Girls",
        "https://images.unsplash.com/photo-1544717305-2782549b5136",
        makeCategories(
          "teens-girls",
          "https://images.unsplash.com/photo-1544717305-2782549b5136",
        ),
      ),
      tile(
        "teens-unisex",
        "Unisex",
        "https://images.unsplash.com/photo-1529391409740-57d6a6c0e2b5",
        makeCategories(
          "teens-unisex",
          "https://images.unsplash.com/photo-1529391409740-57d6a6c0e2b5",
        ),
      ),
    ],
  },
  {
    gender: "KIDS",
    navigation: [
      tile(
        "kids-boys",
        "Boys",
        "https://images.unsplash.com/photo-1519457431-44ccd64a579b",
        makeCategories(
          "kids-boys",
          "https://images.unsplash.com/photo-1519457431-44ccd64a579b",
          ["All categories", "Shoes", "Loungewear", "Sportswear"],
        ),
      ),
      tile(
        "kids-girls",
        "Girls",
        "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42",
        makeCategories(
          "kids-girls",
          "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42",
          ["All categories", "Shoes", "Loungewear", "Sportswear"],
        ),
      ),
      tile(
        "kids-infants",
        "Infants",
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4",
        makeCategories(
          "kids-infants",
          "https://images.unsplash.com/photo-1503919545889-aef636e10ad4",
          ["All categories", "Shoes", "Loungewear", "Sportswear"],
        ),
      ),
      tile(
        "kids-addons",
        "Add-ons",
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
        makeCategories(
          "kids-addons",
          "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
          ["All categories", "Shoes", "Loungewear", "Sportswear"],
        ),
      ),
    ],
  },
  {
    gender: "GENZ",
    navigation: [
      tile(
        "genz-boys",
        "Boys",
        "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea",
        makeCategories(
          "genz-boys",
          "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea",
          ["All categories", "Topwear", "Sportswear"],
        ),
      ),
      tile(
        "genz-girls",
        "Girls",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
        makeCategories(
          "genz-girls",
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
          ["All categories", "Topwear", "Sportswear"],
        ),
      ),
    ],
  },
];

export const catalogueStores: CatalogueStoreRow[] = Array.from(
  { length: 12 },
  (_, index) => ({
    id: `catalogue-store-${index + 1}`,
    name: index === 0 ? "NIKE" : index < 5 ? "Q-1 Fashion" : "A-1 Fashion",
    state: index % 2 === 0 ? "Telangana" : "Maharashtra",
    image: "/store-fable-street.jpg",
    totalSkus: index === 0 ? 840 : 1127,
    menSkus: index === 0 ? 210 : 256,
    womenSkus: index === 0 ? 184 : 231,
    teensSkus: index === 0 ? 195 : 209,
    kidsSkus: index === 0 ? 197 : 215,
    genzSkus: index === 0 ? 54 : 71,
    pending: index === 0 ? 3 : 2,
  }),
);

const productImages = [
  img("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"),
  img("https://images.unsplash.com/photo-1503341504253-dff4815485f1"),
  img("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"),
];

export const catalogueProducts: CatalogueProduct[] = Array.from(
  { length: 8 },
  (_, index) => ({
    id: `sku-${index + 1}`,
    image: productImages[index % productImages.length],
    name:
      index % 2 ? "Cotton Shirt" : "Red bright Anime cool T-shirt for Gen-Z",
    size: index % 2 ? "S" : "M",
    color: index % 2 ? "White" : "Red",
    unitSold: 75,
    revenue: 83100,
    stock: index < 5 ? 8 : 0,
    rating: 4.4,
    price: index % 2 ? 599 : 549,
    productCategory: "Topwear",
    category: "T-Shirt",
    subCategory: index % 2 ? "Casual" : "Printed",
    fabrics: "Linen",
    sustainable: "Regular",
    material: "Linen",
    care: "Machine Wash",
    discount: 12,
    calculatedPrice: 499,
    details: [
      "Olive Green and Olive Green Regular tops",
      "Geometric Printed",
      "Round Neck, Sleeveless, No sleeves",
      "Woven Linen",
      "Oversized fit",
    ],
    fit: "The model (height 5'8) is wearing a size S",
  }),
);

const integrationImages = [
  img("https://images.unsplash.com/photo-1503341504253-dff4815485f1"),
  img("https://images.unsplash.com/photo-1506629905607-d9f4b7d5a2a0"),
  img("https://images.unsplash.com/photo-1542291026-7eec264c27ff"),
  img("https://images.unsplash.com/photo-1517836357463-d25dfeac3438"),
];

export const integrationItems: IntegrationItem[] = [
  {
    id: "pc-1",
    entityType: "product-category",
    gender: "MEN",
    name: "Streetwear",
    image: integrationImages[0],
    store: "A-1 Fashion",
    status: "pending",
  },
  {
    id: "pc-2",
    entityType: "product-category",
    gender: "WOMEN",
    name: "Loungewear",
    image: integrationImages[1],
    store: "A-2 Fashion",
    status: "pending",
  },
  {
    id: "pc-3",
    entityType: "product-category",
    gender: "KIDS",
    navigation: "Boys",
    name: "Shoes",
    image: integrationImages[2],
    store: "Puma",
    status: "pending",
  },
  {
    id: "pc-4",
    entityType: "product-category",
    gender: "TEENS",
    navigation: "Girls",
    name: "Sportswear",
    image: integrationImages[3],
    store: "Nike",
    status: "pending",
  },
  {
    id: "pc-5",
    entityType: "product-category",
    gender: "MEN",
    name: "Streetwear",
    image: integrationImages[0],
    store: "A-1 Fashion",
    status: "pending",
  },
  {
    id: "pc-6",
    entityType: "product-category",
    gender: "WOMEN",
    name: "Loungewear",
    image: integrationImages[1],
    store: "A-2 Fashion",
    status: "pending",
  },
  {
    id: "pc-7",
    entityType: "product-category",
    gender: "KIDS",
    navigation: "Boys",
    name: "Shoes",
    image: integrationImages[2],
    store: "Puma",
    status: "pending",
  },
  {
    id: "cat-1",
    entityType: "category",
    gender: "MEN",
    productCategory: "Topwear",
    name: "Pocket T-shirt",
    image: img("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"),
    store: "A-1 Fashion",
    status: "pending",
  },
  {
    id: "cat-2",
    entityType: "category",
    gender: "MEN",
    productCategory: "Topwear",
    name: "Pocket T-shirt",
    image: img("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"),
    store: "A-1 Fashion",
    status: "pending",
  },
  {
    id: "cat-3",
    entityType: "category",
    gender: "MEN",
    productCategory: "Topwear",
    name: "Pocket T-shirt",
    image: img("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"),
    store: "A-1 Fashion",
    status: "pending",
  },
  {
    id: "cat-4",
    entityType: "category",
    gender: "MEN",
    productCategory: "Topwear",
    name: "Pocket T-shirt",
    image: img("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"),
    store: "A-1 Fashion",
    status: "pending",
  },
  {
    id: "cat-5",
    entityType: "category",
    gender: "MEN",
    productCategory: "Topwear",
    name: "Pocket T-shirt",
    image: img("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"),
    store: "A-1 Fashion",
    status: "pending",
  },
  {
    id: "cat-6",
    entityType: "category",
    gender: "MEN",
    productCategory: "Topwear",
    name: "Pocket T-shirt",
    image: img("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"),
    store: "A-1 Fashion",
    status: "pending",
  },
  {
    id: "cat-7",
    entityType: "category",
    gender: "MEN",
    productCategory: "Topwear",
    name: "Pocket T-shirt",
    image: img("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"),
    store: "A-1 Fashion",
    status: "pending",
  },
  {
    id: "sub-1",
    entityType: "sub-category",
    gender: "MEN",
    productCategory: "Topwear",
    category: "Shirt",
    name: "Fancy",
    image: img("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"),
    store: "A-1 Fashion",
    status: "pending",
  },
  {
    id: "sub-2",
    entityType: "sub-category",
    gender: "MEN",
    productCategory: "Topwear",
    category: "Shirt",
    name: "Fancy",
    image: img("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"),
    store: "A-1 Fashion",
    status: "pending",
  },
  {
    id: "sub-3",
    entityType: "sub-category",
    gender: "MEN",
    productCategory: "Topwear",
    category: "Shirt",
    name: "Fancy",
    image: img("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"),
    store: "A-1 Fashion",
    status: "pending",
  },
  {
    id: "sub-4",
    entityType: "sub-category",
    gender: "MEN",
    productCategory: "Topwear",
    category: "Shirt",
    name: "Fancy",
    image: img("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"),
    store: "A-1 Fashion",
    status: "pending",
  },
  {
    id: "sub-5",
    entityType: "sub-category",
    gender: "MEN",
    productCategory: "Topwear",
    category: "Shirt",
    name: "Fancy",
    image: img("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"),
    store: "A-1 Fashion",
    status: "pending",
  },
];

integrationItems.push(
  {
    id: "pc-approved-1",
    entityType: "product-category",
    gender: "MEN",
    name: "Streetwear",
    image: integrationImages[0],
    store: "A-1 Fashion",
    status: "approved",
  },
  {
    id: "pc-approved-2",
    entityType: "product-category",
    gender: "WOMEN",
    name: "Loungewear",
    image: integrationImages[1],
    store: "A-2 Fashion",
    status: "approved",
  },
  {
    id: "pc-approved-3",
    entityType: "product-category",
    gender: "KIDS",
    navigation: "Boys",
    name: "Shoes",
    image: integrationImages[2],
    store: "Puma",
    status: "approved",
  },
  {
    id: "pc-rejected-1",
    entityType: "product-category",
    gender: "MEN",
    name: "Streetwear",
    image: integrationImages[0],
    store: "A-1 Fashion",
    status: "rejected",
  },
  {
    id: "cat-approved-1",
    entityType: "category",
    gender: "MEN",
    productCategory: "Topwear",
    name: "Pocket T-shirt",
    image: img("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"),
    store: "A-1 Fashion",
    status: "approved",
  },
  {
    id: "sub-approved-1",
    entityType: "sub-category",
    gender: "MEN",
    productCategory: "Topwear",
    category: "Shirt",
    name: "Fancy",
    image: img("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"),
    store: "A-1 Fashion",
    status: "approved",
  },
);

export const initialAddForm: CatalogueAddForm = {
  entityType: "product-category",
  gender: "MEN",
  navigation: "",
  productCategory: "Topwear",
  category: "Shirt",
  image: "",
  name: "",
};
