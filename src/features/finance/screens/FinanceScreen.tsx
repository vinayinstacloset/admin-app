import CommonTable from "../../../shared/components/common/CommonTable";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  ChevronDown,
  Download,
  Filter,
  Landmark,
  Search,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { useFinance } from "../hooks/useFinance";
import type { FinanceEntity, PayoutFrequency } from "../types/finance.types";
import { formatCompactCurrency, formatCurrency } from "../utils/finance.utils";
import {
  AddBalanceModal,
  ErrorModal,
  PaymentModal,
  PayoutSettingsModal,
  SuccessModal,
} from "../components/FinanceModal";

const brown = "#765038";
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

export default function FinanceScreen() {
  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();
  const navigate = useNavigate();
  const [entity, setEntity] = useState<FinanceEntity>("vendor");
  const [selectedMonth, setSelectedMonth] = useState("March, 2026");
  const [monthOpen, setMonthOpen] = useState(false);
  const [year, setYear] = useState(2026);
  const [addBalanceOpen, setAddBalanceOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [successAmount, setSuccessAmount] = useState<number | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [frequency, setFrequency] = useState<PayoutFrequency>("Weekly");
  const [sortOpen, setSortOpen] = useState(false);

  const {
    data,
    payouts,
    banks,
    walletBalance,
    search,
    setSearch,
    sort,
    setSort,
    addBalance,
    setFrequency: setHookFrequency,
  } = useFinance(entity);

  useEffect(() => {
    setSelectedMonth(`${data.period.month}, ${data.period.year}`);
    setYear(data.period.year);
  }, [data.period.month, data.period.year]);

  const downloadStatement = () => {
    const csv = [
      "Name,City,Wallet,Orders,Gross Revenue,Commission,Net Payout,Status,Payout Date",
      ...payouts.map((row) =>
        [
          row.name,
          row.city,
          row.wallet,
          row.orders,
          row.grossRevenue,
          row.commission,
          row.netPayout,
          row.status,
          row.payoutDate,
        ].join(","),
      ),
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${entity}-finance-statement.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setExtraCrumbs([{ label: "Finance" }]);
    setPageAction(
      <>
        <button
          type="button"
          onClick={() =>
            navigate(`/admin-dashboard/finance/banks?entity=${entity}`)
          }
          style={outlineTop}
        >
          <Landmark size={14} /> Bank accounts
        </button>
        <button type="button" onClick={downloadStatement} style={blueTop}>
          Download Statement <Download size={14} />
        </button>
      </>,
    );
    return () => {
      setExtraCrumbs([]);
      setPageAction(null);
    };
  }, [entity, navigate, setExtraCrumbs, setPageAction]);

  return (
    <div data-finance style={page}>
      <style>{`
        .finance-summary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px}
        .finance-table-scroll{overflow:hidden;border-radius:9px;background:#fff}
        .finance-table{min-width:940px}
        .finance-table-row{display:grid;grid-template-columns:1.15fr .95fr .65fr 1.1fr .9fr .9fr .75fr 1.05fr;align-items:center;min-height:81px;padding:0 10px 0 25px;border-bottom:1px solid #ddd9d5;font-size:10px;column-gap:10px}
        .finance-control-menu button:hover{background:#eeeae7!important}
        @media(max-width:900px){.finance-summary-grid{grid-template-columns:1fr}.finance-table-scroll{overflow-x:auto}.finance-toolbar{flex-wrap:wrap}.finance-table{min-width:940px}}
      `}</style>

      <div style={tabs}>
        <button
          type="button"
          onClick={() => setEntity("vendor")}
          style={{
            ...tab,
            color: entity === "vendor" ? brown : "#aaa",
            borderBottomColor: entity === "vendor" ? brown : "transparent",
          }}
        >
          Vendor - 64
        </button>
        <button
          type="button"
          onClick={() => setEntity("rider")}
          style={{
            ...tab,
            color: entity === "rider" ? brown : "#aaa",
            borderBottomColor: entity === "rider" ? brown : "transparent",
          }}
        >
          Rider - 78
        </button>
      </div>

      <div style={periodRow}>
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setMonthOpen((v) => !v)}
            style={monthButton}
          >
            <Calendar size={14} /> {selectedMonth} <ChevronDown size={13} />
          </button>
          {monthOpen && (
            <div className="finance-control-menu" style={monthPicker}>
              <div style={yearStrip}>
                {[2026, 2025, 2024].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setYear(item);
                      setSelectedMonth(`${data.period.month}, ${item}`);
                    }}
                    style={{
                      ...yearButton,
                      background: item === year ? "#ece8e5" : "#fff",
                      color: item === year ? brown : "#514b47",
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div style={monthList}>
                {months.map((month) => (
                  <button
                    key={month}
                    type="button"
                    onClick={() => {
                      setSelectedMonth(`${month}, ${year}`);
                      setMonthOpen(false);
                    }}
                    style={{
                      ...monthItem,
                      background: selectedMonth.startsWith(month)
                        ? "#ece8e5"
                        : "#fff",
                    }}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="finance-summary-grid">
        <SummaryCard
          label="Wallet Balance"
          value={formatCurrency(walletBalance)}
          action="Add Balance"
          onAction={() => setAddBalanceOpen(true)}
          type="wallet"
        />
        <SummaryCard
          label="Platform Revenue"
          value={formatCurrency(data.summary.platformRevenue)}
          type="revenue"
        />
        <SummaryCard
          label="Next Payout"
          value={formatCurrency(data.summary.nextPayout)}
          action="Settings"
          onAction={() => setSettingsOpen(true)}
          sub={`Scheduled for ${data.summary.scheduledDate}`}
          type="payout"
        />
      </div>

      <div className="finance-toolbar" style={toolbar}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Payouts</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative", width: 275 }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: 9,
                top: 7,
                color: "#aaa",
                zIndex: 1,
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${entity} name`}
              style={searchInput}
            />
          </div>
          <button type="button" style={filterButton} aria-label="Filter">
            <Filter size={15} />
          </button>
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              style={sortSelect}
            >
              {sort === "newest" ? "Newest to oldest" : "Oldest to newest"}
              <ChevronDown size={12} />
            </button>
            {sortOpen && (
              <div className="finance-control-menu" style={sortMenu}>
                <button
                  type="button"
                  onClick={() => {
                    setSort("newest");
                    setSortOpen(false);
                  }}
                  style={{
                    ...sortOption,
                    background: sort === "newest" ? "#ece8e5" : "#fff",
                  }}
                >
                  Newest to oldest
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSort("oldest");
                    setSortOpen(false);
                  }}
                  style={{
                    ...sortOption,
                    background: sort === "oldest" ? "#ece8e5" : "#fff",
                  }}
                >
                  Oldest to newest
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CommonTable
        headers={[
          { header: entity.toUpperCase(), width: "1.15fr" },
          { header: "WALLET", width: ".95fr" },
          { header: "ORDERS", width: ".65fr" },
          { header: "GROSS REVENUE", width: "1.1fr" },
          { header: "COMMISSION", width: ".9fr" },
          { header: "NET PAYOUT", width: ".9fr" },
          { header: "STATUS", width: ".75fr" },
          { header: "ACTION", width: "1.05fr" },
        ]}
        data={payouts.map((row) => [
          <strong key="name">{row.name}</strong>,
          formatCurrency(row.wallet),
          row.orders,
          formatCompactCurrency(row.grossRevenue),
          <strong key="commission" style={{ color: "#28b960" }}>
            {formatCompactCurrency(row.commission)}
          </strong>,
          formatCompactCurrency(row.netPayout),
          <span key="status" style={statusPill}>
            {row.status}
          </span>,
          <div key="action">
            <div style={{ fontSize: 10, marginBottom: 5 }}>
              {row.payoutDate}
            </div>
            <button
              type="button"
              onClick={() =>
                navigate(`/admin-dashboard/finance/transactions/${entity}`)
              }
              style={historyButton}
            >
              Transaction history
            </button>
          </div>,
        ])}
        rowKeys={payouts.map((row) => row.id)}
        minWidth={1040}
      />

      {addBalanceOpen && (
        <AddBalanceModal
          onClose={() => setAddBalanceOpen(false)}
          onContinue={(amount) => {
            setAddBalanceOpen(false);
            setPaymentAmount(amount);
          }}
        />
      )}
      {paymentAmount !== null && (
        <PaymentModal
          amount={paymentAmount}
          banks={banks}
          onClose={() => setPaymentAmount(null)}
          onSuccess={() => {
            addBalance(paymentAmount);
            setSuccessAmount(paymentAmount);
            setPaymentAmount(null);
          }}
          onError={() => {
            setPaymentAmount(null);
            setErrorOpen(true);
          }}
        />
      )}
      {successAmount !== null && (
        <SuccessModal
          amount={successAmount}
          onClose={() => setSuccessAmount(null)}
        />
      )}
      {errorOpen && (
        <ErrorModal
          onClose={() => setErrorOpen(false)}
          onRetry={() => {
            setErrorOpen(false);
            setAddBalanceOpen(true);
          }}
        />
      )}
      {settingsOpen && (
        <PayoutSettingsModal
          frequency={frequency}
          onClose={() => setSettingsOpen(false)}
          onSave={(value) => {
            setFrequency(value);
            setHookFrequency(value);
            setSettingsOpen(false);
          }}
        />
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  action,
  sub,
  type,
  onAction,
}: {
  label: string;
  value: string;
  action?: string;
  sub?: string;
  type: "wallet" | "revenue" | "payout";
  onAction?: () => void;
}) {
  const background =
    type === "wallet" ? "#e5f2ff" : type === "revenue" ? "#eaf8ef" : "#fff9df";
  const color =
    type === "wallet" ? "#087df0" : type === "revenue" ? "#2abb63" : "#f2c300";
  return (
    <div style={summaryCard}>
      <div
        style={{
          width: 39,
          height: 39,
          borderRadius: "50%",
          background,
          display: "grid",
          placeItems: "center",
          color,
        }}
      >
        <WalletCards size={18} />
      </div>
      {sub && (
        <div
          style={{
            position: "absolute",
            right: 13,
            top: 13,
            fontSize: 10,
            color: "#888",
          }}
        >
          {sub}
        </div>
      )}
      <div style={{ marginTop: 11, fontSize: 14 }}>
        {label}: <strong style={{ fontSize: 21 }}>{value}</strong>
      </div>
      {action && (
        <button type="button" onClick={onAction} style={actionLink}>
          {action} ›
        </button>
      )}
    </div>
  );
}

const page: React.CSSProperties = {
  color: "#26201b",
  fontFamily: "Manrope, system-ui, sans-serif",
  paddingBottom: 28,
};
const tabs: React.CSSProperties = { display: "flex", gap: 18, marginBottom: 7 };
const tab: React.CSSProperties = {
  border: 0,
  borderBottom: "3px solid transparent",
  background: "transparent",
  padding: "0 4px 7px",
  fontSize: 14,
  fontWeight: 800,
  cursor: "pointer",
};
const periodRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: 12,
  position: "relative",
  minHeight: 31,
};
const monthButton: React.CSSProperties = {
  height: 31,
  display: "flex",
  alignItems: "center",
  gap: 7,
  padding: "0 11px",
  border: 0,
  borderRadius: 5,
  background: "#fff",
  fontSize: 10,
  color: "#3f3b38",
  cursor: "pointer",
};
const monthPicker: React.CSSProperties = {
  position: "absolute",
  zIndex: 50,
  top: 37,
  right: 0,
  width: 145,
  background: "#fff",
  borderRadius: 6,
  boxShadow: "0 6px 20px rgba(0,0,0,.14)",
  overflow: "hidden",
  border: "1px solid #ebe7e3",
};
const yearStrip: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: 3,
  padding: 5,
  borderBottom: "1px solid #e4dfdb",
};
const yearButton: React.CSSProperties = {
  border: 0,
  borderRadius: 3,
  height: 25,
  fontSize: 9,
  cursor: "pointer",
};
const monthList: React.CSSProperties = {
  maxHeight: 285,
  overflowY: "auto",
  padding: 4,
};
const monthItem: React.CSSProperties = {
  width: "100%",
  height: 28,
  border: 0,
  textAlign: "left",
  padding: "0 8px",
  fontSize: 9,
  borderRadius: 3,
  cursor: "pointer",
};
const toolbar: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  margin: "22px 0 12px",
  gap: 10,
};
const summaryCard: React.CSSProperties = {
  position: "relative",
  background: "#fff",
  borderRadius: 9,
  padding: 13,
  minHeight: 100,
  boxSizing: "border-box",
};
const actionLink: React.CSSProperties = {
  position: "absolute",
  right: 13,
  bottom: 16,
  border: 0,
  background: "transparent",
  color: "#087df0",
  fontSize: 10,
  textDecoration: "underline",
  cursor: "pointer",
};
const searchInput: React.CSSProperties = {
  width: 275,
  height: 28,
  boxSizing: "border-box",
  border: 0,
  borderRadius: 5,
  background: "#fff",
  outline: "none",
  padding: "0 8px 0 28px",
  fontSize: 10,
};
const filterButton: React.CSSProperties = {
  width: 26,
  height: 28,
  border: 0,
  background: "transparent",
  cursor: "pointer",
  color: "#68615b",
};
const sortSelect: React.CSSProperties = {
  height: 28,
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  border: 0,
  borderRadius: 5,
  background: "#fff",
  padding: "0 10px",
  fontSize: 10,
  color: "#514b47",
  outline: "none",
  cursor: "pointer",
};
const sortMenu: React.CSSProperties = {
  position: "absolute",
  top: 33,
  right: 0,
  zIndex: 30,
  width: 145,
  background: "#fff",
  borderRadius: 5,
  boxShadow: "0 5px 16px rgba(0,0,0,.14)",
  padding: 4,
  border: "1px solid #ebe7e3",
};
const sortOption: React.CSSProperties = {
  width: "100%",
  height: 29,
  border: 0,
  borderRadius: 3,
  textAlign: "left",
  padding: "0 8px",
  fontSize: 9,
  cursor: "pointer",
  color: "#514b47",
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
  background: "#e9f4ff",
  color: "#087df0",
  fontWeight: 700,
};
const historyButton: React.CSSProperties = {
  height: 23,
  padding: "0 9px",
  border: "1px solid #765038",
  borderRadius: 14,
  background: "#fff",
  color: brown,
  fontSize: 8,
  cursor: "pointer",
};
const outlineTop: React.CSSProperties = {
  height: 30,
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "0 12px",
  border: "1px solid #765038",
  borderRadius: 4,
  background: "#fff",
  color: brown,
  fontSize: 10,
  fontWeight: 700,
  cursor: "pointer",
};
const blueTop: React.CSSProperties = {
  height: 30,
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "0 14px",
  border: 0,
  borderRadius: 4,
  background: "#087df0",
  color: "#fff",
  fontSize: 10,
  fontWeight: 700,
  cursor: "pointer",
};
