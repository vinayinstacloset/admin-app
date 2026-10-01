import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { getCustomerDetail, setCustomerStatus } from "../api/customerApi";
import type { CustomerDetail, CustomerTab } from "../types/customer.types";
import CustomerStatCards from "../components/CustomerStatCards";
import CustomerProfileCard from "../components/CustomerProfileCard";
import CustomerMoneySpent from "../components/CustomerMoneySpent";
import CustomerTables from "../components/CustomerTables";

function ConfirmModal({ open, action, onClose, onConfirm }: { open: boolean; action: "block" | "unblock"; onClose: () => void; onConfirm: () => void }) {
    if (!open) return null;
    const isBlock = action === "block";
    return <div className="fixed inset-0 z-[80] bg-black/25 flex items-center justify-center p-5">
        <div className="w-[475px] max-w-full rounded-xl bg-white shadow-2xl px-5 py-7">
            <p className="text-[17px] text-ink text-center">Are you sure you want to <b>{action}</b> Customer?</p>
            <div className="flex justify-center gap-4 mt-6"><button type="button" onClick={onClose} className="h-9 w-[210px] rounded-md border border-black/60 text-[10.5px] font-semibold text-ink/70">No, Wait</button><button type="button" onClick={onConfirm} className={`h-9 w-[210px] rounded-md text-white text-[10.5px] font-semibold ${isBlock ? "bg-[#e87373]" : "bg-[#3cbe69]"}`}>Yes</button></div>
        </div>
    </div>;
}

function DatesPopover({ open, onClose }: { open: boolean; onClose: () => void }) {
    if (!open) return null;
    return <div className="absolute right-0 top-9 z-40 w-[180px] rounded-lg border border-black/10 bg-white shadow-xl p-2"><p className="text-[10px] font-semibold px-2 py-1 text-ink/70">Date range</p><button type="button" onClick={onClose} className="w-full text-left px-2 py-2 rounded hover:bg-[#f6f2ed] text-[10.5px]">Last 12 days</button><button type="button" onClick={onClose} className="w-full text-left px-2 py-2 rounded hover:bg-[#f6f2ed] text-[10.5px]">Last 30 days</button><button type="button" onClick={onClose} className="w-full text-left px-2 py-2 rounded hover:bg-[#f6f2ed] text-[10.5px]">Custom dates</button></div>;
}

export default function CustomerDetailsScreen() {
    const { customerId = "1" } = useParams<{ customerId: string }>();
    const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();
    const [customer, setCustomer] = useState<CustomerDetail | null>(null);
    const [tab, setTab] = useState<CustomerTab>("ORDER");
    const [modalOpen, setModalOpen] = useState(false);
    const [datesOpen, setDatesOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        setLoading(true);
        getCustomerDetail(customerId).then((data) => { if (active) setCustomer(data); }).finally(() => { if (active) setLoading(false); });
        return () => { active = false; setExtraCrumbs([]); };
    }, [customerId, setExtraCrumbs]);

    useEffect(() => {
        if (!customer) return;
        setExtraCrumbs([{ label: "Customers", to: "/admin-dashboard/customers" }, { label: `${customer.profile.name} details` }]);
    }, [customer, setExtraCrumbs]);

    useEffect(() => {
        if (!customer) return;
        const exportCustomer = () => {
            const lines = [
                ["Customer", customer.profile.name],
                ["Email", customer.profile.email],
                ["Phone", customer.profile.phone],
                ["Age/Gender", customer.profile.ageGender],
                ["City/State", customer.profile.city],
                ["Member since", customer.profile.since],
                ["Status", customer.status],
                ["Total orders", customer.stats[0].value],
                ["Total spent", customer.stats[1].value],
                ["Total returns", customer.stats[2].value],
                ["Total exchanges", customer.stats[3].value],
            ].map((row) => row.map((value) => `"${String(value).replaceAll("\"", "\"\"")}"`).join(","));
            const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${customer.profile.name.replaceAll(" ", "-").toLowerCase()}-details.csv`;
            link.click();
            URL.revokeObjectURL(url);
        };
        setPageAction(<div className="flex items-center gap-2"><button type="button" onClick={exportCustomer} className="h-8 px-3 rounded-md bg-blue-600 text-white text-[10.5px] font-semibold flex items-center gap-1.5">Export <Download size={12} /></button><button type="button" onClick={() => setModalOpen(true)} className={`h-8 px-3 rounded-md border text-[10.5px] font-semibold ${customer.status === "Active" ? "border-[#e87373] text-[#d86161]" : "border-[#e87373] text-[#d86161]"}`}>{customer.status === "Active" ? "Block" : "Unblock"}</button></div>);
        return () => setPageAction(null);
    }, [customer, setPageAction]);

    if (loading || !customer) return <div className="py-20 text-center text-xs text-ink/40">Loading customer...</div>;

    const displayStats = customer.stats.map((stat) => {
        if (tab === "RETURN" && stat.label === "Total Return") return { ...stat, value: "5" };
        if (tab === "EXCHANGE" && stat.label === "Total Exchange") return { ...stat, value: "6" };
        return stat;
    });

    return <div>
        <CustomerStatCards stats={displayStats} />
        <CustomerProfileCard profile={customer.profile} />
        <div className="relative"><CustomerMoneySpent data={customer.moneySpent} onDates={() => setDatesOpen((v) => !v)} /><DatesPopover open={datesOpen} onClose={() => setDatesOpen(false)} /></div>
        <CustomerTables tab={tab} onTabChange={setTab} customerId={customerId} orders={customer.orders} returns={customer.returns} exchanges={customer.exchanges} />
        <ConfirmModal open={modalOpen} action={customer.status === "Active" ? "block" : "unblock"} onClose={() => setModalOpen(false)} onConfirm={() => { const nextStatus = customer.status === "Active" ? "Blocked" : "Active"; setCustomerStatus(customerId, nextStatus); setCustomer((current) => current ? { ...current, status: nextStatus } : current); setModalOpen(false); }} />
    </div>;
}
