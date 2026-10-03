import "../styles/riders.css";
import { useMemo, useState } from "react";
import {
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRiders } from "../hooks/useRiders";
import { filterRiders } from "../utils/rider.utils";

const PAGE_SIZE = 10;

export default function RidersScreen() {
  const navigate = useNavigate();
  const { items, isLoading } = useRiders();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [state, setState] = useState("All State");
  const [sort, setSort] = useState("A to Z");
  const [page, setPage] = useState(1);

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

  const totalPages = Math.max(
    1,
    Math.ceil(stateFiltered.length / PAGE_SIZE),
  );

  const visible = stateFiltered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

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
    <div className="rider-page">
      <div className="rider-list-header">
        <div className="rider-list-title">
          <h2>
            Total Rider - {items.length === 24 ? 78 : items.length}
          </h2>
        </div>

        <div className="rider-toolbar">
          <label className="rider-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => updateSearch(e.target.value)}
              placeholder="Search rider name, city"
            />
          </label>

          <Dropdown
            value={state}
            options={["All State", "Mumbai", "Delhi", "Bangalore"]}
            onChange={updateState}
          />

          <button
            className="icon-filter"
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
            className="icon-filter"
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

      <div className="rider-table-wrap main-rider-table">
        <table className="rider-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>CONTACT NO.</th>
              <th>EMAIL</th>
              <th>VEHICLE</th>
              <th>TODAY DELIVERIES</th>
              <th>EARNINGS</th>
              <th>AVG RATING</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="loading-cell">
                  Loading riders…
                </td>
              </tr>
            ) : (
              visible.map((rider) => (
                <tr key={rider.id}>
                  <td>
                    <div className="rider-name">
                      <img
                        src="/reference/riders/avatar-list.jpg"
                        alt=""
                      />
                      <b>{rider.name}</b>
                    </div>
                  </td>

                  <td>{rider.phone}</td>

                  <td title={rider.email}>{rider.email}</td>

                  <td>{rider.vehicle}</td>

                  <td>{rider.todayDeliveries}</td>

                  <td>{rider.earnings}</td>

                  <td>★ {rider.rating}</td>

                  <td>
                    <span
                      className={`rider-status ${rider.status.toLowerCase()}`}
                    >
                      {rider.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="outline-action"
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin-dashboard/riders/${rider.id}`,
                        )
                      }
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPage={setPage}
        />
      </div>
    </div>
  );
}

function Dropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rider-custom-dropdown rider-list-dropdown">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{value}</span>

        <ChevronDown
          size={13}
          className={open ? "rotate" : ""}
        />
      </button>

      {open && (
        <div className="rider-dropdown-menu">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={option === value ? "selected" : ""}
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
    <div className="rider-pagination">
      <button
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
          className={page === n ? "active" : ""}
          onClick={() => onPage(n)}
        >
          {n}
        </button>
      ))}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
      >
        ›
      </button>
    </div>
  );
}