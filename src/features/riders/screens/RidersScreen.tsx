import CommonTable from "../../../shared/components/common/CommonTable";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Filter, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { useRiders } from "../hooks/useRiders";
import { filterRiders } from "../utils/rider.utils";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";
import { hoverStyle } from "../../../shared/utils/interactiveStyle";

const PAGE_SIZE = 10;

const STATUS_STYLES: Record<string, { background: string; color: string }> = {
  online: { background: "#e5f7ec", color: "#1db45a" },
  offline: { background: "#f1f1f1", color: "#aaa" },
  suspend: { background: "#fff0f0", color: "#ff5b63" },
};

export default function RidersScreen() {
  const isMax1100 = useMediaQuery("(max-width: 1100px)");
  const isMax900 = useMediaQuery("(max-width: 900px)");
  const isMax760 = useMediaQuery("(max-width: 760px)");
  const navigate = useNavigate();
  const { setPageAction } = useDashboardOutletContext();
  const { items, isLoading } = useRiders();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [state, setState] = useState("All State");
  const [sort, setSort] = useState("A to Z");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPageAction(
      <button
        type="button"
        onClick={() => navigate("/admin-dashboard/riders/delivery-charges")}
        style={{
          height: 32,
          padding: "0 16px",
          border: 0,
          borderRadius: 4,
          background: "#795033",
          color: "#fff",
          fontSize: 11,
          fontWeight: 600,
          whiteSpace: "nowrap",
          cursor: "pointer",
        }}
      >
        Delivery charges
      </button>,
    );

    return () => setPageAction(null);
  }, [navigate, setPageAction]);

  const filtered = useMemo(() => {
    const next = filterRiders(items, search, status);

    return [...next].sort((a, b) =>
      sort === "Z to A"
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name),
    );
  }, [items, search, status, sort]);

  const stateFiltered =
    state === "All State"
      ? filtered
      : filtered.filter((item) => item.id !== "999");

  const totalPages = Math.max(1, Math.ceil(stateFiltered.length / PAGE_SIZE));

  const visible = stateFiltered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const updateStatus = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const updateState = (value: string) => {
    setState(value);
    setPage(1);
  };

  return (
    <div style={{ color: "#2d2925" }}>
      <div
        style={{
          ...{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            marginBottom: 10,
          },
          ...(isMax1100 ? { gap: 12 } : {}),
          ...(isMax900 ? { overflowX: "auto", paddingBottom: 4 } : {}),
          ...(isMax760 ? { justifyContent: "flex-start" } : {}),
        }}
      >
        <div
          style={{
            ...{ flex: "0 0 auto", margin: 0 },
            ...(isMax900
              ? { flexGrow: 0, flexBasis: "auto", flexShrink: 0 }
              : {}),
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            Total Rider - {items.length === 24 ? 78 : items.length}
          </h2>
        </div>

        <div
          style={{
            ...{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 10,
              flex: 1,
              minWidth: 0,
              flexWrap: "nowrap",
            },
            ...(isMax1100 ? { gap: 7 } : {}),
            ...(isMax900 ? { flex: "0 0 auto" } : {}),
            ...(isMax760 ? { justifyContent: "flex-start" } : {}),
          }}
        >
          <label
            style={{
              ...{
                height: 36,
                width: 276,
                flex: "0 1 276px",
                minWidth: 180,
                background: "#fff",
                borderRadius: 7,
                display: "flex",
                alignItems: "center",
                padding: "0 10px",
                color: "#aaa",
              },
              ...(isMax1100
                ? { flexGrow: 0, flexShrink: 1, width: 210, flexBasis: 210 }
                : {}),
              ...(isMax900 ? { width: 200, flexBasis: 200 } : {}),
              ...(isMax760 ? { width: 220, flexBasis: 220 } : {}),
            }}
          >
            <Search size={16} />
            <input
              style={{
                border: 0,
                outline: 0,
                width: "100%",
                minWidth: 0,
                fontSize: 11,
                paddingLeft: 7,
                background: "transparent",
              }}
              value={search}
              onChange={(e) => updateSearch(e.target.value)}
              placeholder="Search rider name, city"
            />
          </label>

          <Dropdown
            first
            value={state}
            options={["All State", "Mumbai", "Delhi", "Bangalore"]}
            onChange={updateState}
          />

          <button
            style={{
              height: 32,
              width: 28,
              flex: "0 0 28px",
              border: 0,
              background: "transparent",
              color: "#34302c",
              display: "grid",
              placeItems: "center",
              padding: 0,
            }}
            type="button"
            aria-label="Filter riders"
          >
            <Filter size={16} />
          </button>

          <Dropdown
            value={status}
            options={["All", "Online", "Offline", "Suspend"]}
            onChange={updateStatus}
          />

          <button
            style={{
              height: 32,
              width: 28,
              flex: "0 0 28px",
              border: 0,
              background: "transparent",
              color: "#34302c",
              display: "grid",
              placeItems: "center",
              padding: 0,
            }}
            type="button"
            aria-label="More filters"
          >
            <SlidersHorizontal size={17} />
          </button>

          <Dropdown
            value={sort}
            options={["A to Z", "Z to A"]}
            onChange={(value) => {
              setSort(value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div
        style={{
          ...{
            background: "#fff",
            borderRadius: 10,
            overflow: "hidden",
            border: "1px solid #ebe8e4",
          },
          ...(isMax760 ? { overflowY: "hidden", overflowX: "auto" } : {}),
        }}
      >
        <CommonTable
          headers={[
            "NAME",
            "CONTACT NO.",
            "EMAIL",
            "VEHICLE",
            "TODAY DELIVERIES",
            "EARNINGS",
            "AVG RATING",
            "STATUS",
            "ACTION",
          ]}
          data={
            isLoading
              ? []
              : visible.map((rider) => [
                  <div key="name" className="flex items-center gap-2">
                    <img
                      className="h-7 w-7 rounded-full object-cover"
                      src="/reference/riders/avatar-list.jpg"
                      alt=""
                    />
                    <b>{rider.name}</b>
                  </div>,
                  rider.phone,
                  <div
                    title={rider.email}
                    style={{
                      width: 180,
                      maxWidth: 180,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      paddingRight: 0,
                      boxSizing: "border-box",
                    }}
                  >
                    {rider.email}
                  </div>,

                  <div
                    style={{
                      minWidth: 110,
                      whiteSpace: "nowrap",
                      paddingLeft: 12,
                      boxSizing: "border-box",
                    }}
                  >
                    {rider.vehicle}
                  </div>,
                  rider.todayDeliveries,
                  rider.earnings,
                  `★ ${rider.rating}`,
                  <span
                    key="status"
                    style={{
                      padding: "6px 12px",
                      borderRadius: 14,
                      display: "inline-flex",
                      fontSize: 9,
                      ...(STATUS_STYLES[rider.status.toLowerCase()] ?? {
                        color: "#888",
                      }),
                    }}
                  >
                    {rider.status}
                  </span>,
                  <button
                    key="action"
                    type="button"
                    onClick={() =>
                      navigate(`/admin-dashboard/riders/${rider.id}`)
                    }
                    style={{
                      border: "1px solid #8a5a32",
                      background: "#fff",
                      color: "#6d472c",
                      borderRadius: 6,
                      padding: "5px 12px",
                      fontSize: 10,
                    }}
                  >
                    View
                  </button>,
                ])
          }
          rowKeys={visible.map((rider) => rider.id)}
          minWidth={1100}
          emptyMessage={isLoading ? "Loading riders…" : "No riders found."}
        />

        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </div>
    </div>
  );
}

function Dropdown({
  value,
  options,
  onChange,
  first = false,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  first?: boolean;
}) {
  const isMax1100 = useMediaQuery("(max-width: 1100px)");
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", flex: "0 0 auto" }}>
      <button
        style={{
          ...{
            height: 36,
            minWidth: 105,
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
          },
          ...(isMax1100 ? { minWidth: 90, padding: "0 8px" } : {}),
          ...(first ? { minWidth: 110 } : {}),
        }}
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{value}</span>

        <ChevronDown
          size={13}
          style={{
            transition: "transform 0.12s ease",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : undefined,
          }}
        />
      </button>

      {open && (
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
          {options.map((option) => (
            <button
              key={option}
              type="button"
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
                ...(option === value
                  ? { background: "#eeeae6", fontWeight: 600 }
                  : {}),
              }}
              {...hoverStyle(
                { background: "#eeeae6", fontWeight: 600 },
                option === value
                  ? { background: "#eeeae6", fontWeight: 600 }
                  : { background: "#fff", fontWeight: "" },
              )}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
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
    { length: Math.min(totalPages, 3) },
    (_, index) => index + 1,
  );

  return (
    <div
      style={{ display: "flex", justifyContent: "center", gap: 7, padding: 14 }}
    >
      <button
        style={{
          ...{
            height: 27,
            minWidth: 27,
            border: "1px solid #d8d1ca",
            background: "#fff",
            borderRadius: 7,
            fontSize: 11,
          },
          ...(page === 1 ? { opacity: 0.4 } : {}),
        }}
        type="button"
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
      >
        ‹
      </button>

      {pages.map((n) => (
        <button
          key={n}
          type="button"
          style={{
            ...{
              height: 27,
              minWidth: 27,
              border: "1px solid #d8d1ca",
              background: "#fff",
              borderRadius: 7,
              fontSize: 11,
            },
            ...(page === n
              ? {
                  border: "1px solid #8a5a32",
                  background: "#8a5a32",
                  color: "#fff",
                }
              : {}),
          }}
          onClick={() => onPage(n)}
        >
          {n}
        </button>
      ))}

      <button
        style={{
          ...{
            height: 27,
            minWidth: 27,
            border: "1px solid #d8d1ca",
            background: "#fff",
            borderRadius: 7,
            fontSize: 11,
          },
          ...(page === totalPages ? { opacity: 0.4 } : {}),
        }}
        type="button"
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
      >
        ›
      </button>
    </div>
  );
}
