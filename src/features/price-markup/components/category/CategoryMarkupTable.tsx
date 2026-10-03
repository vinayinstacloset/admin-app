import { Pencil } from "lucide-react";
import { priceMarkupApi } from "../../api";
import type { CategoryMarkup } from "../../types/pricemarkup.types";
import { categoryMarkupLabel } from "../../utils/pricemarkup.utils";
import Thumb from "../common/Thumb";

interface CategoryMarkupTableProps {
    rows: CategoryMarkup[];
    onEdit: (row: CategoryMarkup) => void;
}

const { genderOptions: GENDER_OPTIONS, navigationImages: NAVIGATION_IMAGES, productCategoryImages: PRODUCT_CATEGORY_IMAGES } = priceMarkupApi.getMetadata();
const HEADERS = ["GENDER", "CATEGORY NAVIGATION", "PRODUCT CATEGORY", "CATEGORY", "HIKE & DISCOUNT", "ACTION"];

export default function CategoryMarkupTable({ rows, onEdit }: CategoryMarkupTableProps) {
    return (
        <div className="pm-table-card">
            <div className="pm-table-scroll">
                <table className="pm-table">
                    <thead>
                        <tr>
                            {HEADERS.map((header) => (
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={HEADERS.length} className="pm-table__empty">
                                    No category markups found
                                </td>
                            </tr>
                        )}

                        {rows.map((row) => {
                            const gender = GENDER_OPTIONS.find((option) => option.id === row.genderId);

                            return (
                                <tr key={row.id}>
                                    <td>
                                        <span className="pm-cell">
                                            <img className="pm-gender-icon" src={gender?.icon} alt="" />
                                            {gender?.label.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        {row.navigation ? (
                                            <span className="pm-cell">
                                                <Thumb
                                                    className="pm-thumb--square"
                                                    src={NAVIGATION_IMAGES[`${row.genderId}:${row.navigation}`]}
                                                    alt={row.navigation}
                                                    fallback={row.navigation}
                                                />
                                                {row.navigation}
                                            </span>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>
                                        <span className="pm-cell">
                                            <Thumb
                                                className="pm-thumb--wide"
                                                src={PRODUCT_CATEGORY_IMAGES[row.productCategory]}
                                                alt={row.productCategory}
                                                fallback={row.productCategory}
                                            />
                                            {row.productCategory}
                                        </span>
                                    </td>
                                    <td className="pm-table__strong">{row.category}</td>
                                    <td className={`pm-table__strong pm-tone--${row.markup.kind}`}>{categoryMarkupLabel(row.markup)}</td>
                                    <td>
                                        <button type="button" className="pm-icon-btn" aria-label={`Edit ${row.category} markup`} onClick={() => onEdit(row)}>
                                            <Pencil size={14} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
