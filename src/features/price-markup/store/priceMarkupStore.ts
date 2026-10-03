import { create } from "zustand";
import { priceMarkupApi } from "../api";
import type {
    CategoryMarkup,
    CategoryMarkupInput,
    Markup,
    MarkupVendor,
    ProductVariant,
    VendorListing,
    VendorMarkup,
} from "../types/pricemarkup.types";
import { nextId } from "../utils/pricemarkup.utils";

interface PriceMarkupState {
    vendors: MarkupVendor[];
    variants: ProductVariant[];
    categoryMarkups: CategoryMarkup[];
    vendorMarkups: VendorMarkup[];

    // Product tab
    saveVariantListings: (variantId: string, listings: VendorListing[]) => void;
    removeVariantMarkups: (variantId: string) => void;

    // Category tab
    addCategoryMarkup: (input: CategoryMarkupInput) => void;
    updateCategoryMarkup: (id: string, input: CategoryMarkupInput) => void;
    removeCategoryMarkup: (id: string) => void;

    // Vendor tab
    addVendorMarkup: (vendorId: string, markup: Markup) => void;
    updateVendorMarkup: (id: string, markup: Markup) => void;
    removeVendorMarkup: (id: string) => void;
}

const snapshot = priceMarkupApi.getSnapshot();

export const usePriceMarkupStore = create<PriceMarkupState>((set) => ({
    vendors: snapshot.vendors,
    variants: snapshot.variants,
    categoryMarkups: snapshot.categoryMarkups,
    vendorMarkups: snapshot.vendorMarkups,

    saveVariantListings: (variantId, listings) =>
        set((state) => ({
            variants: state.variants.map((variant) => (variant.id === variantId ? { ...variant, listings } : variant)),
        })),

    removeVariantMarkups: (variantId) =>
        set((state) => ({
            variants: state.variants.map((variant) =>
                variant.id === variantId
                    ? { ...variant, listings: variant.listings.map((listing) => ({ ...listing, markup: null })) }
                    : variant,
            ),
        })),

    addCategoryMarkup: (input) =>
        set((state) => ({ categoryMarkups: [{ id: nextId("cm"), ...input }, ...state.categoryMarkups] })),

    updateCategoryMarkup: (id, input) =>
        set((state) => ({
            categoryMarkups: state.categoryMarkups.map((row) => (row.id === id ? { id, ...input } : row)),
        })),

    removeCategoryMarkup: (id) =>
        set((state) => ({ categoryMarkups: state.categoryMarkups.filter((row) => row.id !== id) })),

    addVendorMarkup: (vendorId, markup) =>
        set((state) => ({ vendorMarkups: [{ id: nextId("vm"), vendorId, markup }, ...state.vendorMarkups] })),

    updateVendorMarkup: (id, markup) =>
        set((state) => ({
            vendorMarkups: state.vendorMarkups.map((row) => (row.id === id ? { ...row, markup } : row)),
        })),

    removeVendorMarkup: (id) =>
        set((state) => ({ vendorMarkups: state.vendorMarkups.filter((row) => row.id !== id) })),
}));
