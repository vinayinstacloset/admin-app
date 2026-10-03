import type { MarkupVendor, VendorListing } from "../../types/pricemarkup.types";
import { calculatePrice, formatMoney, markupLabel } from "../../utils/pricemarkup.utils";

interface VendorListingTileProps {
    vendor: MarkupVendor;
    listing: VendorListing;
    /** List cards use "Selling price:" (with colon); the Add Markup page does not. */
    withColon?: boolean;
    /** Text for the action button under the tile ("Add Markup" / "Edit Markup"). */
    actionLabel?: string;
    onAction?: () => void;
}

// One vendor's storefront photo + selling / hike-discount / calculated price.
export default function VendorListingTile({ vendor, listing, withColon = true, actionLabel, onAction }: VendorListingTileProps) {
    const { markup, sellingPrice } = listing;
    const colon = withColon ? ":" : "";

    return (
        <div className={`pm-vtile ${actionLabel ? "pm-vtile--actionable" : ""}`}>
            <div className="pm-vtile__row">
                <img className="pm-vtile__image" src={vendor.image} alt={`${vendor.name} storefront`} />

                <div className="pm-vtile__body">
                    <p className="pm-vtile__name">
                        <strong>{vendor.name}</strong> <span>({vendor.location})</span>
                    </p>

                    <div className="pm-vtile__grid">
                        <div className="pm-vtile__col">
                            <span className="pm-vtile__label">Selling price{colon}</span>
                            <strong className="pm-vtile__value">{formatMoney(sellingPrice)}</strong>
                            <span className="pm-vtile__label">Calculated price{colon}</span>
                            <strong className="pm-vtile__value">{markup ? formatMoney(calculatePrice(sellingPrice, markup)) : "-"}</strong>
                        </div>

                        <div className="pm-vtile__col">
                            <span className="pm-vtile__label">Price hike/discount{colon}</span>
                            <strong className={`pm-vtile__value ${markup ? `pm-tone--${markup.kind}` : ""}`}>
                                {markup ? markupLabel(markup) : "-"}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* Kept inside the tile's own padding — never overlaps the card below it. */}
            {actionLabel && (
                <button type="button" className="pm-vtile__action" onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
