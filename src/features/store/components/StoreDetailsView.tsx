import type { ReactNode } from "react";
import {
  BriefcaseBusiness,
  Check,
  Clock3,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useStoreDetails } from "../hooks";
import { formatCurrency } from "../utils/store.utils";
import { Dropdown, classNames } from "./StoreCommon";
import CommonTable from "../../../shared/components/common/CommonTable";

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
        <div
          className={classNames(
            "mb-3 flex h-9 w-9 items-center justify-center rounded-full",
            iconClass,
          )}
        >
          {icon}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-ink/65">{label}</span>
          <span className="text-[18px] font-bold tracking-tight text-ink">
            {value}
          </span>
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

export function StoreDetailsView({
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
    return (
      <div className="rounded-xl bg-white p-10 text-sm text-ink/50">
        Loading store details...
      </div>
    );
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
                  <button
                    type="button"
                    className="font-semibold text-blue-600 underline"
                  >
                    Location
                  </button>
                </p>
                <p className="mt-1 flex items-center gap-2 text-[10px] text-ink/55">
                  <Clock3 size={12} />
                  {details.hours}
                </p>
              </div>
              <div className="text-[11px] text-ink/75">
                <p className="flex items-center gap-2">
                  <Mail size={13} /> {details.email}
                </p>
                <p className="mt-2 flex items-center gap-2">
                  <Phone size={13} /> {details.phone}
                </p>
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
              <BarChart
                data={sales}
                margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
              >
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
                  tickFormatter={(value) =>
                    value === 0
                      ? "0"
                      : value >= 1000
                        ? `${value / 1000}k`
                        : String(value)
                  }
                />
                <Tooltip
                  formatter={(value) => [
                    formatCurrency(Number(value)),
                    "Revenue",
                  ]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #eee",
                    fontSize: 11,
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#1983e8"
                  radius={[5, 5, 0, 0]}
                  barSize={10}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-end gap-4 text-[10px]">
            <span className="flex items-center gap-1 text-[#22ae62]">
              <TrendingUp size={13} /> Peak starts at 04:30 PM
            </span>
            <span className="flex items-center gap-1 text-[#ef7777]">
              <TrendingDown size={13} /> Peak down at 05:50 PM
            </span>
          </div>
        </div>
      </section>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.7fr_0.9fr]">
        <section>
          <h2 className="mb-3 text-[16px] font-bold">Top products</h2>
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <CommonTable
              headers={["PRODUCT", "UNIT SOLD", "REVENUE", "STOCK"]}
              data={products.map((product) => [
                <div key="product">
                  <p className="text-[11px] font-semibold">{product.name}</p>
                  <p className="text-[9px] text-ink/45">{product.variants}</p>
                </div>,
                product.unitsSold,
                formatCurrency(product.revenue),
                <span
                  key="stock"
                  className={classNames(
                    "font-semibold",
                    product.stock <= 3
                      ? "text-[#f06e6e]"
                      : product.stock <= 10
                        ? "text-[#e4b900]"
                        : "text-[#21b863]",
                  )}
                >
                  {String(product.stock).padStart(2, "0")}
                </span>,
              ])}
              rowKeys={products.map((product) => product.id)}
              minWidth={560}
            />
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
                const percent =
                  details.ratingBreakdown[rating as 1 | 2 | 3 | 4 | 5];
                return (
                  <div
                    key={rating}
                    className="flex items-center gap-2 text-[10px]"
                  >
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
