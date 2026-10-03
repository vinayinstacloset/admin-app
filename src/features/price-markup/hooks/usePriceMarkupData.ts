import { usePriceMarkupStore } from "../store/priceMarkupStore";

export function usePriceMarkupData() {
    const { vendors, variants, categoryMarkups, vendorMarkups } = usePriceMarkupStore();
    return { vendors, variants, categoryMarkups, vendorMarkups };
}
