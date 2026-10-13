import CommonTable from "../../../shared/components/common/CommonTable";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  BriefcaseBusiness,
  Boxes,
  CheckCircle2,
  Clock3,
  Download,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Paperclip,
  Package,
  Phone,
  Send,
  ShoppingBag,
  Star,
  Truck,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import SkusScreen from "../../skus/screens/SkusScreen";
import { OrdersView, ReviewsView } from "../../store/components";
import { formatCurrency } from "../../store/utils/store.utils";
import { useVendorDetails } from "../hooks/useVendorDetails";
import { storeApi } from "../../store/api";
import type { VendorDetail } from "../types/vendor.types";
import {
  buildListingBreadcrumbs,
  VENDOR_CRUMB_LABEL,
} from "../../catalogue/utils/listingBreadcrumbs";

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function VendorHeaderActions({
  isOpen,
  onToggle,
  onExport,
  onSuspend,
  onChat,
  showStore = true,
}: {
  isOpen?: boolean;
  onToggle?: () => void;
  onExport?: () => void;
  onSuspend?: () => void;
  onChat?: () => void;
  showStore?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      {showStore && (
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs font-bold text-ink">Store</p>
            <p className="text-[8px] text-ink/55">Open & Close</p>
          </div>
          <button
            type="button"
            aria-label="Toggle store status"
            onClick={onToggle}
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors",
              isOpen ? "bg-[#20be63]" : "bg-[#ef6b6b]",
            )}
          >
            <span
              className={cn(
                "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all",
                isOpen ? "left-6" : "left-1",
              )}
            />
          </button>
        </div>
      )}
      {onExport && (
        <button
          type="button"
          onClick={onExport}
          className="flex h-8 items-center gap-2 rounded-md bg-[#0878df] px-3 text-[10px] font-semibold text-white"
        >
          Export <Download size={13} />
        </button>
      )}
      {onSuspend && (
        <button
          type="button"
          onClick={onSuspend}
          className="h-8 rounded-md border border-[#ef6f6f] px-3 text-[10px] font-semibold text-[#ef6f6f]"
        >
          Suspend
        </button>
      )}
      {onChat && (
        <button
          type="button"
          onClick={onChat}
          aria-label="Chat"
          className="flex h-8 w-8 items-center justify-center text-ink/80"
        >
          <MessageCircle size={19} />
        </button>
      )}
    </div>
  );
}

function downloadCsv(filename: string, rows: Array<Array<string | number>>) {
  const csv = rows
    .map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportVendorDetails(vendor: VendorDetail) {
  const rows = [
    ["Field", "Value"],
    ["Vendor", vendor.profile.name],
    ["Company", vendor.profile.name],
    ["Email", vendor.profile.email],
    ["Phone", vendor.profile.phone],
    ["Address", vendor.profile.address],
    ["Rating", vendor.profile.rating],
    ["Prep Time", vendor.profile.prepTime],
    ["Free Delivery", vendor.profile.freeDelivery],
    ["Minimum Order", vendor.profile.minOrder],
    [
      "Total Revenue",
      vendor.stats.find((item) => item.label === "Total Revenue")?.value ?? "",
    ],
    [
      "Total Orders",
      vendor.stats.find((item) => item.label === "Total Order")?.value ?? "",
    ],
    [
      "Total SKUs",
      vendor.stats.find((item) => item.label === "Total SKUs")?.value ?? "",
    ],
    [
      "Fulfilment Rate",
      vendor.stats.find((item) => item.label === "Fulfillment rate")?.value ??
        "",
    ],
  ];
  downloadCsv("vendor-details.csv", rows);
}

async function exportVendorOrders() {
  const orders = await storeApi.getOrders();
  const rows = [
    [
      "Order",
      "Items",
      "Customer",
      "Location",
      "Rider",
      "Item",
      "Item Count",
      "Status",
      "Amount",
      "Age",
      "Action",
    ],
    ...orders.map((order) => [
      order.id,
      order.items,
      order.customer,
      order.customerLocation,
      order.rider,
      order.itemSummary,
      order.itemCounts,
      order.status,
      order.amount,
      order.age,
      order.action,
    ]),
  ];
  downloadCsv("vendor-orders.csv", rows);
}

function SuspendModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const canSubmit = reason.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-[360px] rounded-xl bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-ink">Suspend</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-ink/40 hover:text-ink"
          >
            <X size={17} />
          </button>
        </div>
        <p className="mt-1 text-[9px] text-ink/45">Suspend vendor account</p>
        <label className="mt-5 block text-[10px] font-semibold text-ink">
          Suspend reason
        </label>
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          maxLength={300}
          placeholder="Please enter the reason for suspension..."
          className="mt-2 h-[110px] w-full resize-none rounded-md border border-black/10 p-3 text-[11px] outline-none focus:border-[#76533d]"
        />
        <div className="mt-1 text-right text-[8px] text-ink/35">
          {reason.length}/300
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-md border border-black/15 px-4 text-[10px] font-medium text-ink/70"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => onConfirm(reason.trim())}
            className={cn(
              "h-8 rounded-md px-4 text-[10px] font-semibold text-white",
              canSubmit ? "bg-[#76533d]" : "bg-[#d8d2cd]",
            )}
          >
            Suspend
          </button>
        </div>
      </div>
    </div>
  );
}

