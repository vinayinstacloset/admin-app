import { Pencil } from "lucide-react";
import { priceMarkupApi } from "../../api";
import type { CategoryMarkup } from "../../types/pricemarkup.types";
import { categoryMarkupLabel } from "../../utils/pricemarkup.utils";
import Thumb from "../common/Thumb";
import CommonTable from "../../../../shared/components/common/CommonTable";
import { hoverStyle } from "../../../../shared/utils/interactiveStyle";

interface Props {
  rows: CategoryMarkup[];
  onEdit: (row: CategoryMarkup) => void;
}

const {
  genderOptions: GENDER_OPTIONS,
  navigationImages: NAVIGATION_IMAGES,
  productCategoryImages: PRODUCT_CATEGORY_IMAGES,
} = priceMarkupApi.getMetadata();

const GENDER_MAP = Object.fromEntries(
  GENDER_OPTIONS.map((option) => [option.id, option]),
);

export default function CategoryMarkupTable({ rows, onEdit }: Props) {
  const headers = [
    "GENDER",
    "CATEGORY NAVIGATION",
    "PRODUCT CATEGORY",
    "CATEGORY",
    "HIKE & DISCOUNT",
    "ACTION",
  ].map((header) => ({ header }));

  const data = rows.map((row) => {
    const gender = GENDER_MAP[row.genderId];

    return [
      gender ? (
        <span
          key="gender"
          className="inline-flex items-center gap-2 whitespace-nowrap"
        >
          <Thumb
            size="square"
            src={gender.icon}
            alt={gender.label}
            fallback={gender.label}
          />
          <span>{gender.label}</span>
        </span>
      ) : (
        "-"
      ),

      row.navigation ? (
        <span
          key="navigation"
          className="inline-flex items-center gap-2 whitespace-nowrap"
        >
          <Thumb
            size="square"
            src={NAVIGATION_IMAGES[`${row.genderId}:${row.navigation}`]}
            alt={row.navigation}
            fallback={row.navigation}
          />
          <span>{row.navigation}</span>
        </span>
      ) : (
        "-"
      ),

      <span
        key="category"
        className="inline-flex items-center gap-2 whitespace-nowrap"
      >
        <Thumb
          size="wide"
          src={PRODUCT_CATEGORY_IMAGES[row.productCategory]}
          alt={row.productCategory}
          fallback={row.productCategory}
        />
        <span>{row.productCategory}</span>
      </span>,

      <strong key="name">{row.category}</strong>,

      <strong
        key="markup"
        style={{
          color: row.markup.kind === "discount" ? "#ff6536" : "#39bd65",
        }}
      >
        {categoryMarkupLabel(row.markup)}
      </strong>,

      <button
        key="edit"
        type="button"
        onClick={() => onEdit(row)}
        aria-label={`Edit ${row.category} markup`}
        className="inline-flex h-6 w-6 items-center justify-center rounded text-[#4b4540]"
        {...hoverStyle(
          { background: "rgba(0,0,0,.06)" },
          { background: "transparent" },
        )}
      >
        <Pencil size={14} />
      </button>,
    ];
  });

  return (
    <CommonTable
      headers={headers}
      data={data}
      rowKeys={rows.map((row) => row.id)}
      minWidth={900}
    />
  );
}
