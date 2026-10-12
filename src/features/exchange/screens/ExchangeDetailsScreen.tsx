import { MapPin, Phone, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import {
  exchangeRows,
  exchangeStores,
  getExchangeDetail,
} from "../data/mockData";
import type { ExchangeRider, ExchangeStatus } from "../types/exchange.types";
import ExchangeItemCard from "../components/ExchangeItemCard";
import ExchangeStatusBanner from "../components/ExchangeStatusBanner";
import {
  AssignRiderModal,
  ConfirmationModal,
  RejectExchangeModal,
  RiderLocationModal,
  SuccessModal,
} from "../components/ExchangeModals";

const riders: ExchangeRider[] = [
  {
    name: "Rajan Kumar",
    phone: "+91 82347 09765",
    rating: "4.6 (116)",
    distance: "1.6 km",
    image: "/reference/riders/avatar.jpg",
  },
  {
    name: "Rajan Kumar",
    phone: "+91 82347 09765",
    rating: "4.6 (116)",
    distance: "2.1 km",
    image: "/reference/riders/avatar.jpg",
  },
  {
    name: "Rajan Kumar",
    phone: "+91 82347 09765",
    rating: "4.6 (116)",
    distance: "2.6 km",
    image: "/reference/riders/avatar.jpg",
  },
];

function StatusPill({ status }: { status: ExchangeStatus }) {
  const classes: Record<ExchangeStatus, string> = {
    New: "bg-[#fff9df] text-[#e9b800]",
    Approved: "bg-[#ecfbf2] text-[#37b86a]",
    Ready: "bg-[#fff0ea] text-[#ef8065]",
    "On the way": "bg-[#f4eaff] text-[#a34be8]",
    Exchanged: "bg-[#eaf4ff] text-[#438fe9]",
    Rejected: "bg-[#fff0f0] text-[#ee7373]",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[9px] ${classes[status]}`}
    >
      {status}
    </span>
  );
}

export default function ExchangeDetailsScreen({
  customerContext = false,
}: {
  customerContext?: boolean;
}) {
  const params = useParams<{
    exchangeId?: string;
    orderId?: string;
    storeId?: string;
    customerId?: string;
  }>();
  const exchangeId = params.exchangeId ?? params.orderId ?? "EX-5490";
  const storeId = params.storeId ?? "nike";
  const customerId = params.customerId;
  const location = useLocation();
  const navigate = useNavigate();
  const routeState =
    (location.state as {
      status?: ExchangeStatus;
      storeName?: string;
      customerName?: string;
    } | null) ?? null;
  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();
  const selectedStore = exchangeStores.find((item) => item.id === storeId);
  const resolvedStoreName =
    routeState?.storeName ?? selectedStore?.name ?? "NIKE";
  const initial = useMemo(
    () => getExchangeDetail(exchangeId, resolvedStoreName),
    [exchangeId, resolvedStoreName],
  );
  const selectedCustomerName =
    routeState?.customerName ?? initial.customer.name;
  const [status, setStatus] = useState<ExchangeStatus>(
    routeState?.status ?? initial.status,
  );
  const [rejectionMessage, setRejectionMessage] = useState(
    initial.rejectionMessage ?? "",
  );
  const [confirm, setConfirm] = useState<"approve" | "reject" | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [assignedRider, setAssignedRider] = useState<ExchangeRider | undefined>(
    initial.rider,
  );

  useEffect(() => {
    setStatus(routeState?.status ?? initial.status);
    setRejectionMessage(initial.rejectionMessage ?? "");
    setAssignedRider(initial.rider);
  }, [initial, routeState?.status]);

  useEffect(() => {
    setExtraCrumbs(
      customerContext
        ? [
            { label: "Customers", to: "/admin-dashboard/customers" },
            {
              label: `${selectedCustomerName} details`,
              to: `/admin-dashboard/customers/${customerId ?? "1"}`,
            },
            { label: `#${exchangeId}`, badge: status },
          ]
        : [
            { label: "Exchange", to: "/admin-dashboard/exchange" },
            {
              label: `${initial.store} exchange`,
              to: `/admin-dashboard/exchange/${storeId ?? "nike"}`,
            },
            { label: `#${exchangeId}`, badge: status },
          ],
    );
    return () => setExtraCrumbs([]);
  }, [
    customerContext,
    customerId,
    exchangeId,
    initial.store,
    selectedCustomerName,
    setExtraCrumbs,
    status,
    storeId,
  ]);

  useEffect(() => {
    const action =
      status === "New" ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRejectOpen(true)}
            className="h-9 rounded-md bg-[#ed7373] px-5 text-[11px] font-semibold text-white"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => setConfirm("approve")}
            className="h-9 rounded-md bg-[#39be69] px-5 text-[11px] font-semibold text-white"
          >
            Approve
          </button>
        </div>
      ) : status === "Ready" ? (
        <button
          type="button"
          onClick={() => setAssignOpen(true)}
          className="h-9 rounded-md bg-[#805b42] px-5 text-[11px] font-semibold text-white"
        >
          Assign rider
        </button>
      ) : null;
    setPageAction(action);
    return () => setPageAction(null);
  }, [setPageAction, status]);

  const detail = { ...initial, status, rejectionMessage, rider: assignedRider };

  const confirmApprove = () => {
    setConfirm(null);
    setStatus("Approved");
    setSuccess("Exchange approved successfully.");
  };
  const confirmReject = () => {
    setConfirm(null);
    setStatus("Rejected");
    setRejectionMessage("Exchange rejected by admin.");
    setSuccess("Exchange rejected successfully.");
  };
  const confirmRejectWithMessage = (message: string) => {
    setRejectOpen(false);
    setStatus("Rejected");
    setRejectionMessage(message);
    setSuccess("Exchange rejected successfully.");
  };
  const assign = (rider: ExchangeRider) => {
    setAssignOpen(false);
    setAssignedRider(rider);
    setStatus("On the way");
    setSuccess(`${rider.name} has been assigned for #DD-5428!`);
  };

  return (
    <div className="min-w-0">
      {/* <div className="mb-2 flex items-center gap-2 text-[16px] font-semibold">
        <span>Exchange</span>
        <span className="text-ink/45">›</span>
        <span>{detail.store} exchange</span>
        <span className="text-ink/45">›</span>
        <span>{detail.id}</span>
        <StatusPill status={status} />
      </div> */}

      {status === "Rejected" && (
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[12px] font-semibold">Rejection message</h2>
            <span className="text-[10px] text-ink/55">
              Rejected: {initial.rejectedAt ?? "20th Apr, 12:35 PM"}
            </span>
          </div>
          <div className="rounded-xl bg-white p-4 text-[11px]">
            {rejectionMessage}
          </div>
        </div>
      )}

      <ExchangeStatusBanner
        status={status}
        onTrack={() => setTrackOpen(true)}
      />

      {status === "On the way" && (
        <section className="mb-4">
          <h2 className="mb-2 text-[12px] font-semibold">Delivery status</h2>
          <div className="relative h-[275px] overflow-hidden rounded-xl bg-white">
            <iframe
              title="Exchange delivery map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=72.8100%2C19.0550%2C72.8750%2C19.0950&layer=mapnik&marker=19.0750%2C72.8420"
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
            />
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 1000 275"
              preserveAspectRatio="none"
            >
              <path
                d="M245 70 C280 105 280 165 350 188 S530 190 660 210"
                fill="none"
                stroke="#ef4b42"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
            <div className="pointer-events-none absolute left-[22%] top-[12%] flex h-16 w-16 items-center justify-center rounded-full bg-[#ef4537] text-2xl text-white shadow-lg">
              ▣
            </div>
            <div className="pointer-events-none absolute right-[22%] top-[53%] flex h-14 w-14 items-center justify-center rounded-full bg-[#5fc94d] text-2xl text-white shadow-lg">
              ▣
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-white px-6 py-3 shadow-lg text-[10px] text-ink/60">
              ◷ ETA <b className="ml-24 text-ink">{detail.eta ?? "12:30 PM"}</b>
            </div>
          </div>
        </section>
      )}

      {status === "Exchanged" ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <section>
            <h2 className="mb-2 text-[12px] font-semibold">Previous item</h2>
            <ExchangeItemCard item={detail.item} />
          </section>
          <section>
            <h2 className="mb-2 text-[12px] font-semibold">Exchanged item</h2>
            <ExchangeItemCard item={detail.exchangedItem} />
          </section>
          <CustomerCard detail={detail} />
          <RiderCard rider={assignedRider} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 mb-4">
            <InfoBox label="Exchange with" value={detail.exchangeWith} />
            <InfoBox label="Reason" value={detail.reason} />
          </div>
          {status === "New" ||
          status === "Approved" ||
          status === "Rejected" ? (
            <CustomerDetailsWide detail={detail} />
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <div>
                <h2 className="mb-2 text-[12px] font-semibold">Item</h2>
                <ExchangeItemCard item={detail.item} />
              </div>
              <div>
                <h2 className="mb-2 text-[12px] font-semibold">
                  Customer details
                </h2>
                <CustomerCard detail={detail} />
              </div>
            </div>
          )}
          {status === "On the way" && (
            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
              <div>
                <h2 className="mb-2 text-[12px] font-semibold">
                  Rider details
                </h2>
                <RiderCard rider={assignedRider} />
              </div>
              <div>
                <h2 className="mb-2 text-[12px] font-semibold">Item</h2>
                <ExchangeItemCard item={detail.item} />
              </div>
            </div>
          )}
        </>
      )}

      {customerContext && (
        <button
          type="button"
          onClick={() =>
            navigate(`/admin-dashboard/customers/${customerId ?? "1"}`)
          }
          className="mt-5 text-[10px] text-blue-600 underline"
        >
          Back to customer details
        </button>
      )}

      <ConfirmationModal
        open={confirm === "approve"}
        title="Approve exchange order"
        message="Are you sure you want to approve this exchange request? The customer and vendor will be notified."
        confirmLabel="Confirm approval"
        onClose={() => setConfirm(null)}
        onConfirm={confirmApprove}
      />
      <ConfirmationModal
        open={confirm === "reject"}
        title="Reject exchange order"
        message="Are you sure you want to reject this exchange request?"
        confirmLabel="Confirm rejection"
        tone="red"
        onClose={() => setConfirm(null)}
        onConfirm={confirmReject}
      />
      <RejectExchangeModal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={confirmRejectWithMessage}
      />
      <AssignRiderModal
        open={assignOpen}
        riders={riders}
        onClose={() => setAssignOpen(false)}
        onConfirm={assign}
      />
      <RiderLocationModal
        open={trackOpen}
        eta={detail.eta}
        onClose={() => setTrackOpen(false)}
      />
      <SuccessModal
        open={Boolean(success)}
        title=""
        message={success ?? ""}
        onClose={() => setSuccess(null)}
      />
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h2 className="mb-2 text-[12px] font-semibold">{label}</h2>
      <div className="rounded-xl bg-white p-4 text-[12px] font-semibold">
        {value}
      </div>
    </div>
  );
}

