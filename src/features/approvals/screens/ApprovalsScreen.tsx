import { useEffect, useState } from "react";
import { Download, Search, AlertCircle, FileSearch } from "lucide-react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { useApprovalsList } from "../hooks";
import { approvalsApi } from "../api";
import {
  ActionConfirmationModal,
  ApprovalSuccessModal,
} from "../components/ApprovalModal";
import type { ApprovalItem } from "../types/approvals.types";
import type { ApprovalType } from "../types/approvals.types";
import ApprovalTabs from "../components/ApprovalTabs";
import ApprovalTable from "../components/ApprovalTable";
import ApprovalVendorCards from "../components/ApprovalVendorCards";
import Pagination from "../../../shared/components/common/Pagination";

function Skeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className="h-[58px] animate-pulse rounded-lg border border-black/5 bg-white"
        >
          <div className="m-5 h-3 w-2/3 rounded bg-[#eeeae5]" />
        </div>
      ))}
    </div>
  );
}
export default function ApprovalsScreen() {
  const { setPageAction } = useDashboardOutletContext();
  const [activeType, setActiveType] = useState<ApprovalType>("vendor");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [actionItem, setActionItem] = useState<ApprovalItem | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [reason, setReason] = useState("");
  const [successItem, setSuccessItem] = useState<ApprovalItem | null>(null);
  const [successType, setSuccessType] = useState<"approve" | "reject">(
    "approve",
  );
  const [actionError, setActionError] = useState("");
  const { items, counts, totalElements, totalPages, isLoading, error, reload } =
    useApprovalsList(activeType, search, page);
  useEffect(() => {
    setPage(0);
  }, [activeType, search]);
  useEffect(() => {
    if (activeType === "rider")
      setPageAction(
        <button
          type="button"
          onClick={() => void approvalsApi.exportRiders({ search })}
          className="flex h-9 items-center gap-2 rounded-lg bg-[#0878df] px-4 text-xs font-semibold text-white hover:bg-[#066bc7]"
        >
          <Download size={14} />
          Export
        </button>,
      );
    else setPageAction(null);
    return () => setPageAction(null);
  }, [activeType, search, setPageAction]);
  const tabCounts = {
    vendor: Number(counts.PENDING ?? counts.ALL ?? 0),
    rider: Number(counts.ALL ?? counts.PENDING ?? 0),
  };
  const confirmAction = async () => {
    if (!actionItem) return;
    setActionError("");
    try {
      if (actionType === "approve")
        await approvalsApi.approveVendor(actionItem.id);
      else await approvalsApi.rejectVendor(actionItem.id, reason.trim());
      setSuccessItem(actionItem);
      setSuccessType(actionType);
      setActionItem(null);
      setReason("");
      await reload();
    } catch (e) {
      setActionError(
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Unable to complete this action. Please try again.",
      );
    }
  };
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <ApprovalTabs
          active={activeType}
          counts={tabCounts}
          onChange={(type) => {
            setActiveType(type);
            setPage(0);
          }}
        />
        <label className="flex h-10 w-full max-w-[340px] items-center gap-2 rounded-lg border border-[#e5e0da] bg-white px-3 focus-within:border-[#0878df]">
          <Search size={16} className="shrink-0 text-ink/40" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder={`Search ${activeType} by name, mobile${activeType === "vendor" ? ", company" : ""}...`}
            className="min-w-0 flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-ink/40"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-xs text-ink/45 hover:text-ink"
            >
              Clear
            </button>
          )}
        </label>
      </div>
      {isLoading ? (
        <Skeleton />
      ) : error ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-[#f2d7d7] bg-white p-8 text-center">
          <AlertCircle size={34} className="mb-3 text-[#df6868]" />
          <p className="text-sm font-semibold text-ink">
            Couldn’t load approvals
          </p>
          <p className="mt-1 max-w-md text-xs text-ink/55">{error}</p>
          <button
            type="button"
            onClick={() => void reload()}
            className="mt-4 rounded-lg bg-[#0878df] px-4 py-2 text-xs font-semibold text-white"
          >
            Try again
          </button>
        </div>
      ) : items.length ? (
        <>
          {activeType === "vendor" ? (
            <ApprovalVendorCards
              items={items}
              onReject={(item) => {
                setActionItem(item);
                setActionType("reject");
                setReason("");
                setActionError("");
              }}
              onApprove={(item) => {
                setActionItem(item);
                setActionType("approve");
                setActionError("");
              }}
            />
          ) : (
            <ApprovalTable
              items={items}
              onReject={() => {}}
              onApprove={() => {}}
            />
          )}
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={10}
            onPageChange={setPage}
          />
        </>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-[#eee8e2] bg-white p-8 text-center">
          <FileSearch size={36} className="mb-3 text-ink/25" />
          <p className="text-sm font-semibold text-ink">
            {search
              ? "No matching approvals found"
              : `No ${activeType} approvals`}
          </p>
          <p className="mt-1 text-xs text-ink/45">
            {search
              ? "Try another name, mobile number, or search term."
              : "There are no applications to display right now."}
          </p>
        </div>
      )}
    </div>
  );
}
