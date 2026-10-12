import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import CatalogueDropdown from "../components/CatalogueDropdown";
import CatalogueAddModal from "../components/CatalogueAddModal";
import { useCatalogueData } from "../hooks";
import type {
  CatalogueEntityType,
  CatalogueGender,
} from "../types/catalogue.types";
import CatalogueListingScreen from "./CatalogueListingScreen";
import IntegrationStatusScreen from "./IntegrationStatusScreen";
import CommonTable from "../../../shared/components/common/CommonTable";

export default function CatalogueScreen() {
  const location = useLocation();
  if (location.pathname === "/admin-dashboard/catalogue/integration-status")
    return <IntegrationStatusScreen />;
  if (
    /\/admin-dashboard\/catalogue\/store\/[^/]+\/[^/]+\/[^/]+$/.test(
      location.pathname,
    )
  )
    return <CatalogueListingScreen />;
  if (/\/admin-dashboard\/catalogue\/store\/[^/]+$/.test(location.pathname))
    return <CatalogueGenderCatalogue />;
  return <CatalogueStoreList />;
}

function CatalogueGenderCatalogue() {
  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();
  const navigate = useNavigate();
  const { storeId = "catalogue-store-1" } = useParams<{ storeId?: string }>();
  const { sections } = useCatalogueData();
  const [activeNavigation, setActiveNavigation] = useState<
    Record<string, string>
  >({ TEENS: "teens-boys", KIDS: "kids-boys", GENZ: "genz-boys" });

  useEffect(() => {
    setExtraCrumbs([
      { label: "Catalogue", to: "/admin-dashboard/catalogue" },
      { label: "NIKE catalogue" },
    ]);
    setPageAction(null);
    return () => {
      setExtraCrumbs([]);
      setPageAction(null);
    };
  }, [setExtraCrumbs, setPageAction]);

  const openCategory = (gender: CatalogueGender, id: string) =>
    navigate(
      `/admin-dashboard/catalogue/store/${storeId}/${gender.toLowerCase()}/${id}`,
    );

  return (
    <div className="pb-8 text-ink">
      <h1 className="mb-4 text-[16px] font-bold">SKUS - 840</h1>
      <div className="space-y-4">
        {sections.map((section) => {
          const active = activeNavigation[section.gender];
          const categories =
            section.categories ??
            section.navigation?.find((tile) => tile.id === active)
              ?.categories ??
            [];
          return (
            <section
              key={section.gender}
              className="border-t border-black/10 pt-4"
            >
              <h2 className="text-[12px] font-medium uppercase">
                {section.gender}
              </h2>
              {section.navigation && (
                <div className="mt-3 flex flex-wrap items-end gap-8 border-b border-black/10">
                  {section.navigation.map((tile) => (
                    <button
                      key={tile.id}
                      type="button"
                      onClick={() =>
                        setActiveNavigation((current) => ({
                          ...current,
                          [section.gender]: tile.id,
                        }))
                      }
                      className={`relative flex w-[108px] flex-col items-center gap-2 pb-3 text-[9px] font-semibold ${active === tile.id ? "after:absolute after:-bottom-px after:left-0 after:right-0 after:h-0.5 after:bg-[#d9d5d1]" : ""}`}
                    >
                      <img
                        src={tile.image}
                        alt={tile.label}
                        className="h-[78px] w-[78px] rounded-lg object-cover"
                      />
                      <span>{tile.label}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                {categories.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openCategory(section.gender, item.id)}
                    className="overflow-hidden rounded-xl bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex h-[74px] items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-[108px] object-cover"
                      />
                      <span className="px-3 text-[10px] font-medium">
                        {item.name}
                      </span>
                    </div>
                    <div className="border-t border-black/10 px-3 py-2 text-[8px]">
                      <span>{item.skus} SKUS</span>
                      <span className="text-red-500">
                        {" "}
                        · {item.lowStock} low stock · {item.outOfStock} out of
                        stock
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function CatalogueStoreList() {
  const { setPageAction, setExtraCrumbs } = useDashboardOutletContext();
  const navigate = useNavigate();
  const { stores } = useCatalogueData();
  const [search, setSearch] = useState("");
  const [state, setState] = useState("All State");
  const [sort, setSort] = useState("Name (A to Z)");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [addType, setAddType] = useState<CatalogueEntityType | null>(null);
  const [success, setSuccess] = useState<{
    name: string;
    type: CatalogueEntityType;
  } | null>(null);

  useEffect(() => {
    setExtraCrumbs([{ label: "Catalogue" }]);
    setPageAction(
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            navigate("/admin-dashboard/catalogue/integration-status")
          }
          className="h-8 rounded-md bg-[#0878df] px-3.5 text-[10px] font-semibold text-white shadow-sm transition-transform hover:-translate-y-px"
        >
          Integration Status
        </button>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="flex h-8 items-center gap-1.5 rounded-md bg-[#765038] px-3.5 text-[10px] font-semibold text-white shadow-sm transition-transform hover:-translate-y-px"
        >
          Add Categories <Plus size={12} />
        </button>
      </div>,
    );
    return () => {
      setPageAction(null);
      setExtraCrumbs([]);
    };
  }, [navigate, setExtraCrumbs, setPageAction]);

  const filtered = useMemo(() => {
    const result = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(search.trim().toLowerCase()) &&
        (state === "All State" || store.state === state),
    );
    if (sort === "Name (Z to A)") return [...result].reverse();
    if (sort === "SKUs (high to low)")
      return [...result].sort((a, b) => b.totalSkus - a.totalSkus);
    return result;
  }, [search, sort, stores]);

  const handleSaved = (name: string, entityType: CatalogueEntityType) => {
    setAddType(null);
    setSuccess({ name, type: entityType });
  };

  return (
    <div className="pb-8 text-ink">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h1 className="text-[16px] font-bold">Total store - 64</h1>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="relative w-[275px] max-w-full">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/35"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search store name"
              className="h-7 w-full rounded-md border-0 bg-white pl-8 pr-3 text-[9px] outline-none placeholder:text-ink/30"
            />
          </div>
          <div className="w-[105px]">
            <CatalogueDropdown
              value={state}
              options={["All State", "Telangana", "Maharashtra"]}
              onChange={setState}
            />
          </div>
          <SlidersHorizontal size={16} className="text-ink/65" />
          <div className="w-[108px]">
            <CatalogueDropdown
              value={sort}
              options={["Name (A to Z)", "Name (Z to A)", "SKUs (high to low)"]}
              onChange={setSort}
              align="right"
            />
          </div>
        </div>
      </div>

      <CommonTable
        headers={[
          { header: "STORE", width: "1.35fr" },
          { header: "TOTAL SKUS", width: "1fr" },
          { header: "MEN'S SKUS", width: "1fr" },
          { header: "WOMEN'S SKUS", width: "1fr" },
          { header: "TEEN'S SKUS", width: "1fr" },
          { header: "KID'S SKUS", width: "1fr" },
          { header: "GENZ'S SKUS", width: "1fr" },
          { header: "INTEGRATION", width: "1fr" },
          { header: "ACTION", width: "1fr" },
        ]}
        data={filtered.map((store) => [
          <div key="store" className="flex min-w-0 items-center gap-2">
            <img
              src={store.image}
              alt={store.name}
              className="h-7 w-7 shrink-0 rounded object-cover"
            />
            <span className="truncate font-semibold">{store.name}</span>
          </div>,
          store.totalSkus,
          store.menSkus,
          store.womenSkus,
          store.teensSkus,
          store.kidsSkus,
          store.genzSkus,
          <button
            key="integration"
            type="button"
            onClick={() =>
              navigate("/admin-dashboard/catalogue/integration-status")
            }
            className="font-medium text-blue-600 underline underline-offset-2"
          >
            {store.pending} pending
          </button>,
          <button
            key="action"
            type="button"
            onClick={() =>
              navigate(`/admin-dashboard/catalogue/store/${store.id}`)
            }
            className="h-7 w-[102px] shrink-0 rounded-md border border-[#765038] font-medium text-[#765038] hover:bg-[#faf6f2]"
          >
            View catalogue
          </button>,
        ])}
        rowKeys={filtered.map((store) => store.id)}
        minWidth={1160}
      />

      {addType && (
        <CatalogueAddModal
          entityType={addType}
          onClose={() => setAddType(null)}
          onSaved={handleSaved}
        />
      )}
      {success && (
        <SuccessModal success={success} onClose={() => setSuccess(null)} />
      )}
      <AddTypePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(value) => {
          setPickerOpen(false);
          setAddType(value);
        }}
      />
    </div>
  );
}

function AddTypePicker({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (value: CatalogueEntityType) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/30 p-4 backdrop-blur-[1px]">
      <div className="w-full max-w-[940px] rounded-xl bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <h2 className="text-[16px] font-semibold">Add new</h2>
          <button type="button" onClick={onClose}>
            <span className="text-2xl text-ink/55">×</span>
          </button>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <PickerCard
            icon="▦"
            label="PRODUCT CATEGORY"
            onClick={() => onSelect("product-category")}
          />
          <PickerCard
            icon="◩"
            label="CATEGORY"
            onClick={() => onSelect("category")}
          />
          <PickerCard
            icon="☷"
            label="SUB-CATEGORY"
            onClick={() => onSelect("sub-category")}
          />
        </div>
      </div>
    </div>
  );
}

function PickerCard({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-black/15 text-center transition-all hover:border-[#765038] hover:bg-[#fcfaf8]"
    >
      <span className="text-[54px] leading-none text-[#765038]">{icon}</span>
      <span className="mt-5 text-[16px] font-medium">
        {label} <ArrowRight size={16} className="inline" />
      </span>
    </button>
  );
}

function SuccessModal({
  success,
  onClose,
}: {
  success: { name: string; type: CatalogueEntityType };
  onClose: () => void;
}) {
  const label =
    success.type === "product-category"
      ? "product category"
      : success.type === "sub-category"
        ? "sub-category"
        : "category";
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30 p-4 backdrop-blur-[1px]">
      <div className="relative w-full max-w-[475px] rounded-xl bg-white px-7 py-8 text-center shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-ink/50"
        >
          ×
        </button>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#2abd62] text-[#2abd62]">
          ✓
        </div>
        <p className="mt-5 text-[16px]">
          <strong>“{success.name}”</strong> {label} has been added!
        </p>
      </div>
    </div>
  );
}
