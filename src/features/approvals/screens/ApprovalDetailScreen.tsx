import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Trash2, CheckCircle2, X } from "lucide-react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { useApprovalDetail } from "../hooks";
import ApprovalDetail from "../components/ApprovalDetail";

export default function ApprovalDetailScreen() {
  const { approvalId = "" } = useParams<{ approvalId: string }>();
  const { item, isLoading, error } = useApprovalDetail(approvalId);
  const { setPageAction, setExtraCrumbs } = useDashboardOutletContext();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!item) return;
    setExtraCrumbs([
      { label: "Approvals", to: "/admin-dashboard/approvals" },
      { label: `${item.name} details` },
    ]);
    setPageAction(
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Delete rider request"
          onClick={() => setDeleteOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#ed7777] text-[#df6868] hover:bg-[#fff0f0]"
        >
          <Trash2 size={16} />
        </button>
        {item.canApprove && (
          <button
            type="button"
            onClick={() => {
              setNotice("");
              setApproveOpen(true);
            }}
            className="flex h-9 items-center gap-2 rounded-lg bg-[#2fbd66] px-4 text-xs font-semibold text-white hover:bg-[#28aa5b]"
          >
            <CheckCircle2 size={15} />
            Approve Rider
          </button>
        )}
      </div>,
    );
    return () => {
      setPageAction(null);
      setExtraCrumbs([]);
    };
  }, [item, setExtraCrumbs, setPageAction]);
  if (isLoading)
    return (
      <div className="space-y-5">
        <div className="h-32 animate-pulse rounded-xl bg-white" />
        <div className="h-64 animate-pulse rounded-xl bg-white" />
        <div className="h-64 animate-pulse rounded-xl bg-white" />
      </div>
    );
  if (error || !item)
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-xl bg-white p-8 text-center">
        <div className="mb-3 text-3xl text-[#df6868]">!</div>
        <p className="text-sm font-semibold text-ink">
          Unable to load rider details
        </p>
        <p className="mt-1 text-xs text-ink/55">
          {error || "Rider not found."}
        </p>
      </div>
    );
  const Modal = ({
    title,
    children,
    onClose,
    confirmLabel,
    onConfirm,
    danger = false,
  }: {
    title: string;
    children: ReactNode;
    onClose: () => void;
    confirmLabel: string;
    onConfirm: () => void;
    danger?: boolean;
  }) => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-ink">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-ink/40 hover:bg-black/5"
          >
            <X size={17} />
          </button>
        </div>
        <div className="text-[13px] leading-5 text-ink/65">{children}</div>
        {notice && (
          <p
            role="alert"
            className="mt-3 rounded-lg bg-[#fff0f0] p-2 text-xs text-[#b42318]"
          >
            {notice}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-black/15 px-4 py-2 text-xs font-medium text-ink/65"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-md px-4 py-2 text-xs font-semibold text-white ${danger ? "bg-[#ed7777]" : "bg-[#2fbd66]"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <ApprovalDetail item={item} />
      {deleteOpen && (
        <Modal
          title="Delete rider request"
          onClose={() => setDeleteOpen(false)}
          confirmLabel="Confirm Delete"
          danger
          onConfirm={() => {
            setDeleteOpen(false);
            setNotice(
              "Rider deletion API is not available yet. No changes were made.",
            );
            setApproveOpen(false);
          }}
        >
          <p>
            Are you sure you want to delete <strong>{item.name}</strong>&apos;s
            rider request? This action cannot be completed until the delete API
            is provided.
          </p>
        </Modal>
      )}
      {approveOpen && (
        <Modal
          title="Approve Rider"
          onClose={() => setApproveOpen(false)}
          confirmLabel="Confirm Approval"
          onConfirm={() =>
            setNotice(
              "The final rider approval API is not available yet. No changes were made.",
            )
          }
        >
          <p>
            All required rider documents are approved. Confirm approval for{" "}
            <strong>{item.name}</strong>.
          </p>
        </Modal>
      )}
    </>
  );
}
