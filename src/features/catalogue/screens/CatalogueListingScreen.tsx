import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Filter, Package, Search, X } from "lucide-react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import CatalogueDropdown from "../components/CatalogueDropdown";
import { catalogueApi } from "../api";
import {
  categoryOptions,
  formatCurrency,
  subCategoryOptions,
} from "../utils/catalogue.utils";
import {
  buildListingBreadcrumbs,
  type ListingContext,
} from "../utils/listingBreadcrumbs";
import type {
  CatalogueGender,
  CatalogueProduct,
} from "../types/catalogue.types";
import CommonTable from "../../../shared/components/common/CommonTable";

export default function CatalogueListingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();

  const params = useParams<{
    storeId?: string;
    vendorId?: string;
    gender?: string;
    categoryId?: string;
  }>();

  const gender = (params.gender || "MEN").toUpperCase();

  const categoryName = params.categoryId?.replaceAll("-", " ") || "Topwear";

  const products = useMemo(
    () => catalogueApi.listProducts(gender as CatalogueGender, categoryName),
    [categoryName, gender],
  );

  const [stockMode, setStockMode] = useState<"all" | "low" | "out">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Revenue (high to low)");
  const [category, setCategory] = useState("All");
  const [subCategory, setSubCategory] = useState("All");
  const [selected, setSelected] = useState<CatalogueProduct | null>(null);

  const isVendor = location.pathname.includes("/vendor/");
  const isStoreSkus =
    !isVendor &&
    location.pathname.includes("/store/") &&
    location.pathname.includes("/skus/");
  const context: ListingContext = isVendor
    ? "vendor"
    : isStoreSkus
      ? "store"
      : "catalogue";

  const ownerId = isVendor
    ? (params.vendorId ?? location.pathname.split("/")[3])
    : (params.storeId ?? "catalogue-store-1");

  const base = isVendor
    ? `/admin-dashboard/vendor/${ownerId}`
    : isStoreSkus
      ? `/admin-dashboard/store/${ownerId}`
      : `/admin-dashboard/catalogue/store/${ownerId}`;

  /*
   * Breadcrumb always follows the place the listing was opened from:
   *
   * Store:      Store > store name > SKUS > Men > Topwear
   * Vendor:     Vendor > vendor name > SKUS > Men > Topwear
   * Catalogue:  Catalogue > catalogue name > Men > Topwear
   *
   * Kids / Teens / GenZ:  ... > Teens > Boys > Topwear  (or Girls)
   */
  const breadcrumbItems = useMemo(
    () =>
      buildListingBreadcrumbs({
        context,
        ownerId,
        gender: params.gender,
        categoryId: params.categoryId,
      }),
    [context, ownerId, params.categoryId, params.gender],
  );

  useEffect(() => {
    setExtraCrumbs(breadcrumbItems);
    setPageAction(null);

    return () => {
      setExtraCrumbs([]);
      setPageAction(null);
    };
  }, [breadcrumbItems, setExtraCrumbs, setPageAction]);

  const filtered = useMemo(() => {
    let result = products.filter((item) =>
      item.name.toLowerCase().includes(search.trim().toLowerCase()),
    );

    if (category !== "All") {
      result = result.filter(
        (item) =>
          item.category === category ||
          item.name.toLowerCase().includes(category.toLowerCase()),
      );
    }

    if (subCategory !== "All") {
      result = result.filter((item) => item.subCategory === subCategory);
    }

    if (stockMode === "low") {
      result = result.filter((item) => item.stock > 0 && item.stock <= 10);
    }

    if (stockMode === "out") {
      result = result.filter((item) => item.stock === 0);
    }

    return [...result].sort((a, b) =>
      sort === "Revenue (low to high)"
        ? a.revenue - b.revenue
        : b.revenue - a.revenue,
    );
  }, [category, products, search, sort, stockMode, subCategory]);

  const lowCount = products.filter(
    (item) => item.stock > 0 && item.stock <= 10,
  ).length;

  const outCount = products.filter((item) => item.stock === 0).length;

  const inStock = products.filter((item) => item.stock > 0).length;

  return (
    <div className="pb-8 text-ink">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Package size={17} />}
          tone="blue"
          label="Total SKUS:"
          value="112"
        />

        <StatCard
          icon={<Package size={17} />}
          tone="green"
          label="In Stock:"
          value={String(105)}
        />

        <StatCard
          icon={<Package size={17} />}
          tone="orange"
          label="Low Stock:"
          value="5"
          action="View ›"
          onClick={() => setStockMode("low")}
        />

        <StatCard
          icon={<Package size={17} />}
          tone="red"
          label="Out of Stock:"
          value="2"
          action="View ›"
          onClick={() => setStockMode("out")}
        />
      </div>

      <div className="mt-5 space-y-2">
        <FilterRow
          label="Category:"
          options={categoryOptions}
          value={category}
          onChange={setCategory}
          activeIndex={categoryOptions.indexOf("T-Shirt")}
        />

        <FilterRow
          label="Sub-category:"
          options={subCategoryOptions}
          value={subCategory}
          onChange={setSubCategory}
          activeIndex={subCategoryOptions.indexOf("Casual")}
        />
      </div>

      <div className="my-4 border-t border-black/10" />

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[14px] font-semibold">
          SKU -{" "}
          {stockMode === "low"
            ? "Low stock - 5"
            : stockMode === "out"
              ? "Out of stock - 2"
              : 800}
        </h2>

        <div className="flex items-center gap-2">
          <div className="relative w-[300px] max-w-[45vw]">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/35"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product name"
              className="h-8 w-full rounded-md border-0 bg-white pl-8 pr-3 text-[9px] outline-none"
            />
          </div>

          <Filter size={17} className="text-ink/60" />

          <div className="w-[145px]">
            <CatalogueDropdown
              value={sort}
              options={["Revenue (high to low)", "Revenue (low to high)"]}
              onChange={setSort}
            />
          </div>
        </div>
      </div>

      <CommonTable
        headers={[
          { header: "PRODUCT IMAGE", width: "1.2fr" },
          { header: "NAME", width: "1.1fr" },
          { header: "SIZE", width: ".65fr" },
          { header: "COLOR", width: "1fr" },
          { header: "UNIT SOLD", width: ".7fr" },
          { header: "REVENUE", width: "1fr" },
          { header: "STOCK", width: ".7fr" },
          { header: "RATING", width: ".7fr" },
          { header: "PRICE", width: ".7fr" },
          { header: "ACTION", width: ".8fr" },
        ]}
        data={filtered.map((item) => [
          <div key="image" className="relative flex items-center">
            <img
              src={item.image}
              alt={item.name}
              className="h-12 w-20 rounded object-cover"
            />
            <span className="absolute bottom-1 left-14 rounded bg-black/55 px-1 text-[7px] text-white">
              +2
            </span>
          </div>,
          <span key="name" className="truncate font-medium" title={item.name}>
            {item.name}
          </span>,
          item.size,
          <span key="color" className="flex items-center gap-1">
            <span className="h-4 w-4 rounded-full border border-ink/50" />
            {item.color}
          </span>,
          item.unitSold,
          formatCurrency(item.revenue),
          <span
            key="stock"
            className={
              item.stock <= 10
                ? "font-semibold text-[#f06a6a]"
                : "font-semibold text-[#25ae5b]"
            }
          >
            {item.stock}
          </span>,
          `★ ${item.rating}`,
          formatCurrency(item.price),
          <button
            key="action"
            type="button"
            onClick={() => setSelected(item)}
            className="h-7 w-[70px] rounded-md border border-[#765038] text-[9px] font-medium text-[#765038] hover:bg-[#faf6f2]"
          >
            View
          </button>,
        ])}
        rowKeys={filtered.map((item) => item.id)}
        minWidth={980}
      />

      {selected && (
        <ProductDetailsModal
          product={selected}
          onClose={() => setSelected(null)}
        />
      )}

      <span className="hidden">
        {base}
        {inStock}
        {lowCount}
        {outCount}
      </span>
    </div>
  );
}

