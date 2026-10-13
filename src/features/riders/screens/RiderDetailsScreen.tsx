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
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";
import { hoverStyle } from "../../../shared/utils/interactiveStyle";

const DELIVERY_PAGE_SIZE = 4;

const STAT_TONES: Record<string, { background: string; color: string }> = {
  green: { background: "#e4f8ec", color: "#2bbd69" },
  orange: { background: "#fff0e9", color: "#ff683f" },
  blue: { background: "#e8f2ff", color: "#2b8ef5" },
  red: { background: "#fff0f0", color: "#ff5b63" },
  yellow: { background: "#fff9dc", color: "#e3c000" },
};

export default function RiderDetailsScreen() {
  const isMax1100 = useMediaQuery("(max-width: 1100px)");
  const { riderId } = useParams();
  const navigate = useNavigate();

  const { rider, isLoading } = useRiderDetails(riderId);
  const { today, completed } = useRiderDeliveries();

  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();

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
      <button type="button" onClick={() => setShowMore(false)}>
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
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            background: "#e7f8ed",
            color: "#1bb65b",
            padding: "7px 17px",
            borderRadius: 16,
            fontSize: 10,
          }}
        >
          Online
        </span>

        <button
          type="button"
          style={{
            background: "#fff",
            border: "1px solid #ff6a6a",
            color: "#ff5a5a",
            borderRadius: 7,
            height: 34,
            padding: "0 13px",
            fontSize: 11,
          }}
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
  }, [rider, showMore, setExtraCrumbs, setPageAction]);

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
    Math.ceil(deliveries.length / DELIVERY_PAGE_SIZE),
  );

  const currentPage = Math.min(page, totalPages);

  const visible = deliveries.slice(
    (currentPage - 1) * DELIVERY_PAGE_SIZE,
    currentPage * DELIVERY_PAGE_SIZE,
  );

  if (isLoading || !rider) {
    return <div>Loading rider details…</div>;
  }

  return (
    <div style={{ color: "#2d2925", paddingTop: 0 }}>
      {!showMore ? (
        <Overview rider={rider} onMore={() => setShowMore(true)} />
      ) : (
        <MoreDetails rider={rider} onBack={() => setShowMore(false)} />
      )}

      {!showMore && (
        <section style={{ marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "12px 0 16px",
            }}
          >
            <button
              type="button"
              style={{
                height: 29,
                padding: "0 13px",
                border:
                  tab === "today" ? "1px solid #8a5a32" : "1px solid #e3e0dd",
                background: tab === "today" ? "#F3EAE2" : "#eee",
                borderRadius: "5px 0 0 5px",
                fontSize: 9,
                fontWeight: 700,
                color: tab === "today" ? "#6b4931" : "#666",
              }}
              onClick={() => setTab("today")}
            >
              TODAY DELIVERIES
            </button>

            <button
              type="button"
              style={{
                height: 29,
                padding: "0 13px",
                border:
                  tab === "completed"
                    ? "1px solid #8a5a32"
                    : "1px solid #e3e0dd",
                background: tab === "completed" ? "#F3EAE2" : "#eee",
                borderRadius: "0 5px 5px 0",
                fontSize: 9,
                fontWeight: 700,
                color: tab === "completed" ? "#6b4931" : "#666",
              }}
              onClick={() => setTab("completed")}
            >
              COMPLETED DELIVERIES
            </button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>
              Delivery - {source.length}
            </h2>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                style={{ border: 0, background: "transparent" }}
                type="button"
              >
                <Filter size={15} />
              </button>

              <div style={{ position: "relative", flex: "0 0 auto" }}>
                <button
                  style={{
                    ...{
                      height: 36,
                      padding: "0 10px",
                      border: 0,
                      borderRadius: 6,
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      fontSize: 10,
                      color: "#37312c",
                      whiteSpace: "nowrap",
                      minWidth: 112,
                    },
                    ...(isMax1100 ? { minWidth: 90, padding: "0 8px" } : {}),
                  }}
                  type="button"
                  onClick={() => setSortOpen((open) => !open)}
                >
                  <span>{sort}</span>

                  <ChevronDown
                    size={12}
                    style={{
                      transition: "transform 0.12s ease",
                      flexShrink: 0,
                      transform: sortOpen ? "rotate(180deg)" : undefined,
                    }}
                  />
                </button>

                {sortOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 40,
                      minWidth: 150,
                      padding: 4,
                      background: "#fff",
                      borderRadius: 6,
                      boxShadow: "0 8px 24px rgba(40, 32, 26, 0.12)",
                      border: "1px solid #eee9e4",
                      zIndex: 100,
                    }}
                  >
                    {["Newest first", "Oldest first"].map((option) => (
                      <button
                        type="button"
                        key={option}
                        style={{
                          ...{
                            display: "block",
                            width: "100%",
                            padding: "9px 10px",
                            border: 0,
                            borderRadius: 4,
                            background: "#fff",
                            textAlign: "left",
                            fontSize: 9,
                            color: "#4c4540",
                          },
                          ...(option === sort
                            ? { background: "#eeeae6", fontWeight: 600 }
                            : {}),
                        }}
                        {...hoverStyle(
                          { background: "#eeeae6", fontWeight: 600 },
                          option === sort
                            ? { background: "#eeeae6", fontWeight: 600 }
                            : { background: "#fff", fontWeight: "" },
                        )}
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
              navigate(`/admin-dashboard/riders/${riderId}/orders/${item.id}`)
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
  const isMax1100 = useMediaQuery("(max-width: 1100px)");
  const isMax760 = useMediaQuery("(max-width: 760px)");
  return (
    <div>
      <div
        style={{
          ...{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 12,
            margin: "6px 0 18px",
          },
          ...(isMax1100 ? { gridTemplateColumns: "repeat(3, 1fr)" } : {}),
          ...(isMax760 ? { gridTemplateColumns: "1fr 1fr" } : {}),
        }}
      >
        {rider.stats.map((s) => (
          <div
            style={{
              height: 84,
              background: "#fff",
              borderRadius: 8,
              display: "flex",
              alignItems: "flex-end",
              padding: "0 13px 18px",
              gap: 4,
              fontSize: 11,
              position: "relative",
              lineHeight: 1,
            }}
            key={s.label}
          >
            <div
              style={{
                position: "absolute",
                left: 13,
                top: 11,
                width: 31,
                height: 31,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                fontSize: 14,
                ...STAT_TONES[s.tone],
              }}
            >
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

            <span
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                fontSize: 11,
                whiteSpace: "nowrap",
              }}
            >
              {s.label}:{" "}
            </span>
            <b
              style={{
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              {s.value}
            </b>
          </div>
        ))}
      </div>

      <section style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>
            Personal details
          </h2>

          <button
            style={{
              background: "transparent",
              border: 0,
              color: "#1472c7",
              fontSize: 9,
              textDecoration: "underline",
            }}
            type="button"
            onClick={onMore}
          >
            More details
          </button>
        </div>

        <div
          style={{
            ...{
              background: "#fff",
              borderRadius: 8,
              padding: "17px 20px",
              display: "grid",
              gridTemplateColumns: "75px repeat(5, 1fr)",
              alignItems: "center",
              gap: 24,
            },
            ...(isMax1100
              ? { gridTemplateColumns: "70px repeat(3, 1fr)" }
              : {}),
            ...(isMax760 ? { gridTemplateColumns: "1fr 1fr" } : {}),
          }}
        >
          <img
            style={{
              ...{
                width: 67,
                height: 67,
                borderRadius: "50%",
                objectFit: "cover",
              },
              ...(isMax760 ? { gridRow: "span 2" } : {}),
            }}
            src={rider.avatar}
            alt=""
          />

          <Field label="Full Name" value={rider.name} />

          <Field label="Email" value={rider.email} />

          <Field label="Mobile No" value={rider.phone} />

          <Field label="Age/Gender" value={rider.ageGender} />

          <Field label="City/State" value={rider.city} />
        </div>
      </section>

      <section style={{ marginBottom: 16, position: "relative" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>
            Earning <span style={{ fontWeight: 400 }}>– Last 12 days</span>
          </h2>

          <button
            type="button"
            style={{
              width: 27,
              height: 27,
              background: "#0878df",
              color: "#fff",
              border: 0,
              borderRadius: 4,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Download size={14} />
          </button>
        </div>

        <EarningChart />
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <small style={{ fontSize: 9, color: "#777" }}>{label}:</small>
      <b style={{ fontSize: 10.5 }}>{value}</b>
    </div>
  );
}

function EarningChart() {
  const max = 1600;

  return (
    <div
      style={{
        height: 275,
        background: "#fff",
        borderRadius: 8,
        padding: "12px 20px",
        display: "flex",
      }}
    >
      <div
        style={{
          width: 70,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontSize: 9,
          color: "#8d8a87",
          padding: "0 0 28px 28px",
        }}
      >
        <span>₹</span>
        <span>1.5k+</span>
        <span>1.2k-1.5k</span>
        <span>900</span>
        <span>600</span>
        <span>300</span>
        <span>0</span>
      </div>

      <div
        style={{
          flex: 1,
          position: "relative",
          borderLeft: "1px solid #bdb8b3",
        }}
      >
        <div
          style={{
            height: 220,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-around",
            padding: "0 14px",
            borderBottom: "1px solid #c9c4bf",
            background:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 35px, #eeeae7 36px)",
          }}
        >
          {earningData.map(([day, value]) => (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                minWidth: 45,
              }}
              key={day}
            >
              <div
                style={{
                  ...{
                    width: 9,
                    borderRadius: "8px 8px 0 0",
                    background:
                      "linear-gradient(to bottom, #ff633a 65%, #bb62ba)",
                    minHeight: 10,
                  },
                  height: `${Math.max(12, (value / max) * 170)}px`,
                }}
              />

              <span
                style={{
                  fontSize: 8,
                  color: "#888",
                  marginTop: 7,
                  whiteSpace: "nowrap",
                }}
              >
                {day}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{ height: 30, display: "flex", alignItems: "center", gap: 8 }}
        >
          <button
            style={{
              width: 20,
              height: 20,
              border: "1px solid #aaa",
              borderRadius: "50%",
              background: "#fff",
              display: "grid",
              placeItems: "center",
            }}
            type="button"
          >
            <ChevronLeft size={14} />
          </button>

          <button
            style={{
              width: 20,
              height: 20,
              border: "1px solid #aaa",
              borderRadius: "50%",
              background: "#fff",
              display: "grid",
              placeItems: "center",
            }}
            type="button"
          >
            <ChevronRight size={14} />
          </button>

          <span
            style={{
              marginLeft: "auto",
              fontSize: 9,
              display: "flex",
              gap: 5,
              alignItems: "center",
            }}
          >
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
  const isMax1100 = useMediaQuery("(max-width: 1100px)");
  const isMax760 = useMediaQuery("(max-width: 760px)");
  return (
    <div style={{ paddingTop: 4 }}>
      <section style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>
          Personal details
        </h2>

        <div
          style={{
            ...{
              background: "#fff",
              borderRadius: 8,
              padding: "17px 20px",
              display: "grid",
              gridTemplateColumns: "75px repeat(5, 1fr)",
              alignItems: "center",
              gap: 24,
            },
            ...(isMax1100
              ? { gridTemplateColumns: "70px repeat(3, 1fr)" }
              : {}),
            ...(isMax760 ? { gridTemplateColumns: "1fr 1fr" } : {}),
          }}
        >
          <img
            style={{
              ...{
                width: 67,
                height: 67,
                borderRadius: "50%",
                objectFit: "cover",
              },
              ...(isMax760 ? { gridRow: "span 2" } : {}),
            }}
            src={rider.avatar}
            alt=""
          />

          <Field label="Full Name" value={rider.name} />

          <Field label="Email" value={rider.email} />

          <Field label="Mobile No" value={rider.phone} />

          <Field label="Age/Gender" value={rider.ageGender} />

          <Field label="City/State" value={rider.city} />
        </div>
      </section>

      <section style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>
          Vehicle details
        </h2>

        <div
          style={{
            ...{
              background: "#fff",
              borderRadius: 8,
              padding: "17px 20px",
              display: "grid",
              alignItems: "center",
              gap: 24,
              gridTemplateColumns: "170px repeat(5, 1fr)",
              height: 140,
            },
            ...(isMax1100
              ? { gridTemplateColumns: "150px repeat(3, 1fr)", height: "auto" }
              : {}),
            ...(isMax760 ? { gridTemplateColumns: "1fr 1fr" } : {}),
          }}
        >
          <img
            style={{ width: 145, height: 92, objectFit: "contain" }}
            src={rider.vehicle.image}
            alt=""
          />

          <Field label="Vehicle Name" value={rider.vehicle.name} />

          <Field label="Color" value={rider.vehicle.color} />

          <Field label="Purchased On" value={rider.vehicle.purchasedOn} />

          <Field label="Vehicle Number" value={rider.vehicle.number} />

          <Field label="Model Year" value={rider.vehicle.year} />
        </div>
      </section>

      <section style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>
          Document details
        </h2>

        <div
          style={{
            ...{
              background: "#fff",
              borderRadius: 8,
              padding: 20,
              display: "grid",
              gridTemplateColumns: "1.7fr 1fr 1fr 1fr",
              gap: 20,
            },
            ...(isMax1100 ? { gridTemplateColumns: "1fr 1fr" } : {}),
            ...(isMax760 ? { gridTemplateColumns: "1fr" } : {}),
          }}
        >
          {rider.documents.map((d) => (
            <div
              style={{
                border: "1px solid #68635e",
                borderRadius: 5,
                minHeight: 164,
                padding: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
              }}
              key={d.label}
            >
              <img
                style={{
                  width: "100%",
                  height: 105,
                  objectFit: "cover",
                  objectPosition: "center",
                  border: 0,
                  outline: 0,
                }}
                src={d.image}
                alt={d.label}
              />

              <b style={{ fontSize: 11 }}>{d.label}</b>
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
    <div
      style={{ display: "flex", justifyContent: "center", gap: 7, padding: 14 }}
    >
      <button
        style={{
          height: 27,
          minWidth: 27,
          border: "1px solid #d8d1ca",
          background: "#fff",
          borderRadius: 7,
          fontSize: 11,
        }}
        type="button"
        disabled={page === 1}
        onClick={() => onPage(Math.max(1, page - 1))}
      >
        ‹
      </button>

      {pages.map((item) => (
        <button
          type="button"
          key={item}
          style={{
            ...{
              height: 27,
              minWidth: 27,
              border: "1px solid #d8d1ca",
              background: "#fff",
              borderRadius: 7,
              fontSize: 11,
            },
            ...(page === item
              ? {
                  border: "1px solid #8a5a32",
                  background: "#8a5a32",
                  color: "#fff",
                }
              : {}),
          }}
          onClick={() => onPage(item)}
        >
          {item}
        </button>
      ))}

      <button
        style={{
          height: 27,
          minWidth: 27,
          border: "1px solid #d8d1ca",
          background: "#fff",
          borderRadius: 7,
          fontSize: 11,
        }}
        type="button"
        disabled={page === totalPages}
        onClick={() => onPage(Math.min(totalPages, page + 1))}
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
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(40, 35, 30, 0.28)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onMouseDown={onClose}
    >
      <div
        style={{
          width: 405,
          background: "#fff",
          borderRadius: 14,
          padding: "18px 20px",
        }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 14,
            paddingBottom: 13,
            borderBottom: "1px solid #ddd",
          }}
        >
          <b>Suspend “{name}”</b>

          <button
            style={{ border: 0, background: "transparent" }}
            type="button"
            onClick={onClose}
          >
            <X size={17} />
          </button>
        </div>

        <label
          style={{
            display: "block",
            fontSize: 10,
            fontWeight: 700,
            color: "#5f5a55",
            margin: "20px 0 9px",
          }}
        >
          Suspend reason
        </label>

        <textarea
          style={{
            width: "100%",
            height: 174,
            border: "1px solid #777",
            resize: "none",
            outline: "none",
            padding: 12,
            font: "11px Manrope, sans-serif",
          }}
          data-placeholder="riders"
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
          placeholder="Write your reason of suspend to vendor..."
        />

        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            color: "#888",
            fontSize: 9,
            margin: "9px 0 25px",
          }}
        >
          <Info size={13} /> This message will be sent to the rider
        </p>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}
        >
          <button
            style={{
              height: 35,
              border: "1px solid #6b5c52",
              borderRadius: 5,
              background: "#fff",
              fontSize: 10,
              fontWeight: 700,
              color: "#5c5650",
            }}
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            style={{
              ...{
                height: 35,
                border: "1px solid #8a5a32",
                borderRadius: 5,
                fontSize: 10,
                fontWeight: 700,
                background: "#8a5a32",
                color: "#fff",
              },
              ...(!reason.trim()
                ? { background: "#ddd", borderColor: "#ddd", color: "#aaa" }
                : {}),
            }}
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