function PersonalDetails({ vendor }: { vendor: VendorDetail }) {
  return (
    <section className="mb-5">
      <h2 className="mb-3 text-[14px] font-semibold text-ink">
        Personal details
      </h2>
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_365px]">
          <div className="flex items-center gap-5">
            <img
              src="https://i.pravatar.cc/120?img=12"
              alt="Rajesh Kumar"
              className="h-24 w-24 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5 lg:grid-cols-4">
                <Info label="Full Name:" value="Rajesh Kumar" />
                <Info label="Email:" value="rajeshkumar@gmail.com" />
                <Info label="Mobile No:" value="+91 99887 55441" />
                <Info label="City/State:" value="Mumbai/Maharashtra" />
                <Info label="PAN No:" value="AAJPN2313N" />
                <Info label="Member since:" value="21st Jan, 2026" />
                <div className="lg:col-span-2">
                  <Info
                    label="Address:"
                    value="Shimla park, near MM valley, Heena Apartment, Kausa - Mumbai"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-[#f2f0ed] p-3">
            <p className="mb-2 inline-block rounded bg-[#e8e2dc] px-2 py-1 text-[8px] font-medium text-[#76533d]">
              Aadhar card
            </p>
            <div className="grid grid-cols-2 gap-3">
              <img
                src="/mock-documents/id-front.svg"
                alt="Aadhar front"
                className="h-[78px] w-full rounded bg-white object-contain"
              />
              <img
                src="/mock-documents/id-back.svg"
                alt="Aadhar back"
                className="h-[78px] w-full rounded bg-white object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[8px] text-ink/45">{label}</p>
      <p className="mt-1 text-[10px] font-semibold text-ink">{value}</p>
    </div>
  );
}

