import { Bike, Check, X, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { OverviewApprovalRow } from "../types/overview.types";

interface ApprovalPanelProps {
    approvals: OverviewApprovalRow[];
    onAction?: (id: string | number, action: "approve" | "reject") => void;
}

export default function ApprovalPanel({ approvals, onAction }: ApprovalPanelProps) {
    return (
        <section className="min-w-0">
            <div className="mb-2 flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-ink">Approval</h2>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                {approvals.map((approval, index) => {
                    const isRider = approval.type.toLowerCase() === "rider";
                    return (
                        <div
                            key={`${approval.id}-${index}`}
                            className="flex min-h-[64px] items-center gap-2 border-b border-black/5 px-3 last:border-b-0"
                        >
                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isRider ? "bg-orange-50 text-orange-400" : "bg-sky-50 text-sky-500"}`}>
                                {isRider ? <Bike size={15} /> : <Users size={15} />}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[10.5px] font-semibold text-ink">
                                    {approval.name}
                                    <Link
                                        to={`/admin-dashboard/approvals/${approval.id}`}
                                        className="ml-1 text-[9px] font-semibold text-sky-500 hover:underline"
                                    >
                                        View details
                                    </Link>
                                </p>
                                <p className="truncate text-[9px] text-ink/50">
                                    {approval.vehicleOrStore}
                                </p>
                                <p className="text-[8.5px] text-ink/35">Waiting - {approval.waiting}</p>
                            </div>
                            <div className="flex shrink-0 gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => onAction?.(approval.id, "reject")}
                                    className="rounded-md bg-rose-50 px-2.5 py-1.5 text-[9px] font-semibold text-rose-400 hover:bg-rose-100"
                                >
                                    Reject
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onAction?.(approval.id, "approve")}
                                    className="rounded-md bg-emerald-50 px-2.5 py-1.5 text-[9px] font-semibold text-emerald-500 hover:bg-emerald-100"
                                >
                                    Approve
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