function StatCard({
  icon,
  tone,
  label,
  value,
  action,
  onClick,
}: {
  icon: React.ReactNode;
  tone: string;
  label: string;
  value: string;
  action?: string;
  onClick?: () => void;
}) {
  const toneMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-500",
    green: "bg-green-50 text-green-500",
    orange: "bg-orange-50 text-orange-500",
    red: "bg-red-50 text-red-400",
  };

  return (
    <div className="flex min-h-[100px] flex-col rounded-xl bg-white px-4 py-3 shadow-sm">
      {/* Row 1 - Icon */}
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${toneMap[tone]}`}
      >
        {icon}
      </div>

      {/* Row 2 - Text + View */}
      <div className="mt-2 flex items-center">
        <p className="text-[11px] text-ink/65">
          {label} <strong className="text-[18px] text-ink">{value}</strong>
        </p>

        {action && (
          <button
            type="button"
            onClick={onClick}
            className="ml-auto text-[9px] font-medium text-blue-600 underline underline-offset-2"
          >
            {action}
          </button>
        )}
      </div>
    </div>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
  activeIndex,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  activeIndex: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[11px] font-medium">{label}</span>

      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`flex h-7 items-center gap-1 rounded-md border px-3 text-[9px] transition-colors ${
            value === option || (value === "All" && index === 0)
              ? "border-[#765038] bg-[#faf6f2] text-[#765038]"
              : "border-black/25 bg-transparent text-ink/70 hover:bg-white"
          }`}
        >
          {index === activeIndex && <span className="text-[12px]">●</span>}

          {option}
        </button>
      ))}
    </div>
  );
}

function ProductRow({
  item,
  onDetails,
}: {
  item: CatalogueProduct;
  onDetails: () => void;
}) {
  return (
    <div className="grid min-h-[60px] min-w-[980px] grid-cols-[1.2fr_1.1fr_.65fr_1fr_.7fr_1fr_.7fr_.7fr_.7fr_.8fr] items-center border-b border-black/10 px-4 last:border-b-0">
      <div className="relative flex items-center gap-1">
        <img
          src={item.image}
          alt={item.name}
          className="h-12 w-20 rounded object-cover"
        />

        <span className="absolute bottom-1 left-14 rounded bg-black/55 px-1 text-[7px] text-white">
          +2
        </span>
      </div>

      <span className="truncate text-[10px] font-medium" title={item.name}>
        {item.name}
      </span>

      <span className="text-[10px]">{item.size}</span>

      <span className="flex items-center gap-1 text-[10px]">
        <span className="h-4 w-4 rounded-full border border-ink/50" />
        {item.color}
      </span>

      <span className="text-[10px]">{item.unitSold}</span>

      <span className="text-[10px]">{formatCurrency(item.revenue)}</span>

      <span
        className={`text-[10px] font-semibold ${
          item.stock <= 10 ? "text-[#f06a6a]" : "text-[#25ae5b]"
        }`}
      >
        {item.stock}
      </span>

      <span className="text-[10px]">★ {item.rating}</span>

      <span className="text-[10px]">{formatCurrency(item.price)}</span>

      <button
        type="button"
        onClick={onDetails}
        className="text-left text-[9px] font-medium text-blue-600 underline underline-offset-2"
      >
        View details
      </button>
    </div>
  );
}

function ProductDetailsModal({
  product,
  onClose,
}: {
  product: CatalogueProduct;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4 backdrop-blur-[1px]">
      <div className="max-h-[92vh] w-full max-w-[1110px] overflow-auto rounded-xl bg-white shadow-2xl scrollbar-hide">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white px-5 py-4">
          <h2 className="text-[16px] font-semibold">View item details</h2>

          <button type="button" onClick={onClose}>
            <X size={21} className="text-ink/60" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex min-h-[145px] items-center justify-center gap-6 rounded-md border border-dashed border-[#b99980] bg-[#fffdfb] p-4">
            <img
              src={product.image}
              alt={product.name}
              className="h-28 w-28 object-cover"
            />

            <img
              src={product.image}
              alt={product.name}
              className="h-28 w-28 object-cover"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <Readonly
              label="Product Category"
              value={product.productCategory}
            />

            <Readonly label="Category" value={product.category} />

            <Readonly label="Sub-category" value={product.subCategory} />

            <Readonly label="Name" value={product.name} />

            <Readonly label="Size" value={product.size} />

            <Readonly label="Color" value={product.color} />

            <Readonly label="Stock" value={String(product.stock)} />
          </div>

          <div className="my-4 border-t border-black/10" />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Readonly label="Fabrics" value={product.fabrics} />

            <Readonly label="Sustainable" value={product.sustainable} />

            <Readonly label="Material" value={product.material} />

            <Readonly label="Care" value={product.care} />
          </div>

          <div className="my-4 border-t border-black/10" />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Readonly label="Price" value={formatCurrency(product.price)} />

            <Readonly label="Discount" value={`% ${product.discount}`} />

            <Readonly
              label="Calculated Price"
              value={formatCurrency(product.calculatedPrice)}
            />
          </div>

          <div className="my-4 border-t border-black/10" />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
            <div>
              <label className="text-[10px] font-semibold">
                Product Details
              </label>

              <div className="mt-1 min-h-[170px] rounded-md border border-black/20 p-4 text-[10px] leading-5">
                {product.details.map((detail) => (
                  <div key={detail}>• {detail}</div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold">Fit</label>

              <div className="mt-1 min-h-[85px] rounded-md border border-black/20 p-4 text-[10px]">
                • {product.fit}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-8 border-t border-black/10 pt-4">
            <div className="rounded-lg bg-[#f5f4f2] px-5 py-3 text-[10px] font-semibold">
              ✓ Genuine Product
            </div>

            <div className="rounded-lg bg-[#f5f4f2] px-5 py-3 text-[10px] font-semibold">
              ✓ Quality Checked
            </div>

            <div className="rounded-lg bg-[#f5f4f2] px-5 py-3 text-[10px] font-semibold">
              Mega sale · ₹740
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Readonly({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-[9px] font-semibold text-ink/65">{label}</label>

      <div className="mt-1 min-h-9 rounded-md border border-black/20 bg-white px-3 py-2 text-[10px] font-semibold">
        {value}
      </div>
    </div>
  );
}
