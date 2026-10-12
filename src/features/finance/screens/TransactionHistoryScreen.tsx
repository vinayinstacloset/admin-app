import CommonTable from "../../../shared/components/common/CommonTable";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  ChevronDown,
  Download,
  Filter,
  Landmark,
  Package,
  RotateCcw,
  Search,
  WalletCards,
  BanknoteArrowDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { getFinanceDataset } from "../data/mockData";
import type { FinanceEntity } from "../types/finance.types";
import { formatCurrency, formatSignedCurrency } from "../utils/finance.utils";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const filters = ["All", "Order", "Return", "Exchange", "Payout", "Withdraw"];

export default function TransactionHistoryScreen() {
  const { entity = "vendor" } = useParams<{ entity: FinanceEntity }>();

  const safeEntity: FinanceEntity = entity === "rider" ? "rider" : "vendor";

  const data = getFinanceDataset(safeEntity);

  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(data.period.month);
  const [year, setYear] = useState(data.period.year);
  const [monthOpen, setMonthOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    setMonth(data.period.month);
    setYear(data.period.year);
  }, [data.period.month, data.period.year]);

  const rows = useMemo(
    () =>
      data.transactions.filter((row) => {
        const text =
          `${row.reference} ${row.transactionId} ${row.customer} ${row.bank}`.toLowerCase();

        const matchesSearch = text.includes(search.trim().toLowerCase());

        const kindLabel =
          row.kind === "order"
            ? "Order"
            : row.kind === "refund"
              ? "Return"
              : row.kind === "withdrawal"
                ? "Withdraw"
                : row.kind === "payout"
                  ? "Payout"
                  : "Exchange";

        const matchesFilter = filter === "All" || kindLabel === filter;

        return matchesSearch && matchesFilter;
      }),
    [data.transactions, search, filter],
  );

  const downloadStatement = () => {
    const csv = [
      "Order/Bank,Transaction ID,Customer,Date,Status,Amount",
      ...rows.map((row) =>
        [
          row.reference,
          row.transactionId,
          row.customer,
          row.date,
          row.status,
          row.amount,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeEntity}-transaction-history.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setExtraCrumbs([
      {
        label: "Finance",
        to: "/admin-dashboard/finance",
      },
      {
        label: `${
          data.payouts[0]?.name ??
          (safeEntity === "vendor" ? "Vendor" : "Rider")
        } transaction history`,
      },
    ]);

    setPageAction(
      <button type="button" onClick={downloadStatement} style={downloadButton}>
        Download Statement
        <Download size={14} />
      </button>,
    );

    return () => {
      setExtraCrumbs([]);
      setPageAction(null);
    };
  }, [safeEntity, setExtraCrumbs, setPageAction, rows]);

  return (
    <div style={page}>
      <style>{`
        .transaction-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
        }

        .transaction-table-scroll {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          border-radius: 9px;
          background: #fff;
          -webkit-overflow-scrolling: touch;
        }

        .transaction-table {
          min-width: 860px;
        }

        .transaction-row {
          display: grid;
          grid-template-columns:
            1.15fr
            1.05fr
            1fr
            .7fr
            .85fr
            .8fr
            .8fr;
          align-items: center;
          min-height: 62px;
          padding: 0 14px;
          border-bottom: 1px solid #ddd9d5;
          font-size: 10px;
          gap: 8px;
        }

        .finance-control-menu button:hover {
          background: #eeeae7 !important;
        }

        @media (max-width: 900px) {
          .transaction-summary-grid {
            grid-template-columns: 1fr;
          }

          .transaction-table-scroll {
            overflow-x: auto;
          }

          .transaction-controls {
            flex-wrap: wrap;
          }

          .transaction-controls .transaction-search {
            width: min(100%, 275px);
          }
        }
      `}</style>

      <div className="transaction-summary-grid">
        <Summary
          icon="wallet"
          label="Wallet Balance"
          value={formatCurrency(data.summary.walletBalance)}
        />

        <Summary
          icon="next"
          label="Next Payout"
          value={formatCurrency(data.summary.nextPayout)}
          sub={`Scheduled for ${data.summary.scheduledDate}`}
        />

        <Summary
          icon="month"
          label="This Month Payout"
          value={formatCurrency(data.summary.thisMonthPayout)}
        />
      </div>

      <div style={contentGrid}>
        <section>
          <h2 style={historyTitle}>Transaction History - #29</h2>

          <div className="transaction-controls" style={controls}>
            <div className="transaction-search" style={searchWrap}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: 10,
                  top: 7,
                  color: "#aaa",
                }}
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order id, customer name..."
                style={searchInput}
              />
            </div>

            {/* MONTH / YEAR */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setMonthOpen((value) => !value)}
                style={controlButton}
              >
                <Calendar size={13} />
                {month}
                <ChevronDown size={12} />
              </button>

              {monthOpen && (
                <div className="finance-control-menu" style={monthMenu}>
                  <div style={yearStrip}>
                    {[2026, 2025, 2024].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setYear(item)}
                        style={{
                          ...yearButton,
                          background: item === year ? "#ece8e5" : "#fff",
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div
                    style={{
                      padding: 4,
                      maxHeight: 285,
                      overflowY: "auto",
                    }}
                  >
                    {months.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setMonth(item);
                          setMonthOpen(false);
                        }}
                        style={{
                          ...monthOption,
                          background: item === month ? "#ece8e5" : "#fff",
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* FILTER */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setFilterOpen((value) => !value)}
                style={controlButton}
              >
                <Filter size={14} />
                {filter}
                <ChevronDown size={12} />
              </button>

              {filterOpen && (
                <div className="finance-control-menu" style={filterMenu}>
                  {filters.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setFilter(item);
                        setFilterOpen(false);
                      }}
                      style={{
                        ...monthOption,
                        background: item === filter ? "#ece8e5" : "#fff",
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={downloadStatement}
              style={downloadSmall}
              aria-label="Download"
            >
              <Download size={14} />
            </button>
          </div>

          <CommonTable
            headers={[
              { header: "ORDER/BANK", width: "1.15fr" },
              { header: "TRANSACTION ID", width: "1.15fr" },
              { header: "CUSTOMER", width: "1fr" },
              { header: "DATE", width: "1fr" },
              { header: "STATUS", width: ".9fr" },
              { header: "AMOUNT", width: ".9fr" },
              { header: "ACTION", width: ".85fr" },
            ]}
            data={rows.map((row) => {
              const iconColor =
                row.kind === "order"
                  ? "#ef6e63"
                  : row.kind === "refund"
                    ? "#8e54ff"
                    : row.kind === "withdrawal"
                      ? "#087df0"
                      : row.kind === "payout"
                        ? "#25bb5d"
                        : "#087df0";
              const icon =
                row.kind === "order" ? (
                  <Package size={14} strokeWidth={1.8} />
                ) : row.kind === "withdrawal" ? (
                  <BanknoteArrowDown size={14} strokeWidth={1.8} />
                ) : row.kind === "payout" ? (
                  <WalletCards size={14} strokeWidth={1.8} />
                ) : (
                  <RotateCcw size={14} strokeWidth={1.8} />
                );
              return [
                <div key="reference" className="flex items-center gap-2">
                  <div
                    style={{
                      width: 27,
                      height: 27,
                      border: `1px solid ${iconColor}`,
                      borderRadius: 5,
                      display: "grid",
                      placeItems: "center",
                      color: iconColor,
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </div>
                  <strong>{row.reference}</strong>
                </div>,
                row.transactionId,
                row.customer,
                row.date,
                <span
                  key="status"
                  style={{
                    ...statusPill,
                    color: row.status === "Paid" ? "#26b75d" : "#e2a900",
                    background: row.status === "Paid" ? "#eaf8ef" : "#fff8df",
                  }}
                >
                  {row.status === "Paid" ? "Completed" : "Processing"}
                </span>,
                <strong
                  key="amount"
                  style={{
                    color:
                      row.amount < 0
                        ? "#ed6f76"
                        : row.kind === "order" || row.kind === "payout"
                          ? "#25bb5d"
                          : "#26201b",
                  }}
                >
                  {formatSignedCurrency(row.amount)}
                </strong>,
                <button
                  key="action"
                  type="button"
                  onClick={() =>
                    navigate(
                      `/admin-dashboard/finance/transactions/${safeEntity}/${row.id}/details`,
                    )
                  }
                  style={viewButton}
                >
                  View details
                </button>,
              ];
            })}
            rowKeys={rows.map((row) => row.id)}
            minWidth={950}
            emptyMessage="No transactions found for the selected filters."
          />
        </section>

        {/* BANK SETTINGS */}
        <aside>
          <h2
            style={{
              margin: "0 0 12px",
              fontSize: 15,
            }}
          >
            Bank settings
          </h2>

          <div
            style={{
              display: "grid",
              gap: 15,
            }}
          >
            {data.banks.map((bank) => (
              <div
                key={bank.id}
                style={{
                  background: "#fff",
                  borderRadius: 9,
                  padding: 12,
                  position: "relative",
                }}
              >
                {bank.linked && <span style={linked}>Linked</span>}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    paddingTop: 6,
                  }}
                >
                  <div>
                    <span style={labelPill}>Bank account</span>

                    <strong style={bankValue}>
                      {bank.bankName} {maskAccount(bank.accountNumber)}
                    </strong>
                  </div>

                  <div>
                    <span style={labelPill}>GST</span>

                    <strong style={bankValue}>{bank.gstNumber}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function maskAccount(account: string) {
  const digits = account.replace(/\s/g, "");

  return `•••• •••• ${digits.slice(-4)}`;
}

function Summary({
  icon,
  label,
  value,
  sub,
}: {
  icon: "wallet" | "next" | "month";
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div style={summaryCard}>
      <div
        style={{
          width: 39,
          height: 39,
          borderRadius: "50%",
          background:
            icon === "wallet"
              ? "#e5f2ff"
              : icon === "next"
                ? "#eaf8ef"
                : "#f5e8ff",
          display: "grid",
          placeItems: "center",
          color:
            icon === "wallet"
              ? "#087df0"
              : icon === "next"
                ? "#2abb63"
                : "#a846e6",
        }}
      >
        <WalletCards size={17} />
      </div>

      {sub && (
        <span
          style={{
            position: "absolute",
            right: 13,
            top: 12,
            fontSize: 10,
            color: "#888",
          }}
        >
          {sub}
        </span>
      )}

      <div
        style={{
          marginTop: 10,
          fontSize: 13,
        }}
      >
        {label}:{" "}
        <strong
          style={{
            fontSize: 21,
          }}
        >
          {value}
        </strong>
      </div>
    </div>
  );
}

const page: React.CSSProperties = {
  color: "#26201b",
  paddingBottom: 28,
  fontFamily: "Manrope, system-ui, sans-serif",
};

const summaryCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: 9,
  padding: 13,
  minHeight: 80,
  position: "relative",
};

const contentGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0,1fr) 375px",
  gap: 16,
  marginTop: 19,
  alignItems: "start",
};

const historyTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  fontWeight: 800,
};

const controls: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 7,
  margin: "10px 0 12px",
};

const searchWrap: React.CSSProperties = {
  position: "relative",
  width: 275,
};

const searchInput: React.CSSProperties = {
  width: "100%",
  height: 28,
  boxSizing: "border-box",
  border: 0,
  borderRadius: 5,
  background: "#fff",
  padding: "0 10px 0 28px",
  outline: "none",
  fontSize: 9,
};

const controlButton: React.CSSProperties = {
  height: 28,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  border: 0,
  borderRadius: 5,
  background: "#fff",
  padding: "0 10px",
  fontSize: 9,
  color: "#514b47",
  cursor: "pointer",
};

const monthMenu: React.CSSProperties = {
  position: "absolute",
  right: 0,
  top: 32,
  zIndex: 50,
  width: 145,
  background: "#fff",
  borderRadius: 5,
  boxShadow: "0 4px 15px rgba(0,0,0,.12)",
  padding: 4,
  border: "1px solid #ebe7e3",
};

const filterMenu: React.CSSProperties = {
  position: "absolute",
  right: 0,
  top: 32,
  zIndex: 50,
  width: 130,
  background: "#fff",
  borderRadius: 5,
  boxShadow: "0 4px 15px rgba(0,0,0,.12)",
  padding: 4,
  border: "1px solid #ebe7e3",
};

const yearStrip: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: 3,
  padding: 2,
  borderBottom: "1px solid #e4dfdb",
};

const yearButton: React.CSSProperties = {
  border: 0,
  borderRadius: 3,
  height: 24,
  fontSize: 8,
  cursor: "pointer",
  color: "#514b47",
};

const monthOption: React.CSSProperties = {
  display: "block",
  width: "100%",
  border: 0,
  borderRadius: 3,
  padding: "7px 8px",
  textAlign: "left",
  fontSize: 9,
  cursor: "pointer",
  color: "#514b47",
};

const downloadSmall: React.CSSProperties = {
  width: 30,
  height: 28,
  border: 0,
  borderRadius: 5,
  background: "#087df0",
  color: "#fff",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
};

const downloadButton: React.CSSProperties = {
  height: 30,
  display: "flex",
  alignItems: "center",
  gap: 6,
  border: 0,
  borderRadius: 4,
  background: "#087df0",
  color: "#fff",
  padding: "0 14px",
  fontSize: 10,
  fontWeight: 700,
  cursor: "pointer",
};

const headerRow: React.CSSProperties = {
  background: "#f0f0ee",
  fontSize: 9,
  color: "#625d58",
};

const statusPill: React.CSSProperties = {
  display: "inline-flex",
  padding: "6px 11px",
  borderRadius: 18,
  fontWeight: 700,
};

const viewButton: React.CSSProperties = {
  height: 25,
  padding: "0 9px",
  border: "1px solid #765038",
  borderRadius: 5,
  background: "#fff",
  color: "#765038",
  fontSize: 8,
  cursor: "pointer",
};

const linked: React.CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  background: "#30b85d",
  color: "#fff",
  fontSize: 8,
  padding: "3px 18px 3px 7px",
  clipPath: "polygon(0 0, 100% 0, 78% 100%, 0 100%)",
};

const labelPill: React.CSSProperties = {
  display: "inline-block",
  padding: "3px 6px",
  background: "#e8f4ff",
  color: "#087df0",
  borderRadius: 3,
  fontSize: 9,
};

const bankValue: React.CSSProperties = {
  display: "block",
  marginTop: 9,
  fontSize: 10,
};

const emptyRow: React.CSSProperties = {
  minHeight: 150,
  display: "grid",
  placeItems: "center",
  color: "#777",
  fontSize: 10,
};
