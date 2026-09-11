import type { OrderPriceDetails } from "../types/order.types";

interface PriceDetailsCardProps {
    price: OrderPriceDetails;
}

function Row({ label, value, bold, valueClassName = "text-ink" }: { label: string; value: string; bold?: boolean; valueClassName?: string }) {
    return (
        <div className="flex items-center justify-between">
            <dt className="text-ink/50">{label}</dt>
            <dd className={`${bold ? "font-bold" : "font-medium"} ${valueClassName}`}>{value}</dd>
        </div>
    );
}

export default function PriceDetailsCard({ price }: PriceDetailsCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5 max-w-md">
            <h2 className="text-sm font-semibold text-ink mb-3">Price details</h2>
            <dl className="space-y-2 text-[12.5px]">
                <Row label="MRP" value={price.mrp} />
                <Row label="GST" value={price.gst} />
                <Row label="Total" value={price.total} bold />
                <div className="h-px bg-black/5 my-2" />
                <Row label="Vendor payout" value={price.vendorPayout} valueClassName="text-rose-600" />
                <Row label="Rider payout" value={price.riderPayout} valueClassName="text-rose-600" />
                <Row label="Platform commission" value={price.platformCommission} valueClassName="text-emerald-600" />
            </dl>
        </div>
    );
}