function StoreOverview({ vendor }: { vendor: VendorDetail }) {
  const [storeOpen, setStoreOpen] = useState(true);
  return (
    <section className="mb-5">
      <h2 className="mb-3 text-[14px] font-semibold text-ink">
        Store overview
      </h2>
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[350px_1fr]">
          <div className="h-[171px] overflow-hidden rounded-lg">
            <img
              src={vendor.profile.cover}
              alt={vendor.profile.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[15px] font-bold text-ink">
                  {vendor.profile.name}{" "}
                  <span className="font-normal italic text-[10px] text-ink/55">
                    {vendor.profile.tagline}
                  </span>
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-[10px] text-ink/75">
                  <MapPin size={12} /> {vendor.profile.address}{" "}
                  <a
                    href="#"
                    className="text-[9px] font-semibold text-blue-600"
                  >
                    Location
                  </a>
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-[9px] text-ink/55">
                  <Clock3 size={11} /> 10:30 AM to 09:00 PM
                </p>
              </div>
              <div className="space-y-3 text-[9px] text-ink/70">
                <p className="flex items-center gap-2">
                  <Mail size={12} /> nikestore@gmail.com
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={12} /> 8259645722
                </p>
              </div>
            </div>
            <div className="my-4 border-t border-black/10" />
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#eaf9ef] px-3 py-1.5 text-[9px] font-semibold text-[#19b75c]">
                ☆ 4.7 (320 ratings)
              </span>
              <span className="rounded-full bg-[#eaf3ff] px-3 py-1.5 text-[9px] font-semibold text-[#1682e9]">
                ◉ 20 min prep
              </span>
              <span className="rounded-full bg-[#fff0ef] px-3 py-1.5 text-[9px] font-semibold text-[#ef6f6f]">
                ♨ Free delivery ₹999+
              </span>
            </div>
          </div>
        </div>
      </div>
      <span className="hidden">{String(storeOpen)}</span>
    </section>
  );
}

function ProductRating({
  vendor,
  onReviews,
}: {
  vendor: VendorDetail;
  onReviews: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.7fr_1fr]">
      <section>
        <h2 className="mb-3 text-[14px] font-semibold">Top store products</h2>
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <CommonTable
            headers={["PRODUCT", "UNIT SOLD", "REVENUE", "STOCK"]}
            data={[
              [
                "Blue Cotton Kurti",
                "Sizes S–XL · 4 Colors",
                "18",
                "₹8,100",
                "56",
                "green",
              ],
              [
                "Palazzo Pants Set",
                "Sizes S–XL · 3 colors",
                "14",
                "₹6,870",
                "09",
                "yellow",
              ],
              [
                "Men's Formal Shirt",
                "Sizes M–XXL · White/Grey",
                "11",
                "₹9,750",
                "03",
                "red",
              ],
              [
                "Denim Jacket",
                "Sizes S–L · Dark blue",
                "9",
                "₹7,650",
                "41",
                "yellow",
              ],
              [
                "Men’s Cotton Shirt",
                "Sizes M–L · White/Blue",
                "8",
                "₹6,920",
                "32",
                "green",
              ],
            ].map(([name, meta, sold, revenue, stock, tone]) => [
              <div key="product">
                <p className="text-[11px]">{name}</p>
                <p className="text-[8px] text-ink/45">{meta}</p>
              </div>,
              sold,
              revenue,
              <span
                key="stock"
                className={
                  tone === "green"
                    ? "font-semibold text-[#19b75c]"
                    : tone === "red"
                      ? "font-semibold text-[#ef6f6f]"
                      : "font-semibold text-[#e3b600]"
                }
              >
                {stock}
              </span>,
            ])}
            minWidth={600}
          />
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-[14px] font-semibold">Store rating</h2>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[28px] font-bold">4.6</span>
              <Star size={17} fill="#f0c600" strokeWidth={0} />
              <span className="text-[9px] text-ink/50">(136 reviews)</span>
            </div>
            <button
              type="button"
              onClick={onReviews}
              className="rounded-md border border-[#76533d] px-3 py-1.5 text-[9px] font-medium text-[#76533d]"
            >
              Customer reviews
            </button>
          </div>
          <div className="mt-5 space-y-3">
            {[
              ["5", 62],
              ["4", 22],
              ["3", 5],
              ["2", 3],
              ["1", 2],
            ].map(([star, pct]) => (
              <div key={star} className="flex items-center gap-2 text-[9px]">
                <span className="w-3">{star}</span>
                <div className="h-1 flex-1 rounded-full bg-[#ececec]">
                  <div
                    className="h-1 rounded-full bg-[#f0c800]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-right">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ChatsScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      side: "left",
      text: "Hi, we are support company. how we can help you sir",
      time: "12:31 pm",
    },
    {
      side: "left",
      text: "Hi, we are support company. how we can help you sir",
      time: "12:31 pm",
    },
    {
      side: "left",
      text: "Please enter your number & details, kindly request you",
      time: "12:32 pm",
    },
    { side: "right", text: "+91 8245982178", time: "12:34 pm" },
    {
      side: "right",
      text: "you should need some rest now. tomorrow we will talk",
      time: "12:34 pm",
    },
  ]);

  const send = () => {
    if (!message.trim()) return;
    setMessages((current) => [
      ...current,
      { side: "right", text: message.trim(), time: "now" },
    ]);
    setMessage("");
  };

  return (
    <div className="pb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[14px] font-semibold">Chats</h2>
        <div className="relative">
          <SearchIcon />
        </div>
      </div>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="flex items-center gap-4 bg-[#f6f0ec] px-7 py-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#0878df] text-[15px] font-semibold text-white">
            RS
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#18c38a]" />
          </div>
          <div>
            <p className="text-[15px] font-semibold">A-1 Fashion</p>
            <p className="text-[11px] text-ink/65">(Rohit Shaurya)</p>
          </div>
        </div>
        <div className="flex h-[520px] flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-7 py-5">
            {messages.map((item, index) => (
              <div
                key={`${item.text}-${index}`}
                className={cn(
                  "flex",
                  item.side === "right" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[50%] rounded-2xl px-6 py-4 text-[14px]",
                    item.side === "right" ? "bg-[#f7f0eb]" : "bg-[#ededeb]",
                  )}
                >
                  <p>{item.text}</p>
                  <p className="mt-3 text-right text-[9px] text-ink/35">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 border-t border-black/5 bg-white px-5 py-3">
            <button type="button" aria-label="Attach" className="text-ink/30">
              <Paperclip size={25} />
            </button>
            <button
              type="button"
              aria-label="Emoji"
              className="text-ink/30 text-xl"
            >
              ☺
            </button>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") send();
              }}
              placeholder="Enter your message.."
              className="h-12 flex-1 rounded-md bg-[#f3f3f2] px-4 text-[12px] font-medium outline-none placeholder:text-ink/30"
            />
            <button
              type="button"
              onClick={send}
              aria-label="Send"
              className="flex h-12 w-20 items-center justify-center rounded-md bg-[#d8d8d8] text-white"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <div className="absolute right-0 top-[-3px] w-[275px]">
      <input
        placeholder="Search vendor, company name for chat"
        className="h-9 w-full rounded-md bg-white px-3 text-[10px] outline-none"
      />
    </div>
  );
}

export default function VendorDetailsScreen() {
  const {
    vendorId = "1",
    gender,
    categoryId,
  } = useParams<{ vendorId: string; gender?: string; categoryId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { vendor, isLoading, error } = useVendorDetails(vendorId);
  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();
  const [isOpen, setIsOpen] = useState(true);
  const [showSuspend, setShowSuspend] = useState(false);
  const [suspended, setSuspended] = useState(false);
  const detail = vendor;

  const subView = useMemo(() => {
    if (location.pathname.endsWith("/orders")) return "orders";
    if (location.pathname.includes("/skus")) return "skus";
    if (location.pathname.endsWith("/chats")) return "chats";
    if (location.pathname.endsWith("/reviews")) return "reviews";
    return "details";
  }, [location.pathname]);

  // SKUS breadcrumbs: Vendor > vendor name > SKUS (> Men > Topwear on the listing).
  // Kept in its own effect so they are restored when coming back from the listing.
  useEffect(() => {
    if (subView !== "skus") return;
    const base = `/admin-dashboard/vendor/${vendorId}`;
    setExtraCrumbs(
      categoryId
        ? buildListingBreadcrumbs({
            context: "vendor",
            ownerId: vendorId,
            gender,
            categoryId,
          })
        : [
            { label: "Vendor", to: "/admin-dashboard/vendor" },
            { label: VENDOR_CRUMB_LABEL, to: base },
            { label: "SKUS", to: `${base}/skus` },
          ],
    );
  }, [
    categoryId,
    detail,
    gender,
    isOpen,
    navigate,
    setExtraCrumbs,
    subView,
    vendorId,
  ]);

  useEffect(() => {
    const base = `/admin-dashboard/vendor/${vendorId}`;
    if (subView === "orders") {
      setExtraCrumbs([
        { label: "Vendor", to: "/admin-dashboard/vendor" },
        { label: "Rajesh Kumar details", to: base },
        { label: "Total Orders" },
      ]);
      setPageAction(
        <div className="flex items-center gap-4">
          <VendorHeaderActions
            showStore
            onToggle={() => setIsOpen((value) => !value)}
            isOpen={isOpen}
          />
          <button
            type="button"
            onClick={exportVendorOrders}
            className="flex h-8 items-center gap-2 rounded-md bg-[#0878df] px-3 text-[10px] font-semibold text-white"
          >
            Export <Download size={13} />
          </button>
        </div>,
      );
    } else if (subView === "skus") {
      // Breadcrumbs for SKUS (grid + listing) are set by the effect below.
      setPageAction(
        <VendorHeaderActions
          showStore
          onToggle={() => setIsOpen((value) => !value)}
          isOpen={isOpen}
        />,
      );
    } else if (subView === "reviews") {
      setExtraCrumbs([
        { label: "Vendor", to: "/admin-dashboard/vendor" },
        { label: "Rajesh Kumar details", to: base },
        { label: "Customer reviews" },
      ]);
      setPageAction(
        <VendorHeaderActions
          showStore
          onToggle={() => setIsOpen((value) => !value)}
          isOpen={isOpen}
        />,
      );
    } else if (subView === "chats") {
      setExtraCrumbs([
        { label: "Vendor", to: "/admin-dashboard/vendor" },
        { label: "Rajesh Kumar details", to: base },
        { label: "Chats" },
      ]);
      setPageAction(
        <VendorHeaderActions onSuspend={() => setShowSuspend(true)} />,
      );
    } else {
      setExtraCrumbs([
        { label: "Vendor", to: "/admin-dashboard/vendor" },
        { label: "Rajesh Kumar details" },
      ]);
      setPageAction(
        <VendorHeaderActions
          isOpen={isOpen}
          onToggle={() => setIsOpen((value) => !value)}
          onExport={() => detail && exportVendorDetails(detail)}
          onSuspend={() => setShowSuspend(true)}
          onChat={() => navigate(`${base}/chats`)}
        />,
      );
    }

    return () => {
      setPageAction(null);
      setExtraCrumbs([]);
    };
  }, [
    detail,
    isOpen,
    navigate,
    setExtraCrumbs,
    setPageAction,
    subView,
    vendorId,
  ]);

  if (isLoading || !vendor) {
    return (
      <div className="rounded-xl bg-white p-10 text-sm text-ink/50">
        Loading vendor details...
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="pb-8">
      {subView === "details" ? (
        <>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
            <Stat
              icon={<WalletCards size={17} />}
              tone="green"
              label="Total Revenue:"
              value="₹41,85,450"
            />
            <Stat
              icon={<ShoppingBag size={17} />}
              tone="yellow"
              label="Total Order:"
              value="4,240"
              onClick={() =>
                navigate(`/admin-dashboard/vendor/${vendorId}/orders`)
              }
            />
            <Stat
              icon={<Boxes size={17} />}
              tone="blue"
              label="Total SKUS:"
              value="840"
              onClick={() =>
                navigate(`/admin-dashboard/vendor/${vendorId}/skus`)
              }
            />
            <Stat
              icon={<CheckCircle2 size={17} />}
              tone="green"
              label="Fulfilment rate:"
              value="95.8%"
            />
          </div>
          <PersonalDetails vendor={detail} />
          <StoreOverview vendor={detail} />
          <ProductRating
            vendor={detail}
            onReviews={() =>
              navigate(`/admin-dashboard/vendor/${vendorId}/reviews`)
            }
          />
          {showSuspend && (
            <SuspendModal
              onClose={() => setShowSuspend(false)}
              onConfirm={() => {
                setSuspended(true);
                setShowSuspend(false);
              }}
            />
          )}
          <span className="hidden">{String(suspended)}</span>
        </>
      ) : subView === "orders" ? (
        <OrdersView
          showTitle={false}
          source={{
            label: "Total Orders",
            to: `/admin-dashboard/vendor/${vendorId}/orders`,
            parentLabel: "Rajesh Kumar details",
            parentTo: `/admin-dashboard/vendor/${vendorId}`,
            rootLabel: "Vendor",
            rootTo: "/admin-dashboard/vendor",
          }}
        />
      ) : subView === "skus" ? (
        <SkusScreen />
      ) : subView === "reviews" ? (
        <ReviewsView
          backTo={`/admin-dashboard/vendor/${vendorId}`}
          backLabel="Back to vendor details"
        />
      ) : (
        <ChatsScreen />
      )}
    </div>
  );
}

function Stat({
  icon,
  tone,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  tone: "green" | "yellow" | "blue";
  label: string;
  value: string;
  onClick?: () => void;
}) {
  const toneClass =
    tone === "green"
      ? "bg-[#eaf9ef] text-[#20bd67]"
      : tone === "yellow"
        ? "bg-[#fff9dc] text-[#e3c600]"
        : "bg-[#eaf3ff] text-[#1682e9]";
  return (
    <div className="flex min-h-[100px] items-end justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
      <div>
        <div
          className={cn(
            "mb-3 flex h-9 w-9 items-center justify-center rounded-full",
            toneClass,
          )}
        >
          {icon}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-ink/70">{label}</span>
          <span className="text-[20px] font-bold">{value}</span>
        </div>
      </div>
      {onClick && (
        <button
          type="button"
          onClick={onClick}
          className="text-[10px] font-semibold text-blue-600"
        >
          View ›
        </button>
      )}
    </div>
  );
}
