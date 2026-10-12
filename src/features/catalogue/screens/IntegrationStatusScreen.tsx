import { useEffect, useMemo, useState } from "react";
import { Filter, Building2, Grid2X2, UserRound } from "lucide-react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import CatalogueDropdown from "../components/CatalogueDropdown";
import { ApproveModal, RejectModal } from "../components/IntegrationModals";
import { useCatalogueIntegration } from "../hooks";
import type {
  IntegrationItem,
  IntegrationStatus,
  IntegrationType,
} from "../types/catalogue.types";
import { integrationCount, integrationLabel } from "../utils/catalogue.utils";

const tabs: Array<{ label: string; value: IntegrationType }> = [
  { label: "PRODUCT CATEGORY", value: "PRODUCT CATEGORY" },
  { label: "CATEGORY", value: "CATEGORY" },
  { label: "SUB-CATEGORY", value: "SUB-CATEGORY" },
];

const entityMap: Record<IntegrationType, IntegrationItem["entityType"]> = {
  "PRODUCT CATEGORY": "product-category",
  CATEGORY: "category",
  "SUB-CATEGORY": "sub-category",
};

const statuses: Array<{ label: string; value: IntegrationStatus }> = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function IntegrationStatusScreen() {
  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();
  const { items: sourceItems } = useCatalogueIntegration();
  const [items, setItems] = useState(sourceItems);
  const [type, setType] = useState<IntegrationType>("PRODUCT CATEGORY");
  const [status, setStatus] = useState<IntegrationStatus>("pending");
  const [gender, setGender] = useState("All Gender");
  const [selected, setSelected] = useState<IntegrationItem | null>(null);
  const [modal, setModal] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    setExtraCrumbs([
      { label: "Catalogue", to: "/admin-dashboard/catalogue" },
      { label: "Integration Status" },
    ]);
    setPageAction(null);
    return () => {
      setExtraCrumbs([]);
      setPageAction(null);
    };
  }, [setExtraCrumbs, setPageAction]);

  const entityType = entityMap[type];
  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          item.entityType === entityType &&
          item.status === status &&
          (gender === "All Gender" || item.gender === gender),
      ),
    [entityType, gender, items, status],
  );
  const count = integrationCount(items, entityType, status);

  const approve = (item: IntegrationItem) => {
    setSelected(item);
    setModal("approve");
    setItems((current) =>
      current.map((entry) =>
        entry.id === item.id ? { ...entry, status: "approved" } : entry,
      ),
    );
  };

  const reject = (item: IntegrationItem) => {
    setSelected(item);
    setModal("reject");
  };

  const confirmReject = () => {
    if (!selected) return;
    setItems((current) =>
      current.map((entry) =>
        entry.id === selected.id ? { ...entry, status: "rejected" } : entry,
      ),
    );
    setModal(null);
    setSelected(null);
  };

  return (
    <div className="pb-8 text-ink">
      <div className="flex items-end justify-center border-b border-black/10">
        <div className="grid w-full max-w-[520px] grid-cols-3">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setType(tab.value);
                setStatus("pending");
              }}
              className={`relative h-11 text-[11px] font-medium transition-colors ${type === tab.value ? "text-[#765038]" : "text-ink/55"}`}
            >
              <span>{tab.label}</span>
              {type === tab.value && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[3px] rounded-full bg-[#765038]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {statuses.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setStatus(item.value)}
              className={`relative pb-2 text-[12px] font-semibold transition-colors ${status === item.value ? (item.value === "approved" ? "text-[#27b95e]" : item.value === "rejected" ? "text-[#e86b6b]" : "text-[#9b2cff]") : "text-ink/35"}`}
            >
              {item.label}
              {status === item.value && (
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${item.value === "approved" ? "bg-[#27b95e]" : item.value === "rejected" ? "bg-[#e86b6b]" : "bg-[#9b2cff]"}`}
                />
              )}
              {status === item.value ? ` – ${count}` : ""}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Filter size={17} className="text-ink/70" />
          <div className="w-[105px]">
            <CatalogueDropdown
              value={gender}
              options={["All Gender", "MEN", "WOMEN", "TEENS", "KIDS", "GENZ"]}
              onChange={setGender}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <IntegrationCard
            key={item.id}
            item={item}
            onApprove={() => approve(item)}
            onReject={() => reject(item)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl bg-white py-16 text-center text-[11px] text-ink/40">
          No {status} {integrationLabel(entityType)} records found.
        </div>
      )}

      {selected && modal === "approve" && (
        <ApproveModal
          item={selected}
          onClose={() => {
            setModal(null);
            setSelected(null);
          }}
          onConfirm={() => {}}
        />
      )}
      {selected && modal === "reject" && (
        <RejectModal
          item={selected}
          onClose={() => {
            setModal(null);
            setSelected(null);
          }}
          onConfirm={confirmReject}
        />
      )}
    </div>
  );
}

function IntegrationCard({
  item,
  onApprove,
  onReject,
}: {
  item: IntegrationItem;
  onApprove: () => void;
  onReject: () => void;
}) {
  const meta = item.entityType === "product-category";
  const categoryMeta = item.entityType !== "product-category";
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/[0.02]">
      {meta ? (
        <div className="grid h-[116px] grid-cols-[48%_52%]">
          <div className="relative overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
            <span className="absolute right-2 top-2 rounded bg-white/90 px-1.5 py-0.5 text-[7px] font-semibold text-ink">
              {item.gender}
              {item.navigation ? `/${item.navigation}` : ""}
            </span>
          </div>
          <div className="flex min-w-0 flex-col justify-center px-3">
            <p className="flex items-center gap-1 text-[9px] text-ink/45">
              <Building2 size={11} />
              {item.store}
            </p>
            <h3 className="mt-1 truncate text-[17px] font-medium text-ink">
              {item.name}
            </h3>
          </div>
        </div>
      ) : (
        <div className="min-h-[166px] p-2.5">
          <div className="grid grid-cols-3 rounded-md bg-[#f3f2f0] px-2 py-2 text-[8px] font-medium text-ink/55">
            <span className="flex items-center gap-1">
              <UserRound size={11} />
              {item.gender}
              {item.navigation ? `/${item.navigation}` : ""}
            </span>
            <span className="flex items-center gap-1">
              <Grid2X2 size={10} />
              {item.productCategory}
            </span>
            <span className="flex items-center justify-end gap-1">
              <Building2 size={10} />
              {item.store}
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center py-2 text-center">
            <img
              src={item.image}
              alt={item.name}
              className="h-14 w-14 object-contain"
            />
            <h3 className="mt-2 text-[15px] font-medium text-ink">
              {item.name}
            </h3>
            {categoryMeta && item.entityType === "sub-category" && (
              <span className="mt-1 rounded bg-[#f0f0ee] px-2 py-1 text-[8px] text-ink/70">
                👕 ({item.category === "Shirt" ? "Polo" : item.category})
              </span>
            )}
          </div>
        </div>
      )}
      {item.status === "pending" && (
        <div className="grid grid-cols-2 gap-2 border-t border-black/10 p-2.5">
          <button
            type="button"
            onClick={onReject}
            className="h-9 rounded-md bg-[#fff0ef] text-[11px] font-semibold text-[#e96a6a] hover:bg-[#ffe7e5]"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={onApprove}
            className="h-9 rounded-md bg-[#ebf9ef] text-[11px] font-semibold text-[#20b85b] hover:bg-[#e2f6e9]"
          >
            Approve
          </button>
        </div>
      )}
    </article>
  );
}
