import { Pencil } from "lucide-react";
import type { ProductVariant } from "../../types/pricemarkup.types";

interface ProductSummaryProps {
    variant: ProductVariant;
    onEdit?: () => void;
    className?: string;
}

// Product thumbnail + name + Gender / Size / Color — shared by the product
// list cards, the Add Markup page header and the delete confirmation.
export default function ProductSummary({ variant, onEdit, className = "" }: ProductSummaryProps) {
    return (
        <div className={`pm-product-summary ${className}`}>
            <img className="pm-product-summary__image" src={variant.image} alt={variant.name} />

            <div className="pm-product-summary__body">
                <div className="pm-product-summary__name">
                    <strong>{variant.name}</strong>
                    {onEdit && (
                        <button type="button" className="pm-icon-btn" aria-label="Edit product" onClick={onEdit}>
                            <Pencil size={13} />
                        </button>
                    )}
                </div>

                <dl className="pm-attrs">
                    <div>
                        <dt>Gender:</dt>
                        <dd>{variant.gender}</dd>
                    </div>
                    <div>
                        <dt>Size:</dt>
                        <dd>{variant.size}</dd>
                    </div>
                    <div>
                        <dt>Color:</dt>
                        <dd>
                            <i className="pm-color-dot" style={{ backgroundColor: variant.colorHex }} />
                            {variant.color}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}
