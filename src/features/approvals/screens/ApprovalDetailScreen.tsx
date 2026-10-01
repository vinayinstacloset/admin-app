import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { useApprovalDetail } from "../hooks";
import ApprovalDetail from "../components/ApprovalDetail";
import { ActionConfirmationModal, ApprovalSuccessModal } from "../components/ApprovalModal";
import type { ApprovalItem } from "../types/approvals.types";

export default function ApprovalDetailScreen() {
    const { approvalId = "" } = useParams<{ approvalId: string }>();
    const { item, isLoading, error } = useApprovalDetail(approvalId);
    const { setPageAction, setExtraCrumbs } = useDashboardOutletContext();
    const [actionOpen, setActionOpen] = useState(false);
    const [actionType, setActionType] = useState<"approve" | "reject">("approve");
    const [successItem, setSuccessItem] = useState<ApprovalItem | null>(null);
    const [successType, setSuccessType] = useState<"approve" | "reject">("approve");
    const [reason, setReason] = useState("");

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
                    onClick={() => {
                        setActionType("reject");
                        setReason("");
                        setActionOpen(true);
                    }}
                    className="rounded-md bg-[#ed7777] px-4 py-2 text-xs font-semibold text-white"
                >
                    Reject
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setActionType("approve");
                        setActionOpen(true);
                    }}
                    className="rounded-md bg-[#2fbd66] px-4 py-2 text-xs font-semibold text-white"
                >
                    Approve
                </button>
            </div>,
        );

        return () => {
            setPageAction(null);
            setExtraCrumbs([]);
        };
    }, [item, setExtraCrumbs, setPageAction]);

    if (isLoading) return <div className="h-[600px] animate-pulse rounded-xl bg-white" />;
    if (error || !item) return <p className="rounded-xl bg-white p-5 text-sm text-red-500">{error || "Approval not found."}</p>;

    const confirmAction = () => {
        setActionOpen(false);
        setSuccessType(actionType);
        setSuccessItem(item);
        setReason("");
    };

    return (
        <>
            <ApprovalDetail item={item} />
            <ActionConfirmationModal
                open={actionOpen}
                item={item}
                action={actionType}
                reason={reason}
                onReasonChange={setReason}
                onCancel={() => setActionOpen(false)}
                onConfirm={confirmAction}
            />
            <ApprovalSuccessModal
                open={Boolean(successItem)}
                item={successItem}
                action={successType}
                onClose={() => setSuccessItem(null)}
            />
        </>
    );
}
