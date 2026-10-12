import {
  BriefcaseBusiness,
  Clock3,
  Filter,
  MapPin,
  Search,
  ShoppingBag,
  Star,
  Store as StoreIcon,
} from "lucide-react";
import { useState } from "react";
import { useStoreList } from "../hooks";
import type { StoreItem } from "../types/store.types";
import { formatCurrency } from "../utils/store.utils";
import { Dropdown, classNames } from "./StoreCommon";

const states = [
  "All State",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
];

const storeStatusOptions = ["All", "Open", "Closed"] as const;

function StoreCard({
  store,
  onDetails,
}: {
  store: StoreItem;
  onDetails: () => void;
}) {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const stats = [
    {
      icon: BriefcaseBusiness,
      value: formatCurrency(store.revenue),
      label: "Today revenue",
    },
    { icon: ShoppingBag, value: String(store.orders), label: "Today order" },
    { icon: Star, value: store.rating.toFixed(1), label: "Store rating" },
  ];

  return (
    <article className="rounded-xl bg-white p-3 shadow-sm">
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={store.image}
          alt={`${store.name} storefront`}
          className="h-[171px] w-full object-cover"
        />
        <span
          className={classNames(
            "absolute right-2 top-2 rounded px-2 py-1 text-[11px] font-semibold text-white",
            store.status === "Open" ? "bg-[#28bf69]" : "bg-[#ef6d73]",
          )}
        >
          {store.status}
        </span>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[13px] font-bold text-ink">{store.name}</h2>
          <button
            type="button"
            onClick={onDetails}
            className="text-[11px] font-semibold text-blue-600 underline underline-offset-2"
          >
            View details
          </button>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-ink/55">
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {store.city}, {store.state}
          </span>
          <span className="flex items-center gap-1">
            <Clock3 size={11} />
            {store.hours}
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {stats.map(({ icon: Icon, value, label }, index) => (
          <div
            key={label}
            className="relative flex h-[59px] cursor-default flex-col items-center justify-center rounded-md bg-[#f2f1ef]"
            onMouseEnter={() => setHoveredStat(index)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <Icon size={15} className="text-ink/45" />
            <span className="mt-1 text-[12px] font-semibold text-ink">
              {value}
            </span>
            {hoveredStat === index && (
              <span className="absolute -top-8 z-20 whitespace-nowrap rounded bg-white px-2.5 py-1.5 text-[10px] text-ink shadow-lg ring-1 ring-black/5">
                {label}
              </span>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}

export default function StoreListView({
  onDetails,
}: {
  onDetails: (store: StoreItem) => void;
}) {
  const {
    filteredItems,
    isLoading,
    search,
    setSearch,
    status,
    setStatus,
    state,
    setState,
  } = useStoreList();

  const [openMenu, setOpenMenu] = useState<"status" | "state" | null>(null);

  return (
    <div>
      <div className="mt-0 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-[16px] font-bold text-ink">Total store - {64}</h2>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search store name, city,..."
              className="h-9 w-[275px] rounded-md border-0 bg-white pl-9 pr-3 text-xs outline-none ring-1 ring-transparent placeholder:text-ink/35 focus:ring-brand-200"
            />
          </div>

          <Dropdown
            value={state}
            options={states}
            open={openMenu === "state"}
            onToggle={() => setOpenMenu(openMenu === "state" ? null : "state")}
            onSelect={(value) => {
              setState(value);
              setOpenMenu(null);
            }}
          />

          <Filter size={17} className="mx-1 text-ink/65" />

          <Dropdown
            value={status}
            options={[...storeStatusOptions]}
            open={openMenu === "status"}
            onToggle={() =>
              setOpenMenu(openMenu === "status" ? null : "status")
            }
            onSelect={(value) => {
              setStatus(value as "All" | "Open" | "Closed");
              setOpenMenu(null);
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-ink/50">
          Loading stores...
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3 lg:grid-cols-2">
          {filteredItems.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onDetails={() => onDetails(store)}
            />
          ))}
        </div>
      )}

      {!isLoading && filteredItems.length === 0 && (
        <div className="mt-4 rounded-xl bg-white p-12 text-center">
          <StoreIcon className="mx-auto text-ink/30" size={28} />
          <p className="mt-2 text-sm font-semibold">No stores found</p>
          <p className="mt-1 text-xs text-ink/45">
            Try another search or filter.
          </p>
        </div>
      )}
    </div>
  );
}
