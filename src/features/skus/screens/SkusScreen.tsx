import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Package, Search, Filter, X } from "lucide-react";
import { useSkus } from "../hooks/useSkus";
import type { SkuCategory, SkuGenderSection } from "../types/sku.types";
import CatalogueListingScreen from "../../catalogue/screens/CatalogueListingScreen";

function CategoryCard({
  category,
  gender,
  basePath,
}: {
  category: SkuCategory;
  gender: SkuGenderSection["gender"];
  basePath: string;
}) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() =>
        navigate(`${basePath}/${gender.toLowerCase()}/${category.id}`)
      }
      className="block w-full overflow-hidden rounded-xl bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-[74px] items-center">
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-[108px] shrink-0 object-cover"
        />
        <div className="min-w-0 flex-1 px-3">
          <p className="truncate text-[12px] font-medium text-ink">
            {category.name}
          </p>
        </div>
      </div>
      <div className="border-t border-black/10 px-3 py-2 text-[9px]">
        <span className="text-ink/70">{category.skus} SKUS</span>
        <span className="text-red-500"> · {category.lowStock} low stock</span>
        <span className="text-red-500">
          {" "}
          · {category.outOfStock} out of stock
        </span>
      </div>
    </button>
  );
}

function CategoryGrid({
  categories,
  gender,
  basePath,
}: {
  categories: SkuCategory[];
  gender: SkuGenderSection["gender"];
  basePath: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          gender={gender}
          basePath={basePath}
        />
      ))}
    </div>
  );
}

function GenderSection({
  section,
  basePath,
}: {
  section: SkuGenderSection;
  basePath: string;
}) {
  const tiles = section.tiles ?? [];
  const [activeTile, setActiveTile] = useState(tiles[0]?.id ?? "");
  const activeCategories =
    tiles.find((tile) => tile.id === activeTile)?.categories ?? [];
  return (
    <section className="border-t border-black/10 pt-4">
      <h2 className="text-[13px] font-medium uppercase tracking-[0.02em] text-ink">
        {section.gender}
      </h2>
      {section.categories ? (
        <div className="mt-3">
          <CategoryGrid
            categories={section.categories}
            gender={section.gender}
            basePath={basePath}
          />
        </div>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap items-end gap-8 border-b border-black/10">
            {tiles.map((tile) => {
              const active = tile.id === activeTile;
              return (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => setActiveTile(tile.id)}
                  className={`relative flex w-[108px] flex-col items-center gap-2 pb-3 text-[10px] font-semibold text-ink ${active ? "after:absolute after:-bottom-px after:left-0 after:right-0 after:h-0.5 after:bg-[#d9d5d1]" : ""}`}
                >
                  <img
                    src={tile.image}
                    alt={tile.label}
                    className="h-[96px] w-[108px] rounded-lg object-cover"
                  />
                  <span>{tile.label}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3">
            <CategoryGrid
              categories={activeCategories}
              gender={section.gender}
              basePath={basePath}
            />
          </div>
        </>
      )}
    </section>
  );
}

export default function SkusScreen() {
  const location = useLocation();
  const { storeId, vendorId, gender, categoryId } = useParams<{
    storeId?: string;
    vendorId?: string;
    gender?: string;
    categoryId?: string;
  }>();
  const { sections } = useSkus();
  const detailRoute = Boolean(
    gender && categoryId && /\/skus\//.test(location.pathname),
  );
  if (detailRoute) return <CatalogueListingScreen />;
  const basePath = vendorId
    ? `/admin-dashboard/vendor/${vendorId}/skus`
    : `/admin-dashboard/store/${storeId ?? "store-1"}/skus`;
  return (
    <div className="pb-8">
      <h1 className="mb-4 text-[16px] font-bold tracking-[-0.02em] text-ink">
        SKUS - 840
      </h1>
      <div className="space-y-4">
        {sections.map((section) => (
          <GenderSection
            key={section.gender}
            section={section}
            basePath={basePath}
          />
        ))}
      </div>
    </div>
  );
}
