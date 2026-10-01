import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { useApprovalsList } from "../hooks";
import { exportRiderApprovals, filterApprovals, getApprovalTypeCount } from "../utils/approvals.utils";
import type { ApprovalItem, ApprovalType } from "../types/approvals.types";
import ApprovalTabs from "../components/ApprovalTabs";
import ApprovalTable from "../components/ApprovalTable";
import ApprovalVendorCards from "../components/ApprovalVendorCards";
import { ActionConfirmationModal, ApprovalSuccessModal } from "../components/ApprovalModal";

export default function ApprovalsScreen() {
    const { items, isLoading, error } = useApprovalsList();
    const { setPageAction } = useDashboardOutletContext();
    const [activeType, setActiveType] = useState<ApprovalType>("vendor");
    const [actionItem, setActionItem] = useState<ApprovalItem | null>(null);
    const [actionType, setActionType] = useState<"approve" | "reject">("approve");
    const [successItem, setSuccessItem] = useState<ApprovalItem | null>(null);
    const [successType, setSuccessType] = useState<"approve" | "reject">("approve");
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (activeType === "rider") {
            setPageAction(
                <button
                    type="button"
                    onClick={() => exportRiderApprovals(items)}
                    className="flex h-9 items-center gap-2 rounded-lg bg-[#0878df] px-4 text-xs font-semibold text-white hover:bg-[#066bc7]"
                >
                    Export
                    <Download size={14} />
                </button>,
            );
        } else {
            setPageAction(null);
        }

        return () => setPageAction(null);
    }, [activeType, items, setPageAction]);

    const counts = useMemo(
        () => ({
            vendor: getApprovalTypeCount(items, "vendor"),
            rider: getApprovalTypeCount(items, "rider"),
        }),
        [items],
    );

    const filteredItems = useMemo(() => filterApprovals(items, activeType), [items, activeType]);

    const openAction = (item: ApprovalItem, type: "approve" | "reject") => {
        setActionItem(item);
        setActionType(type);
        setReason("");
    };

    const confirmAction = () => {
        if (!actionItem) return;
        setSuccessItem(actionItem);
        setSuccessType(actionType);
        setActionItem(null);
        setReason("");
    };

    if (isLoading) return <div className="h-80 animate-pulse rounded-xl bg-white" />;
    if (error) return <p className="rounded-xl bg-white p-5 text-sm text-red-500">{error}</p>;

    return (
        <div>
            <div className="mb-4">
                <ApprovalTabs active={activeType} counts={counts} onChange={setActiveType} />
            </div>

            {filteredItems.length > 0 ? (
                activeType === "vendor" ? (
                    <ApprovalVendorCards
                        items={filteredItems}
                        onReject={(item) => openAction(item, "reject")}
                        onApprove={(item) => openAction(item, "approve")}
                    />
                ) : (
                    <ApprovalTable
                        items={filteredItems}
                        onReject={(item) => openAction(item, "reject")}
                        onApprove={(item) => openAction(item, "approve")}
                    />
                )
            ) : (
                <div className="rounded-xl bg-white py-16 text-center shadow-sm">
                    <p className="text-sm font-semibold text-ink">No {activeType} approvals</p>
                    <p className="mt-1 text-xs text-ink/40">There are no pending applications to review.</p>
                </div>
            )}

            <ActionConfirmationModal
                open={Boolean(actionItem)}
                item={actionItem}
                action={actionType}
                reason={reason}
                onReasonChange={setReason}
                onCancel={() => setActionItem(null)}
                onConfirm={confirmAction}
            />
            <ApprovalSuccessModal
                open={Boolean(successItem)}
                item={successItem}
                action={successType}
                onClose={() => setSuccessItem(null)}
            />
        </div>
    );
}
