import { Pencil, Trash2 } from "lucide-react";
import type { MarkupVendor, ProductVariant } from "../../types/pricemarkup.types";
import { formatMoney } from "../../utils/pricemarkup.utils";
import { RevenueIcon, UnitSoldIcon } from "../common/MarkupIcons";
import ProductSummary from "../common/ProductSummary";
import StatTile from "../common/StatTile";
import VendorListingTile from "./VendorListingTile";

interface ProductMarkupCardProps {
    variant: ProductVariant;
    vendors: MarkupVendor[];
    onEdit: () => void;
    onDelete: () => void;
}

// One record of the Product tab: product header, sales tiles and every
// vendor that currently has a markup for this product variant.
export default function ProductMarkupCard({ variant, vendors, onEdit, onDelete }: ProductMarkupCardProps) {
    const markedListings = variant.listings.filter((listing) => listing.markup);

    return (
        <section className="pm-card pm-product-card">
            <div className="pm-product-card__head">
                <ProductSummary variant={variant} />

                <div className="pm-product-card__stats">
                    <StatTile tone="orange" label="UNIT SOLD" value={variant.unitSold} icon={<UnitSoldIcon />} />
                    <StatTile tone="green" label="REVENUE" value={formatMoney(variant.revenue)} icon={<RevenueIcon />} />
                </div>

                <div className="pm-row-actions">
                    <button type="button" className="pm-icon-btn" aria-label={`Edit markup for ${variant.name}`} onClick={onEdit}>
                        <Pencil size={14} />
                    </button>
                    <button type="button" className="pm-icon-btn" aria-label={`Delete markup for ${variant.name}`} onClick={onDelete}>
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <div className="pm-product-card__vendors">
                {markedListings.map((listing) => {
                    const vendor = vendors.find((item) => item.id === listing.vendorId);
                    return vendor ? <VendorListingTile key={listing.vendorId} vendor={vendor} listing={listing} /> : null;
                })}
            </div>
        </section>
    );
}