function CustomerDetailsWide({
  detail,
}: {
  detail: ReturnType<typeof getExchangeDetail>;
}) {
  return (
    <div className="mb-4">
      <h2 className="mb-2 text-[12px] font-semibold">Customer details</h2>
      <div className="flex flex-wrap items-center gap-7 rounded-xl bg-white p-5">
        <img
          src="/reference/riders/customer.jpg"
          alt=""
          className="h-16 w-16 rounded-full object-cover"
        />
        <Person label="Full Name" value={detail.customer.name} />
        <Person label="Email" value={detail.customer.email} />
        <Person label="Mobile No:" value={detail.customer.mobile} />
        <Person label="Age/Gender:" value={detail.customer.ageGender} />
        <Person label="City/State:" value={detail.customer.cityState} />
      </div>
      <div className="mt-4">
        <h2 className="mb-2 text-[12px] font-semibold">Item</h2>
        <div className="max-w-[590px]">
          <ExchangeItemCard item={detail.item} />
        </div>
      </div>
    </div>
  );
}
function Person({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[150px]">
      <p className="text-[9px] text-ink/45">{label}</p>
      <p className="mt-1 text-[11px] font-semibold">{value}</p>
    </div>
  );
}
function CustomerCard({
  detail,
}: {
  detail: ReturnType<typeof getExchangeDetail>;
}) {
  return (
    <div>
      <div className="rounded-xl bg-white p-4">
        <div className="flex items-center gap-3">
          <img
            src="/reference/riders/customer.jpg"
            alt=""
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <b className="text-[14px]">{detail.customer.name}</b>
            <span className="ml-1 text-[10px] text-ink/50">
              ({detail.customer.ageGender.toLowerCase()})
            </span>
          </div>
        </div>
        <div className="mt-3 border-t border-black/10 pt-3 text-[10px] text-ink/65">
          <MapPin size={12} className="mr-1 inline" />
          {detail.customer.address}
        </div>
      </div>
    </div>
  );
}
function RiderCard({ rider }: { rider?: ExchangeRider }) {
  return (
    <div>
      <div className="rounded-xl bg-white p-4">
        <div className="flex items-center gap-3">
          {rider ? (
            <img
              src={rider.image}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-[#f3f1ef]" />
          )}
          <div>
            <b className="text-[14px]">{rider?.name ?? "No rider assigned"}</b>
            {rider && (
              <div className="mt-1 text-[10px] text-ink/65">
                <Phone size={11} className="mr-1 inline" />
                {rider.phone}
                <span className="ml-4">
                  <Star size={11} className="mr-1 inline" />
                  {rider.rating}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
