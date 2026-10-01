import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { createPortal } from "react-dom";

import StatCard from "../../../shared/components/common/StatCard";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { useOverview } from "../hooks/useOverview";
import OverviewChart from "../components/OverviewChart";
import TopVendorsPanel from "../components/TopVendorsPanel";
import ApprovalPanel from "../components/ApprovalPanel";
import OverviewLoading from "../components/OverviewLoading";
import { ActionConfirmationModal, ApprovalSuccessModal } from "../../approvals/components/ApprovalModal";
import { mockApprovals } from "../../approvals/data/mockApprovals";
import type { ApprovalItem } from "../../approvals/types/approvals.types";

const INDIAN_STATES = [
    "All State",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Maharashtra",
];

export default function OverviewScreen() {
    const { overview, isLoading, error } = useOverview();
    const { setPageAction } = useDashboardOutletContext();
    const [actionItem, setActionItem] = useState<ApprovalItem | null>(null);
    const [actionType, setActionType] = useState<"approve" | "reject">("approve");
    const [successItem, setSuccessItem] = useState<ApprovalItem | null>(null);
    const [successType, setSuccessType] = useState<"approve" | "reject">("approve");
    const [reason, setReason] = useState("");

    useEffect(() => {
        setPageAction(
            <button
                type="button"
                className="flex h-9 items-center gap-2 rounded-lg bg-[#0878df] px-4 text-xs font-semibold text-white hover:bg-[#066bc7]"
            >
                <Download size={14} />
                Export
            </button>,
        );

        return () => setPageAction(null);
    }, [setPageAction]);

    if (isLoading) return <OverviewLoading />;
    if (error) return <p className="rounded-xl bg-white p-5 text-sm text-red-500">{error}</p>;
    if (!overview) return null;

    const handleApprovalAction = (id: string | number, action: "approve" | "reject") => {
        const item = mockApprovals.find((approval) => String(approval.id) === String(id));
        if (!item) return;
        setActionItem(item);
        setActionType(action);
        setReason("");
    };

    const confirmApprovalAction = () => {
        if (!actionItem) return;
        setSuccessItem(actionItem);
        setSuccessType(actionType);
        setActionItem(null);
        setReason("");
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {overview.stats.map((stat) => {
                    const { key, ...props } = stat;
                    return <StatCard key={key} {...props} />;
                })}
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_385px]">
                <div className="space-y-4">
                    <OverviewChart
                        title="Revenue - Last 7 days"
                        data={overview.revenueChart}
                        summary={overview.revenueSummary}
                        variant="revenue"
                    />
                    <OverviewChart
                        title="Order - Last 7 weeks"
                        data={overview.orderChart ?? []}
                        variant="orders"
                    />
                </div>

                <div className="space-y-4">
                    <TopVendorsPanel vendors={overview.topVendors} states={INDIAN_STATES} />
                    {overview.approvals && overview.approvals.length > 0 && (
                        <ApprovalPanel approvals={overview.approvals} onAction={handleApprovalAction} />
                    )}
                </div>
            </div>
            {createPortal(
    <ActionConfirmationModal
        open={Boolean(actionItem)}
        item={actionItem}
        action={actionType}
        reason={reason}
        onReasonChange={setReason}
        onCancel={() => setActionItem(null)}
        onConfirm={confirmApprovalAction}
    />,
    document.body,
)}

{createPortal(
    <ApprovalSuccessModal
        open={Boolean(successItem)}
        item={successItem}
        action={successType}
        onClose={() => setSuccessItem(null)}
    />,
    document.body,
)}
        </div>
    );
}
