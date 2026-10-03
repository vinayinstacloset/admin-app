import "../styles/riders.css";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Info,
  X,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { useRiderDeliveries, useRiderDetails } from "../hooks/useRiders";
import {
  earningData,
  type Delivery,
  type RiderProfile,
} from "../data/mockData";
import DeliveryTable from "../components/DeliveryTable";
import TrackingModal from "../components/TrackingModal";

const DELIVERY_PAGE_SIZE = 4;

export default function RiderDetailsScreen() {
  const { riderId } = useParams();
  const navigate = useNavigate();

  const { rider, isLoading } = useRiderDetails(riderId);
  const { today, completed } = useRiderDeliveries();

  const { setExtraCrumbs, setPageAction } =
    useDashboardOutletContext();

  const [showMore, setShowMore] = useState(false);
  const [tab, setTab] = useState<"today" | "completed">("today");
  const [sort, setSort] = useState("Newest first");
  const [sortOpen, setSortOpen] = useState(false);
  const [track, setTrack] = useState<Delivery | null>(null);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!rider) return;

    const riderDetailsLabel = (
      <button
        type="button"
        className="rider-breadcrumb-link"
        onClick={() => setShowMore(false)}
      >
        {rider.name} details
      </button>
    );

    if (showMore) {
      setExtraCrumbs([
        {
          label: "Riders",
          to: "/admin-dashboard/riders",
        },
        {
          label: riderDetailsLabel,
        },
        {
          label: "More details",
        },
      ]);
    } else {
      setExtraCrumbs([
        {
          label: "Riders",
          to: "/admin-dashboard/riders",
        },
        {
          label: `${rider.name} details`,
        },
      ]);
    }

    setPageAction(
      <div className="rider-detail-actions">
        <span className="online-pill">Online</span>

        <button
          type="button"
          className="suspend-btn"
          onClick={() => setSuspendOpen(true)}
        >
          Suspend ⊘
        </button>
      </div>,
    );

    return () => {
      setExtraCrumbs([]);
      setPageAction(null);
    };
  }, [
    rider,
    showMore,
    setExtraCrumbs,
    setPageAction,
  ]);

  useEffect(() => {
    setPage(1);
  }, [tab, sort]);

  const source = tab === "today" ? today : completed;

  const deliveries = useMemo(
    () =>
      [...source].sort((a, b) =>
        sort === "Newest first"
          ? b.id.localeCompare(a.id)
          : a.id.localeCompare(b.id),
      ),
    [source, sort],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(
      deliveries.length / DELIVERY_PAGE_SIZE,
    ),
  );

  const currentPage = Math.min(page, totalPages);

  const visible = deliveries.slice(
    (currentPage - 1) * DELIVERY_PAGE_SIZE,
    currentPage * DELIVERY_PAGE_SIZE,
  );

  if (isLoading || !rider) {
    return (
      <div className="rider-loading">
        Loading rider details…
      </div>
    );
  }

  return (
    <div className="rider-detail-page">
      {!showMore ? (
        <Overview
          rider={rider}
          onMore={() => setShowMore(true)}
        />
      ) : (
        <MoreDetails
          rider={rider}
          onBack={() => setShowMore(false)}
        />
      )}

      {!showMore && (
        <section className="delivery-section">
          <div className="delivery-tabs">
            <button
              type="button"
              className={
                tab === "today" ? "active" : ""
              }
              onClick={() => setTab("today")}
            >
              TODAY DELIVERIES
            </button>

            <button
              type="button"
              className={
                tab === "completed" ? "active" : ""
              }
              onClick={() => setTab("completed")}
            >
              COMPLETED DELIVERIES
            </button>
          </div>

          <div className="delivery-heading">
            <h2>Delivery - {source.length}</h2>

            <div className="delivery-toolbar">
              <button
                className="icon-only"
                type="button"
              >
                <Filter size={15} />
              </button>

              <div className="rider-custom-dropdown delivery-sort-dropdown">
                <button
                  type="button"
                  onClick={() =>
                    setSortOpen((open) => !open)
                  }
                >
                  <span>{sort}</span>

                  <ChevronDown
                    size={12}
                    className={
                      sortOpen ? "rotate" : ""
                    }
                  />
                </button>

                {sortOpen && (
                  <div className="rider-dropdown-menu">
                    {[
                      "Newest first",
                      "Oldest first",
                    ].map((option) => (
                      <button
                        type="button"
                        key={option}
                        className={
                          option === sort
                            ? "selected"
                            : ""
                        }
                        onClick={() => {
                          setSort(option);
                          setSortOpen(false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DeliveryTable
            items={visible}
            onTrack={setTrack}
            onView={(item) =>
              navigate(
                `/admin-dashboard/riders/${riderId}/orders/${item.id}`,
              )
            }
          />

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPage={setPage}
          />
        </section>
      )}

      <TrackingModal
        open={Boolean(track)}
        orderId={track?.id ?? ""}
        onClose={() => setTrack(null)}
      />

      <SuspendModal
        open={suspendOpen}
        name={rider.name}
        reason={suspendReason}
        onReasonChange={setSuspendReason}
        onClose={() => {
          setSuspendOpen(false);
          setSuspendReason("");
        }}
        onConfirm={() => {
          setSuspendOpen(false);
          setSuspendReason("");
        }}
      />
    </div>
  );
}

function Overview({
  rider,
  onMore,
}: {
  rider: RiderProfile;
  onMore: () => void;
}) {
  return (
    <div>
      <div className="rider-stats">
        {rider.stats.map((s) => (
          <div
            className={`rider-stat ${s.tone}`}
            key={s.label}
          >
            <div className="stat-icon">
              {s.icon === "Star"
                ? "★"
                : s.icon === "Wallet"
                  ? "♙"
                  : s.icon === "Truck"
                    ? "▣"
                    : s.icon === "ClipboardCheck"
                      ? "▣"
                      : "−"}
            </div>

            <span>{s.label}: </span>
            <b>{s.value}</b>
          </div>
        ))}
      </div>

      <section className="rider-section">
        <div className="section-title-row">
          <h2>Personal details</h2>

          <button
            type="button"
            onClick={onMore}
          >
            More details
          </button>
        </div>

        <div className="personal-card">
          <img src={rider.avatar} alt="" />

          <Field
            label="Full Name"
            value={rider.name}
          />

          <Field
            label="Email"
            value={rider.email}
          />

          <Field
            label="Mobile No"
            value={rider.phone}
          />

          <Field
            label="Age/Gender"
            value={rider.ageGender}
          />

          <Field
            label="City/State"
            value={rider.city}
          />
        </div>
      </section>

      <section className="rider-section earning">
        <div className="section-title-row">
          <h2>
            Earning <span>– Last 12 days</span>
          </h2>

          <button
            type="button"
            className="download-btn"
          >
            <Download size={14} />
          </button>
        </div>

        <EarningChart />
      </section>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="detail-field">
      <small>{label}:</small>
      <b>{value}</b>
    </div>
  );
}

function EarningChart() {
  const max = 1600;

  return (
    <div className="earning-chart">
      <div className="y-axis">
        <span>₹</span>
        <span>1.5k+</span>
        <span>1.2k-1.5k</span>
        <span>900</span>
        <span>600</span>
        <span>300</span>
        <span>0</span>
      </div>

      <div className="chart-area">
        <div className="bars">
          {earningData.map(([day, value]) => (
            <div
              className="bar-group"
              key={day}
            >
              <div
                className="bar"
                style={{
                  height: `${Math.max(
                    12,
                    (value / max) * 170,
                  )}px`,
                }}
              />

              <span>{day}</span>
            </div>
          ))}
        </div>

        <div className="chart-nav">
          <button type="button">
            <ChevronLeft size={14} />
          </button>

          <button type="button">
            <ChevronRight size={14} />
          </button>

          <span>
            <CalendarDays size={13} /> Dates
          </span>
        </div>
      </div>
    </div>
  );
}

function MoreDetails({
  rider,
  onBack,
}: {
  rider: RiderProfile;
  onBack: () => void;
}) {
  return (
    <div className="more-details-page">
      
      <section className="rider-section">
        <h2>Personal details</h2>

        <div className="personal-card">
          <img src={rider.avatar} alt="" />

          <Field
            label="Full Name"
            value={rider.name}
          />

          <Field
            label="Email"
            value={rider.email}
          />

          <Field
            label="Mobile No"
            value={rider.phone}
          />

          <Field
            label="Age/Gender"
            value={rider.ageGender}
          />

          <Field
            label="City/State"
            value={rider.city}
          />
        </div>
      </section>

      <section className="rider-section">
        <h2>Vehicle details</h2>

        <div className="vehicle-card">
          <img
            src={rider.vehicle.image}
            alt=""
          />

          <Field
            label="Vehicle Name"
            value={rider.vehicle.name}
          />

          <Field
            label="Color"
            value={rider.vehicle.color}
          />

          <Field
            label="Purchased On"
            value={rider.vehicle.purchasedOn}
          />

          <Field
            label="Vehicle Number"
            value={rider.vehicle.number}
          />

          <Field
            label="Model Year"
            value={rider.vehicle.year}
          />
        </div>
      </section>

      <section className="rider-section">
        <h2>Document details</h2>

        <div className="documents-grid">
          {rider.documents.map((d) => (
            <div
              className="document-card"
              key={d.label}
            >
              <img
                src={d.image}
                alt={d.label}
              />

              <b>{d.label}</b>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
}) {
  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  ).slice(0, 3);

  return (
    <div className="detail-pagination">
      <button
        type="button"
        disabled={page === 1}
        onClick={() =>
          onPage(Math.max(1, page - 1))
        }
      >
        ‹
      </button>

      {pages.map((item) => (
        <button
          type="button"
          key={item}
          className={
            page === item ? "active" : ""
          }
          onClick={() => onPage(item)}
        >
          {item}
        </button>
      ))}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() =>
          onPage(
            Math.min(totalPages, page + 1),
          )
        }
      >
        ›
      </button>
    </div>
  );
}

function SuspendModal({
  open,
  name,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
}: {
  open: boolean;
  name: string;
  reason: string;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="rider-modal-backdrop"
      onMouseDown={onClose}
    >
      <div
        className="suspend-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="suspend-title">
          <b>Suspend “{name}”</b>

          <button
            type="button"
            onClick={onClose}
          >
            <X size={17} />
          </button>
        </div>

        <label>Suspend reason</label>

        <textarea
          value={reason}
          onChange={(event) =>
            onReasonChange(event.target.value)
          }
          placeholder="Write your reason of suspend to vendor..."
        />

        <p>
          <Info size={13} /> This message will be sent
          to the rider
        </p>

        <div className="suspend-actions">
          <button
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!reason.trim()}
            onClick={onConfirm}
          >
            Suspend
          </button>
        </div>
      </div>
    </div>
  );
}