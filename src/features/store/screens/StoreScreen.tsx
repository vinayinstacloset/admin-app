import {
    Bell,
    BriefcaseBusiness,
    Check,
    ChevronDown,
    Clock3,
    Filter,
    Mail,
    MapPin,
    Package,
    Phone,
    Search,
    ShoppingBag,
    SlidersHorizontal,
    Star,
    Store as StoreIcon,
    TrendingDown,
    TrendingUp,
    Download
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";

import {
    BarChart,
    Bar,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type { DashboardOutletContext } from "../../../layouts/DashboardLayout";
import {
    useStoreDetails,
    useStoreList,
    useStoreOrders,
    useStoreReviews,
} from "../hooks";
import type {
    OrderStatus,
    StoreItem,
    StoreReview,
    StoreView,
} from "../types/store.types";
import SkusScreen from "../../skus/screens/SkusScreen";
import {
    formatCurrency,
    ratingPercent,
} from "../utils/store.utils";

const states = [
    "All State",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
];

const storeStatusOptions = ["All", "Open", "Closed"] as const;

const classNames = (...classes: Array<string | false | undefined>) =>
    classes.filter(Boolean).join(" ");

function Dropdown({
    label,
    options,
    value,
    open,
    onToggle,
    onSelect,
    align = "right",
    icon,
}: {
    label?: string;
    options: string[];
    value: string;
    open: boolean;
    onToggle: () => void;
    onSelect: (value: string) => void;
    align?: "left" | "right";
    icon?: ReactNode;
}) {
    return (
        <div className="relative">
            <button
                type="button"
                onClick={onToggle}
                className="flex h-9 min-w-[116px] items-center justify-between gap-3 rounded-md bg-white px-3 text-xs font-semibold text-ink shadow-sm hover:bg-[#fafafa]"
            >
                <span className="flex items-center gap-2">
                    {icon}
                    {label ?? value}
                </span>
                <ChevronDown size={14} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>
            {open && (
                <div
                    className={classNames(
                        "absolute top-10 z-50 min-w-[150px] overflow-hidden rounded-md bg-white p-1 shadow-xl ring-1 ring-black/5",
                        align === "right" ? "right-0" : "left-0",
                    )}
                >
                    {options.map((option) => (
                        <button
                            type="button"
                            key={option}
                            onClick={() => onSelect(option)}
                            className={classNames(
                                "block w-full rounded px-3 py-2.5 text-left text-xs transition-colors",
                                option === value
                                    ? "bg-[#eeeae6] font-semibold text-ink"
                                    : "text-ink/70 hover:bg-[#f7f5f2]",
                            )}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function PageTitle({ children }: { children: ReactNode }) {
    return <h1 className="text-[17px] font-bold tracking-[-0.02em] text-ink">{children}</h1>;
}

function StoreHeaderActions({
    showEmail = false,
    onToggle,
    isOpen,
}: {
    showEmail?: boolean;
    onToggle?: () => void;
    isOpen?: boolean;
}) {
    return (
        <div className="flex items-center gap-4">
            {showEmail && (
                <>
                    <div>
                        <p className="text-xs font-bold text-ink">Store</p>
                        <p className="text-[9px] text-ink/55">Open & Close</p>
                    </div>
                    <button
                        type="button"
                        aria-label="Toggle store status"
                        onClick={onToggle}
                        className={classNames(
                            "relative h-6 w-11 rounded-full transition-colors",
                            isOpen ? "bg-[#21bf67]" : "bg-[red]",
                        )}
                    >
                        <span
                            className={classNames(
                                "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all",
                                isOpen ? "left-6" : "left-1",
                            )}
                        />
                    </button>
                </>
            )}
            
            {showEmail && <Mail size={20} className="text-ink/80" />}
        </div>
    );
}

function StoreCard({
    store,
    onDetails,
}: {
    store: StoreItem;
    onDetails: () => void;
}) {
    const [hoveredStat, setHoveredStat] = useState<number | null>(null);

    const stats = [
        { icon: BriefcaseBusiness, value: formatCurrency(store.revenue), label: "Today revenue" },
        { icon: ShoppingBag, value: String(store.orders), label: "Today order" },
        { icon: Star, value: store.rating.toFixed(1), label: "Store rating" },
    ];

    return (
        <article className="rounded-xl bg-white p-3 shadow-sm">
            <div className="relative overflow-hidden rounded-lg">
                <img
                    src={store.image}
                    alt={`${store.name} storefront`}
                    className="h-[171px] w-full object-cover"
                />
                <span
                    className={classNames(
                        "absolute right-2 top-2 rounded px-2 py-1 text-[11px] font-semibold text-white",
                        store.status === "Open" ? "bg-[#28bf69]" : "bg-[#ef6d73]",
                    )}
                >
                    {store.status}
                </span>
            </div>

            <div className="mt-3">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-[13px] font-bold text-ink">{store.name}</h2>
                    <button
                        type="button"
                        onClick={onDetails}
                        className="text-[11px] font-semibold text-blue-600 underline underline-offset-2"
                    >
                        View details
                    </button>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-ink/55">
                    <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {store.city}, {store.state}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock3 size={11} />
                        {store.hours}
                    </span>
                </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
                {stats.map(({ icon: Icon, value, label }, index) => (
                    <div
                        key={label}
                        className="relative flex h-[59px] cursor-default flex-col items-center justify-center rounded-md bg-[#f2f1ef]"
                        onMouseEnter={() => setHoveredStat(index)}
                        onMouseLeave={() => setHoveredStat(null)}
                    >
                        <Icon size={15} className="text-ink/45" />
                        <span className="mt-1 text-[12px] font-semibold text-ink">{value}</span>
                        {hoveredStat === index && (
                            <span className="absolute -top-8 z-20 whitespace-nowrap rounded bg-white px-2.5 py-1.5 text-[10px] text-ink shadow-lg ring-1 ring-black/5">
                                {label}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </article>
    );
}

function StoreListView({
    onDetails,
}: {
    onDetails: (store: StoreItem) => void;
}) {
    const {
        filteredItems,
        isLoading,
        search,
        setSearch,
        status,
        setStatus,
        state,
        setState,
    } = useStoreList();

    const [openMenu, setOpenMenu] = useState<"status" | "state" | null>(null);

    return (
        <div>
            <div className="mt-0 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-[16px] font-bold text-ink">
                    Total store - {64}
                </h2>

                <div className="flex flex-wrap items-center justify-end gap-2">
                    <div className="relative">
                        <Search
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35"
                        />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search store name, city,..."
                            className="h-9 w-[275px] rounded-md border-0 bg-white pl-9 pr-3 text-xs outline-none ring-1 ring-transparent placeholder:text-ink/35 focus:ring-brand-200"
                        />
                    </div>

                    <Dropdown
                        value={state}
                        options={states}
                        open={openMenu === "state"}
                        onToggle={() => setOpenMenu(openMenu === "state" ? null : "state")}
                        onSelect={(value) => {
                            setState(value);
                            setOpenMenu(null);
                        }}
                    />

                    <Filter size={17} className="mx-1 text-ink/65" />

                    <Dropdown
                        value={status}
                        options={[...storeStatusOptions]}
                        open={openMenu === "status"}
                        onToggle={() => setOpenMenu(openMenu === "status" ? null : "status")}
                        onSelect={(value) => {
                            setStatus(value as "All" | "Open" | "Closed");
                            setOpenMenu(null);
                        }}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-ink/50">
                    Loading stores...
                </div>
            ) : (
                <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3 lg:grid-cols-2">
                    {filteredItems.map((store) => (
                        <StoreCard
                            key={store.id}
                            store={store}
                            onDetails={() => onDetails(store)}
                        />
                    ))}
                </div>
            )}

            {!isLoading && filteredItems.length === 0 && (
                <div className="mt-4 rounded-xl bg-white p-12 text-center">
                    <StoreIcon className="mx-auto text-ink/30" size={28} />
                    <p className="mt-2 text-sm font-semibold">No stores found</p>
                    <p className="mt-1 text-xs text-ink/45">Try another search or filter.</p>
                </div>
            )}
        </div>
    );
}

function StatCard({
    icon,
    iconClass,
    label,
    value,
    link,
    onClick,
}: {
    icon: ReactNode;
    iconClass: string;
    label: string;
    value: string;
    link?: string;
    onClick?: () => void;
}) {
    return (
        <div className="flex min-h-[96px] items-center justify-between rounded-xl bg-white px-3 shadow-sm">
            <div className="min-w-0">
                <div className={classNames("mb-3 flex h-9 w-9 items-center justify-center rounded-full", iconClass)}>
                    {icon}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[12px] text-ink/65">{label}</span>
                    <span className="text-[18px] font-bold tracking-tight text-ink">{value}</span>
                </div>
            </div>
            {link && (
                <button
                    type="button"
                    onClick={onClick}
                    className="self-end pb-4 text-[10px] font-semibold text-blue-600"
                >
                    {link} ›
                </button>
            )}
        </div>
    );
}

function StoreDetailsView({
    onOrders,
    onReviews,
    onSkus,
}: {
    onOrders: () => void;
    onReviews: () => void;
    onSkus: () => void;
}) {
    const { details, products, sales, isLoading } = useStoreDetails();
    if (isLoading || !details) {
        return <div className="rounded-xl bg-white p-10 text-sm text-ink/50">Loading store details...</div>;
    }

    return (
        <div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
                <StatCard
                    icon={<BriefcaseBusiness size={17} />}
                    iconClass="bg-[#e9f8ee] text-[#24bd65]"
                    label="Total Revenue:"
                    value={formatCurrency(details.totalRevenue)}
                />
                <StatCard
                    icon={<ShoppingBag size={17} />}
                    iconClass="bg-[#fff9d8] text-[#e3c500]"
                    label="Total Order:"
                    value={details.totalOrders.toLocaleString("en-IN")}
                    link="View"
                    onClick={onOrders}
                />
                <StatCard
                    icon={<Package size={17} />}
                    iconClass="bg-[#eaf3ff] text-[#1780ea]"
                    label="Total SKUS:"
                    value={String(details.totalSkus)}
                    link="View"
                    onClick={onSkus}
                />
                <StatCard
                    icon={<Check size={17} />}
                    iconClass="bg-[#e9f8ee] text-[#24bd65]"
                    label="Fulfilment rate:"
                    value={`${details.fulfilmentRate}%`}
                />
            </div>

            <div className="mt-5 flex items-center justify-between">
                <h2 className="text-[16px] font-bold">Overview</h2>
            </div>

            <section className="mt-4 rounded-xl bg-white p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[335px_1fr]">
                    <img
                        src={details.image}
                        alt="Nike Bandra"
                        className="h-[162px] w-full rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h3 className="text-[14px] font-bold">
                                    {details.name}{" "}
                                    <span className="font-normal italic text-ink/55">
                                        ({details.description})
                                    </span>
                                </h3>
                                <p className="mt-2 flex items-center gap-2 text-[11px] text-ink/75">
                                    <MapPin size={13} />
                                    {details.address}
                                    <button type="button" className="font-semibold text-blue-600 underline">
                                        Location
                                    </button>
                                </p>
                                <p className="mt-1 flex items-center gap-2 text-[10px] text-ink/55">
                                    <Clock3 size={12} />
                                    {details.hours}
                                </p>
                            </div>
                            <div className="text-[11px] text-ink/75">
                                <p className="flex items-center gap-2"><Mail size={13} /> {details.email}</p>
                                <p className="mt-2 flex items-center gap-2"><Phone size={13} /> {details.phone}</p>
                            </div>
                        </div>

                        <div className="my-3 border-t border-black/10" />

                        <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-[#e9f8ee] px-3 py-1 text-[10px] font-semibold text-[#25ae62]">
                                ★ 4.7 (320 ratings)
                            </span>
                            <span className="rounded-full bg-[#eaf4ff] px-3 py-1 text-[10px] font-semibold text-[#1680e7]">
                                ◉ {details.prepTime}
                            </span>
                            <span className="rounded-full bg-[#fff1ec] px-3 py-1 text-[10px] font-semibold text-[#ef8064]">
                                ♧ {details.deliveryNote}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-[16px] font-bold">Sales revenue</h2>
                    <Dropdown
                        value="19th Mar, 2026"
                        options={["19th Mar, 2026", "18th Mar, 2026", "17th Mar, 2026"]}
                        open={false}
                        onToggle={() => undefined}
                        onSelect={() => undefined}
                    />
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="h-[245px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sales} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                                <CartesianGrid vertical={false} stroke="#eeeeee" />
                                <XAxis
                                    dataKey="label"
                                    axisLine={{ stroke: "#cfcfcf" }}
                                    tickLine={false}
                                    tick={{ fontSize: 9, fill: "#888" }}
                                />
                                <YAxis
                                    width={48}
                                    axisLine={{ stroke: "#cfcfcf" }}
                                    tickLine={false}
                                    tick={{ fontSize: 9, fill: "#888" }}
                                    tickFormatter={(value) => (value === 0 ? "0" : value >= 1000 ? `${value / 1000}k` : String(value))}
                                />
                                <Tooltip
                                    formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
                                    contentStyle={{ borderRadius: 8, border: "1px solid #eee", fontSize: 11 }}
                                />
                                <Bar dataKey="value" fill="#1983e8" radius={[5, 5, 0, 0]} barSize={10} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-end gap-4 text-[10px]">
                        <span className="flex items-center gap-1 text-[#22ae62]"><TrendingUp size={13} /> Peak starts at 04:30 PM</span>
                        <span className="flex items-center gap-1 text-[#ef7777]"><TrendingDown size={13} /> Peak down at 05:50 PM</span>
                    </div>
                </div>
            </section>

            <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.7fr_0.9fr]">
                <section>
                    <h2 className="mb-3 text-[16px] font-bold">Top products</h2>
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-[#f2f1ef] text-[9px] uppercase text-ink/55">
                                <tr>
                                    <th className="px-5 py-3 font-medium">Product</th>
                                    <th className="px-3 py-3 font-medium">Unit sold</th>
                                    <th className="px-3 py-3 font-medium">Revenue</th>
                                    <th className="px-3 py-3 font-medium">Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-t border-black/10">
                                        <td className="px-5 py-3">
                                            <p className="text-[11px] font-semibold">{product.name}</p>
                                            <p className="mt-0.5 text-[9px] text-ink/45">{product.variants}</p>
                                        </td>
                                        <td className="px-3 text-[11px]">{product.unitsSold}</td>
                                        <td className="px-3 text-[11px]">{formatCurrency(product.revenue)}</td>
                                        <td className={classNames(
                                            "px-3 text-[11px] font-semibold",
                                            product.stock <= 3 ? "text-[#f06e6e]" : product.stock <= 10 ? "text-[#e4b900]" : "text-[#21b863]",
                                        )}>
                                            {String(product.stock).padStart(2, "0")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-[16px] font-bold">Store rating</h2>
                        <button
                            type="button"
                            onClick={onReviews}
                            className="rounded-md border border-[#a8876f] px-3 py-2 text-[10px] font-semibold text-[#79563f]"
                        >
                            Customer reviews
                        </button>
                    </div>
                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <div className="flex items-end gap-2">
                            <span className="text-[28px] font-bold">4.6</span>
                            <Star size={18} fill="#f1c400" strokeWidth={0} />
                            <span className="pb-1 text-[9px] text-ink/50">(136 reviews)</span>
                        </div>
                        <div className="mt-4 space-y-3">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const percent = details.ratingBreakdown[rating as 1 | 2 | 3 | 4 | 5];
                                return (
                                    <div key={rating} className="flex items-center gap-2 text-[10px]">
                                        <span className="w-3">{rating}</span>
                                        <div className="h-1 flex-1 rounded-full bg-[#ececec]">
                                            <div
                                                className="h-1 rounded-full bg-[#f0c800]"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <span className="w-6 text-right">{percent}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>


        </div>
    );
}

const orderTabs: Array<"All" | OrderStatus> = [
    "All",
    "New",
    "Packing",
    "Ready",
    "On the way",
    "Delivered",
];

function statusClass(status: OrderStatus) {
    const map: Record<OrderStatus, string> = {
        New: "bg-[#eaf4ff] text-[#1882e9]",
        Packing: "bg-[#fff8dc] text-[#e6bc00]",
        Ready: "bg-[#eaf9ef] text-[#20ad60]",
        "On the way": "bg-[#f1e7ff] text-[#9749df]",
        Delivered: "bg-[#eaf9ef] text-[#20ad60]",
        Rejected: "bg-[#fff0f0] text-[#ef6b6b]",
    };
    return map[status];
}

function OrdersView() {
    const { filteredOrders, search, setSearch, status, setStatus } = useStoreOrders();

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <PageTitle>Orders</PageTitle>
                </div>

            </div>

            <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                <div className="flex items-center gap-5 border-b border-black/10">
                    {orderTabs.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setStatus(tab)}
                            className={classNames(
                                "relative pb-2 text-[13px] font-semibold",
                                status === tab ? "text-[#76533d]" : "text-ink/35",
                            )}
                        >
                            {tab === "All" ? "All - 129" : tab}
                            {status === tab && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#76533d]" />}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search order id, customer name..."
                            className="h-9 w-[300px] rounded-md bg-white pl-9 pr-3 text-[10px] outline-none"
                        />
                    </div>
                    <Filter size={17} className="text-ink/65" />
                    <Dropdown
                        value="Today"
                        options={["Today", "Yesterday", "This week"]}
                        open={false}
                        onToggle={() => undefined}
                        onSelect={() => undefined}
                    />
                </div>
            </div>

            <div className="mt-3 overflow-x-auto rounded-xl bg-white shadow-sm">
                <table className="min-w-[1080px] w-full border-collapse">
                    <thead className="bg-[#f1f0ee] text-left text-[9px] uppercase text-ink/55">
                        <tr>
                            <th className="px-5 py-3">Order</th>
                            <th className="px-3 py-3">Customer</th>
                            <th className="px-3 py-3">Rider</th>
                            <th className="px-3 py-3">Item</th>
                            <th className="px-3 py-3">Status</th>
                            <th className="px-3 py-3">Amount</th>
                            <th className="px-3 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order, index) => (
                            <tr key={`${order.id}-${index}`} className="border-t border-black/10">
                                <td className="px-5 py-3 align-middle">
                                    <p className="text-[12px] font-bold">{order.id}</p>
                                    <p className="mt-1 text-[9px] text-ink/50">{order.items}</p>
                                </td>
                                <td className="px-3 py-3 align-middle">
                                    <p className="text-[10px] font-semibold">{order.customer}</p>
                                    <p className="mt-1 flex items-center gap-1 text-[9px] text-ink/50">
                                        <MapPin size={10} /> {order.customerLocation}
                                    </p>
                                </td>
                                <td className="px-3 py-3 text-[10px] font-semibold">
                                    {order.rider === "-" ? "-" : (
                                        <span className="flex items-center gap-2">
                                            <img src="https://i.pravatar.cc/32?img=12" alt="" className="h-7 w-7 rounded-full" />
                                            {order.rider}
                                        </span>
                                    )}
                                </td>
                                <td className="px-3 py-3">
                                    <p className="max-w-[260px] text-[10px]">{order.itemSummary}</p>
                                    <p className="mt-1 text-[9px] text-ink/50">▱ {order.itemCounts}</p>
                                </td>
                                <td className="px-3 py-3">
                                    <span className={classNames("rounded-full px-3 py-1.5 text-[9px] font-semibold", statusClass(order.status))}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-3 py-3">
                                    <p className="text-[12px] font-bold">{formatCurrency(order.amount)}</p>
                                    <Link
                                        to={`/admin-dashboard/orders/${order.id.replace("#", "")}`}
                                        className="mt-1 inline-block text-[9px] font-semibold text-blue-600 underline"
                                    >
                                        View details
                                    </Link>
                                </td>
                                <td className="px-3 py-3">
                                    {order.status === "New" ? (
                                        <div className="flex gap-2">
                                            <button type="button" className="rounded-md bg-[#ed7174] px-4 py-2 text-[9px] font-semibold text-white">Reject</button>
                                            <button type="button" className="rounded-md bg-[#27b967] px-4 py-2 text-[9px] font-semibold text-white">Accept</button>
                                        </div>
                                    ) : (
                                        <span className="text-[9px] text-ink/60">{order.action}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

function ReviewCard({ review }: { review: StoreReview }) {
    return (
        <article className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff0e9] text-[11px] font-bold text-[#ef7c5c]">
                    {review.initials}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-[11px] font-semibold">{review.customer}</p>
                            <p className="mt-0.5 text-[8px] text-ink/45">{review.date}</p>
                        </div>
                        <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                    key={index}
                                    size={13}
                                    fill={index < review.rating ? "#f0c600" : "none"}
                                    stroke={index < review.rating ? "#f0c600" : "#d4d4d4"}
                                />
                            ))}
                        </div>
                    </div>
                    <p className="mt-3 text-[11px] leading-[1.45] text-ink/90">{review.text}</p>
                    {review.reply && (
                        <div className="mt-3 rounded-lg border border-black/15 bg-[#f2f1ef] p-3">
                            <p className="text-[10px] font-semibold text-[#76533d]">Nike reply</p>
                            <p className="mt-2 text-[10px] leading-[1.45] text-ink/80">{review.reply}</p>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

function ReviewsView() {
    const { filteredReviews, rating, setRating, sort, setSort } = useStoreReviews();
    const [openMenu, setOpenMenu] = useState<"rating" | "sort" | null>(null);

    const total = 136;
    const ratingCounts: Record<number, number> = { 5: 84, 4: 30, 3: 7, 2: 4, 1: 3 };

    return (
        <div>
            <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_375px]">
                <div>
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <h2 className="text-[16px] font-bold">Reviews - 136</h2>
                        <div className="flex items-center gap-2">
                            <Filter size={17} className="text-ink/65" />
                            <Dropdown
                                value={rating}
                                options={["All ratings", "5", "4", "3", "2", "1"]}
                                open={openMenu === "rating"}
                                onToggle={() => setOpenMenu(openMenu === "rating" ? null : "rating")}
                                onSelect={(value) => {
                                    setRating(value);
                                    setOpenMenu(null);
                                }}
                            />
                            <SlidersHorizontal size={16} className="text-ink/65" />
                            <Dropdown
                                value={sort}
                                options={["Newest first", "Oldest first", "Reply given"]}
                                open={openMenu === "sort"}
                                onToggle={() => setOpenMenu(openMenu === "sort" ? null : "sort")}
                                onSelect={(value) => {
                                    setSort(value);
                                    setOpenMenu(null);
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredReviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                </div>

                <aside className="space-y-5">
                    <div>
                        <h2 className="mb-3 text-[16px] font-bold">Overall rating</h2>
                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-[28px] font-bold">4.6</span>
                                <Star size={17} fill="#f0c600" strokeWidth={0} />
                                <span className="text-[9px] text-ink/50">(136 reviews)</span>
                            </div>
                            <div className="mt-4 space-y-3">
                                {[5, 4, 3, 2, 1].map((item) => {
                                    const count = ratingCounts[item];
                                    const percent = ratingPercent(count, total);
                                    return (
                                        <div key={item} className="flex items-center gap-2 text-[10px]">
                                            <span className="w-3">{item}</span>
                                            <div className="h-1 flex-1 rounded-full bg-[#e8e8e8]">
                                                <div className="h-1 rounded-full bg-[#f0c600]" style={{ width: `${percent}%` }} />
                                            </div>
                                            <span className="w-7 text-right">{percent}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="mb-3 text-[16px] font-bold">Review summary</h2>
                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <div className="flex flex-wrap gap-2">
                                {[
                                    ["Quality ★4.8", "bg-[#eaf9ef] text-[#20ae62]"],
                                    ["Delivery speed ★4.7", "bg-[#eaf9ef] text-[#20ae62]"],
                                    ["Sizing accuracy ★4.4", "bg-[#eaf3ff] text-[#1682e9]"],
                                    ["Packaging ★3.8", "bg-[#fff0ef] text-[#ef6f6f]"],
                                    ["Color accuracy ★3.6", "bg-[#fff0ef] text-[#ef6f6f]"],
                                ].map(([label, styles]) => (
                                    <span key={label} className={classNames("rounded-full px-3 py-1.5 text-[9px] font-semibold", styles)}>
                                        {label}
                                    </span>
                                ))}
                            </div>
                            <div className="my-4 border-t border-black/10" />
                            <p className="text-[10px] font-semibold">Common feedback themes</p>
                            <p className="mt-2 text-[9px] leading-[1.5] text-ink/60">
                                Customers praise fast delivery and fabric quality. Main improvement areas:
                                packaging consistency and colour accuracy in product photos.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>

        </div>
    );
}


function OrdersHeaderActions() {
    return (
        <div className="flex items-center">
            <StoreHeaderActions isOpen onToggle={() => undefined} />
            <button
                type="button"
                className="flex h-9 items-center gap-2 rounded-lg bg-[#0878df] px-4 text-xs font-semibold text-white hover:bg-[#066bc7]"
            >
                <Download size={14} />
                Export
            </button>
        </div>
    );
}

export default function StoreScreen() {
    const { setExtraCrumbs, setPageAction } = useOutletContext<DashboardOutletContext>();
    const { storeId = "store-1" } = useParams<{ storeId?: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [isStoreOpen, setIsStoreOpen] = useState(true);

    const basePath = `/admin-dashboard/store/${storeId}`;
    const path = location.pathname.replace(/\/$/, "");
    const isList = path === "/admin-dashboard/store";
    const view: StoreView = isList
        ? "list"
        : path.endsWith("/orders")
            ? "orders"
            : path.endsWith("/skus")
                ? "skus"
                : path.endsWith("/reviews")
                    ? "reviews"
                    : "details";

    useEffect(() => {
        if (view === "list") {
            setExtraCrumbs([{ label: "Store" }]);
            setPageAction(<StoreHeaderActions />);
        } else if (view === "details") {
            setExtraCrumbs([
                { label: "Store", to: "/admin-dashboard/store" },
                { label: "Nike – Bandra details" },
            ]);
            setPageAction(
                <StoreHeaderActions
                    showEmail
                    isOpen={isStoreOpen}
                    onToggle={() => setIsStoreOpen((current) => !current)}
                />,
            );
        } else if (view === "orders") {
            setExtraCrumbs([
                { label: "Store", to: "/admin-dashboard/store" },
                { label: "Nike – Bandra details", to: basePath },
                { label: "Orders" },
            ]);
            setPageAction(<OrdersHeaderActions />);
        } else if (view === "skus") {
            setExtraCrumbs([
                { label: "Store", to: "/admin-dashboard/store" },
                { label: "Nike – Bandra details", to: basePath },
                { label: "SKUS" },
            ]);
            setPageAction(
                <StoreHeaderActions
                    
                    isOpen={isStoreOpen}
                    //onToggle={() => setIsStoreOpen((current) => !current)}
                />,
            );
        } else {
            setExtraCrumbs([
                { label: "Store", to: "/admin-dashboard/store" },
                { label: "Nike – Bandra details", to: basePath },
                { label: "Customer reviews" },
            ]);
            setPageAction(
                <StoreHeaderActions
                    showEmail
                    isOpen={isStoreOpen}
                    onToggle={() => setIsStoreOpen((current) => !current)}
                />,
            );
        }

        return () => {
            setPageAction(null);
        };
    }, [basePath, isStoreOpen, setExtraCrumbs, setPageAction, view]);

    const openDetails = (store: StoreItem) => {
        navigate(`/admin-dashboard/store/${store.id}`);
    };

    return (
        <div className="pb-8">
            {view === "list" && <StoreListView onDetails={openDetails} />}
            {view === "details" && (
                <StoreDetailsView
                    onOrders={() => navigate(`${basePath}/orders`)}
                    onReviews={() => navigate(`${basePath}/reviews`)}
                    onSkus={() => navigate(`${basePath}/skus`)}
                />
            )}
            {view === "orders" && <OrdersView />}
            {view === "reviews" && <ReviewsView />}
            {view === "skus" && <SkusScreen />}
        </div>
    );
}
