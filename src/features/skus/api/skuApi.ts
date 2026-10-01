import type { SkuCategory, SkuGenderSection } from "../types/sku.types";

const image = (url: string) => `${url}?auto=format&fit=crop&w=480&q=80`;

const category = (id: string, name: string, photo: string, skus = 112, lowStock = 5, outOfStock = 2): SkuCategory => ({
    id, name, image: image(photo), skus, lowStock, outOfStock,
});

const menCategories = [
    category("men-all", "All categories", "https://images.unsplash.com/photo-1503341504253-dff4815485f1", 358, 24, 11),
    category("men-topwear", "Topwear", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"),
    category("men-bottomwear", "Bottomwear", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"),
    category("men-ethnic", "Ethnic Wear", "https://images.unsplash.com/photo-1610652492500-ded49ceeb378"),
    category("men-accessories", "Accessories", "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561"),
    category("men-footwear", "Footwear", "https://images.unsplash.com/photo-1542291026-7eec264c27ff"),
    category("men-sportswear", "Sportswear", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"),
];

const womenCategories = [
    category("women-all", "All categories", "https://images.unsplash.com/photo-1483985988355-763728e1935b", 198, 18, 10),
    category("women-suits", "Suits", "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3"),
    category("women-wedding", "Wedding", "https://images.unsplash.com/photo-1595777457583-95e059d581b8"),
    category("women-ethnic", "Ethnic Wear", "https://images.unsplash.com/photo-1583391733956-6c78276477e2"),
    category("women-accessories", "Accessories", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338"),
];

const tab = (id: string, label: string, photo: string, categories: SkuCategory[]) => ({ id, label, image: image(photo), categories });

const teenCategories = (prefix: string, photo: string): SkuCategory[] => [
    category(`${prefix}-all`, "All categories", photo, 102, 16, 13),
    category(`${prefix}-topwear`, "Topwear", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"),
    category(`${prefix}-sportswear`, "Sportswear", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"),
    category(`${prefix}-accessories`, "Accessories", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338"),
];

const kidsCategories = (prefix: string, photo: string): SkuCategory[] => [
    category(`${prefix}-all`, "All categories", photo, 102, 16, 13),
    category(`${prefix}-shoes`, "Shoes", "https://images.unsplash.com/photo-1542291026-7eec264c27ff"),
    category(`${prefix}-lounge`, "Loungewear", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"),
    category(`${prefix}-sports`, "Sportswear", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"),
];

const genzCategories = (prefix: string, photo: string): SkuCategory[] => [
    category(`${prefix}-all`, "All categories", photo, 102, 16, 13),
    category(`${prefix}-topwear`, "Topwear", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"),
    category(`${prefix}-sportswear`, "Sportswear", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"),
];

const sections: SkuGenderSection[] = [
    { gender: "MEN", categories: menCategories },
    { gender: "WOMEN", categories: womenCategories },
    {
        gender: "TEENS",
        tiles: [
            tab("teen-boys", "Boys", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7", teenCategories("teen-boys", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7")),
            tab("teen-girls", "Girls", "https://images.unsplash.com/photo-1544717305-2782549b5136", teenCategories("teen-girls", "https://images.unsplash.com/photo-1544717305-2782549b5136")),
            tab("teen-unisex", "Unisex", "https://images.unsplash.com/photo-1529391409740-57d6a6c0e2b5", teenCategories("teen-unisex", "https://images.unsplash.com/photo-1529391409740-57d6a6c0e2b5")),
        ],
    },
    {
        gender: "KIDS",
        tiles: [
            tab("kids-boys", "Boys", "https://images.unsplash.com/photo-1519457431-44ccd64a579b", kidsCategories("kids-boys", "https://images.unsplash.com/photo-1519457431-44ccd64a579b")),
            tab("kids-girls", "Girls", "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42", kidsCategories("kids-girls", "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42")),
            tab("kids-infants", "Infants", "https://images.unsplash.com/photo-1503919545889-aef636e10ad4", kidsCategories("kids-infants", "https://images.unsplash.com/photo-1503919545889-aef636e10ad4")),
            tab("kids-addons", "Add-ons", "https://images.unsplash.com/photo-1519710164239-da123dc03ef4", kidsCategories("kids-addons", "https://images.unsplash.com/photo-1519710164239-da123dc03ef4")),
        ],
    },
    {
        gender: "GENZ",
        tiles: [
            tab("genz-boys", "Boys", "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea", genzCategories("genz-boys", "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea")),
            tab("genz-girls", "Girls", "https://images.unsplash.com/photo-1544005313-94ddf0286df2", genzCategories("genz-girls", "https://images.unsplash.com/photo-1544005313-94ddf0286df2")),
        ],
    },
];

export const skuApi = {
    getSections(): SkuGenderSection[] {
        return sections;
    },
};
