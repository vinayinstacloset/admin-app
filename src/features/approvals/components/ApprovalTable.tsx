import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../shared/components/common/buttons";
import type { ApprovalItem } from "../types/approvals.types";

interface ApprovalTableProps {
    items: ApprovalItem[];
    onReject: (item: ApprovalItem) => void;
    onApprove: (item: ApprovalItem) => void;
}

const headers = ["Name", "Email", "Contact", "Vehicle", "Vehicle No.", "City", "State", "Action"];

export default function ApprovalTable({ items, onReject, onApprove }: ApprovalTableProps) {
    return (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
            <table className="w-full min-w-[1040px] border-collapse">
                <thead>
                    <tr className="bg-[#f4f4f2] text-left text-[10px] uppercase tracking-wide text-ink/55">
                        {headers.map((header) => (
                            <th key={header} className="px-5 py-3 font-semibold">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id} className="border-b border-black/5 last:border-b-0">
                            <td className="px-5 py-4 text-[12px] font-semibold text-ink">{item.name}</td>
                            <td className="max-w-[160px] truncate px-5 py-4 text-[12px] text-ink/65">{item.email}</td>
                            <td className="px-5 py-4 text-[12px] text-ink/75">{item.contact}</td>
                            <td className="px-5 py-4 text-[12px] text-ink/75">{item.vehicle}</td>
                            <td className="px-5 py-4 text-[12px] text-ink/75">{item.vehicleNumber}</td>
                            <td className="px-5 py-4 text-[12px] text-ink/75">{item.city}</td>
                            <td className="px-5 py-4 text-[12px] text-ink/75">{item.state}</td>
                            <td className="px-5 py-3">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => onReject(item)}
                                        className="bg-[#ed7777]"
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => onApprove(item)}
                                        className="bg-[#2fbd66]"
                                    >
                                        Approve
                                    </Button>
                                    <Link
                                        to={`/admin-dashboard/approvals/${item.id}`}
                                        className="inline-flex items-center gap-1 rounded-md border border-[#a99b8f] px-3 py-1.5 text-xs text-ink/70 hover:bg-cream"
                                    >
                                        <Eye size={12} />
                                        View
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
