import { useEffect } from "react";
import { MapPin, Phone, Ruler, Shirt, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { getFinanceDataset } from "../data/mockData";
import { formatCurrency } from "../utils/finance.utils";

export default function TransactionDetailsScreen() {
  const { entity = "vendor", transactionId = "" } = useParams<{
    entity: "vendor" | "rider";
    transactionId: string;
  }>();
  const safeEntity = entity === "rider" ? "rider" : "vendor";
  const data = getFinanceDataset(safeEntity);
  const transaction =
    data.transactions.find((item) => item.id === transactionId) ??
    data.transactions[0];
  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();
  const navigate = useNavigate();
  const personName =
    data.payouts[0]?.name ??
    (safeEntity === "rider" ? "Rajan Kumar" : "A-1 Fashion");

  useEffect(() => {
    const isOrderLike =
      transaction.kind === "order" || transaction.kind === "refund";
    setExtraCrumbs(
      isOrderLike
        ? [
            { label: "Finance", to: "/admin-dashboard/finance" },
            {
              label: `${personName} transaction history`,
              to: `/admin-dashboard/finance/transactions/${safeEntity}`,
            },
            { label: transaction.reference },
          ]
        : [
            {
              label: "Transactions",
              to: `/admin-dashboard/finance/transactions/${safeEntity}`,
            },
            { label: `${transaction.transactionId} details` },
          ],
    );
    setPageAction(null);
    return () => {
      setExtraCrumbs([]);
      setPageAction(null);
    };
  }, [
    personName,
    safeEntity,
    transaction.reference,
    setExtraCrumbs,
    setPageAction,
  ]);

  if (transaction.kind === "order" || transaction.kind === "refund") {
    return (
      <OrderTransactionDetails
        entity={safeEntity}
        transaction={transaction}
        personName={personName}
        navigate={navigate}
        isReturn={transaction.kind === "refund"}
      />
    );
  }

  return (
    <WithdrawalTransactionDetails
      entity={safeEntity}
      transaction={transaction}
      navigate={navigate}
    />
  );
}

function OrderTransactionDetails({
  entity,
  transaction,
  personName,
  navigate,
  isReturn,
}: {
  entity: "vendor" | "rider";
  transaction: ReturnType<typeof getFinanceDataset>["transactions"][number];
  personName: string;
  navigate: ReturnType<typeof useNavigate>;
  isReturn: boolean;
}) {
  const payout = Math.abs(transaction.amount);
  const customerName =
    transaction.customer === "-" ? "Ayan Qureshi" : transaction.customer;
  const riderName = entity === "rider" ? personName : "Rajan Kumar";
  return (
    <div style={page}>
      <style>{`
        .order-items{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
        .order-meta-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:20px}
        @media(max-width:1000px){.order-items,.order-meta-grid{grid-template-columns:1fr}}
      `}</style>
      <div style={sectionTitle}>{isReturn ? "Items - 2" : "Items - 2"}</div>

      <div className="order-items">
        <ProductCard
          image="/price-markup/product-blue-tee.png"
          quantity="15"
          title="Alone dark blue T-shirt for Gen-Z"
          size="L"
          color="Dark blue"
          price="₹499"
          mrp="₹549"
          discount="12% off"
        />
        <ProductCard
          image="/price-markup/product-red-tee.png"
          quantity="8"
          title="Red bright Anime cool T-shirt for Gen-Z"
          size="M"
          color="Red"
          price="₹1,099"
          mrp="₹1,249"
          discount="21% off"
        />
      </div>

      <div className="order-meta-grid">
        <section>
          <div style={subTitle}>Customer details</div>
          <div style={infoCard}>
            <div style={personLine}>
              <img
                src="/reference/riders/customer.jpg"
                alt="Customer"
                style={avatar}
              />
              <strong>{customerName}</strong>
              <span style={{ color: "#777", fontSize: 11 }}>(22/male)</span>
            </div>
            <div style={divider} />
            <div style={smallText}>
              <MapPin size={13} /> Shimla park, MM Valley, 5th floor, Building
              no: 502, kausa – Mumbra, Lingampalli (Telangana)– 2.8 Km
            </div>
          </div>
        </section>
        <section>
          <div style={subTitle}>Rider details</div>
          <div style={infoCard}>
            <div style={personLine}>
              <img
                src="/reference/riders/avatar.jpg"
                alt="Rider"
                style={avatar}
              />
              <strong>{riderName}</strong>
            </div>
            <div style={divider} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 11,
              }}
            >
              <span style={smallText}>
                <Phone size={13} /> +91 82347 09765
              </span>
              <span>
                ★ 4.6 <span style={{ color: "#888" }}>(116)</span>
              </span>
            </div>
          </div>
        </section>
        <section>
          <div style={subTitle}>Customer feedback</div>
          <div style={infoCard}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>
              <Star
                size={15}
                fill="#f0c400"
                color="#f0c400"
                style={{ verticalAlign: "-2px" }}
              />{" "}
              4.6<span style={{ color: "#888", fontSize: 12 }}>/5</span>
            </div>
            <div style={divider} />
            <div style={{ fontSize: 11, lineHeight: 1.45 }}>
              &quot;Absolutely loved the Blue Kurti — material is great,
              stitching is perfect and delivery was super fast! Will definitely
              order again.&quot;
            </div>
          </div>
        </section>
      </div>

      <section style={{ marginTop: 20 }}>
        <div style={subTitle}>Price details</div>
        <div style={priceCard}>
          <DetailRow label="Transaction ID" value={transaction.transactionId} />
          <DetailRow
            label="Transaction date & time"
            value="12th Mar, 05:41 PM"
          />
          <div style={divider} />
          <DetailRow label="MRP" value="₹1,589" />
          <DetailRow label="GST" value="₹50" />
          <div style={divider} />
          <DetailRow label="Total" value="₹1,709" strong />
          <DetailRow label="Platform commission" value="₹29" />
          <DetailRow
            label={entity === "rider" ? "Rider payout" : "Rider payout"}
            value="₹39"
            valueColor="#27bd60"
          />
          <DetailRow
            label={isReturn ? "Return payout" : "Your payout"}
            value={formatCurrency(payout)}
            strong
          />
        </div>
      </section>

      <button
        type="button"
        onClick={() =>
          navigate(`/admin-dashboard/finance/transactions/${entity}`)
        }
        style={backButton}
      >
        Back to transactions
      </button>
    </div>
  );
}

function ProductCard({
  image,
  quantity,
  title,
  size,
  color,
  price,
  mrp,
  discount,
}: {
  image: string;
  quantity: string;
  title: string;
  size: string;
  color: string;
  price: string;
  mrp: string;
  discount: string;
}) {
  return (
    <article style={productCard}>
      <div style={productImageWrap}>
        <img src={image} alt={title} style={productImage} />
        <span style={quantityBadge}>♧ {quantity}</span>
        <span style={leftArrow}>‹</span>
        <span style={rightArrow}>›</span>
        <span style={dots}>•••</span>
      </div>
      <div style={{ padding: "8px 0 8px 15px" }}>
        <h3 style={productTitle}>{title}</h3>
        <div style={productSpecs}>
          <span>
            <Shirt size={13} /> T-Shirt
          </span>
          <span>
            <Ruler size={13} /> {size}
          </span>
          <span>◉ {color}</span>
        </div>
        <div style={{ color: "#777", fontSize: 10, marginTop: 13 }}>
          Description:
        </div>
        <p style={{ fontSize: 10, lineHeight: 1.4, margin: "4px 0 10px" }}>
          A versatile, casual garment named for its T-shaped body and sleeves,
          typically featuring a crew neck and short sleeves without buttons or
          collars.
        </p>
        <strong style={{ fontSize: 17 }}>{price}</strong>{" "}
        <span
          style={{
            color: "#999",
            textDecoration: "line-through",
            fontSize: 10,
          }}
        >
          {mrp}
        </span>{" "}
        <span style={{ color: "#ff5d3f", fontSize: 10 }}>♧ {discount}</span>
      </div>
    </article>
  );
}

function WithdrawalTransactionDetails({
  entity,
  transaction,
  navigate,
}: {
  entity: "vendor" | "rider";
  transaction: ReturnType<typeof getFinanceDataset>["transactions"][number];
  navigate: ReturnType<typeof useNavigate>;
}) {
  const isWithdrawal = transaction.kind === "withdrawal";
  const title = isWithdrawal ? "Withdrawal ID" : "Payout ID";
  const amount = Math.abs(transaction.amount);
  const statusTitle = isWithdrawal
    ? "Withdrawal Requested"
    : "Payout Requested";
  return (
    <div style={withdrawalPage}>
      <div style={{ textAlign: "center" }}>
        <div style={moneyIcon}>💸</div>
        <div style={{ fontSize: 25, fontWeight: 900 }}>
          {formatCurrency(amount)}
        </div>
      </div>

      <section style={withdrawalCard}>
        <DetailRow label={title} value={transaction.transactionId} />
        <DetailRow label="Date & Time" value="16 Sep 2026, 11:25 AM" />
        <DetailRow label="Payment" value={transaction.bank} />
        <DetailRow label="Total" value={formatCurrency(1709)} />
        <div style={divider} />
        <DetailRow
          label={isWithdrawal ? "Withdrawal Amount" : "Payout Amount"}
          value={formatCurrency(amount)}
        />
        <DetailRow
          label={isWithdrawal ? "Withdrawal Commission" : "Payout Commission"}
          value={formatCurrency(0)}
          valueColor="#ed777d"
        />
        <DetailRow
          label="Total Amount"
          value={formatCurrency(amount)}
          valueColor="#27bd60"
          strong
        />

        <div
          style={{
            marginTop: 10,
            paddingTop: 13,
            borderTop: "1px solid #ddd9d5",
          }}
        >
          <strong style={{ fontSize: 13 }}>Timeline</strong>
          <div style={timeline}>
            <div style={timelineLine} />
            {[
              [statusTitle, "16 Sep, 11:25 AM", true],
              ["Payment Processing", "In progress", false],
              ["Transferred to Bank", "Expected: 18th Mar", false],
            ].map(([itemTitle, subtitle, active]) => (
              <div key={String(itemTitle)} style={timelineItem}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    margin: "0 auto 12px",
                    borderRadius: "50%",
                    background: active ? "#36bb65" : "#bcbcbc",
                    border: "2px solid #fff",
                    boxShadow: "0 0 0 1px #ddd",
                  }}
                />
                <strong style={{ display: "block", fontSize: 9 }}>
                  {itemTitle}
                </strong>
                <span style={{ display: "block", marginTop: 5, color: "#777" }}>
                  {subtitle}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={() =>
          navigate(`/admin-dashboard/finance/transactions/${entity}`)
        }
        style={backButton}
      >
        Back to transactions
      </button>
    </div>
  );
}

function DetailRow({
  label,
  value,
  valueColor,
  strong,
}: {
  label: string;
  value: string;
  valueColor?: string;
  strong?: boolean;
}) {
  return (
    <div style={detailRow}>
      <span>{label}</span>
      <strong
        style={{
          color: valueColor ?? "#26201b",
          fontWeight: strong ? 800 : 600,
          textAlign: "right",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

const page: React.CSSProperties = {
  color: "#26201b",
  fontFamily: "Manrope, system-ui, sans-serif",
  paddingBottom: 28,
};
const sectionTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  margin: "0 0 14px",
};
const productCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: 9,
  padding: 15,
  display: "grid",
  gridTemplateColumns: "250px minmax(0,1fr)",
  gap: 0,
  minHeight: 265,
  boxSizing: "border-box",
};
const productImageWrap: React.CSSProperties = {
  position: "relative",
  minHeight: 250,
  background: "#f3f3f3",
  borderRadius: 6,
  overflow: "hidden",
};
const productImage: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};
const quantityBadge: React.CSSProperties = {
  position: "absolute",
  right: 7,
  top: 7,
  background: "rgba(255,255,255,.9)",
  borderRadius: 4,
  padding: "4px 6px",
  fontSize: 9,
};
const leftArrow: React.CSSProperties = {
  position: "absolute",
  left: 6,
  top: "45%",
  fontSize: 30,
  color: "#666",
};
const rightArrow: React.CSSProperties = {
  position: "absolute",
  right: 6,
  top: "45%",
  fontSize: 30,
  color: "#666",
};
const dots: React.CSSProperties = {
  position: "absolute",
  bottom: 5,
  left: "50%",
  color: "#fff",
  letterSpacing: 2,
  fontSize: 12,
};
const productTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 16,
  lineHeight: 1.35,
};
const productSpecs: React.CSSProperties = {
  display: "flex",
  gap: 15,
  marginTop: 10,
  color: "#4c4742",
  fontSize: 10,
};
const infoCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: 9,
  padding: 12,
  minHeight: 105,
  boxSizing: "border-box",
};
const subTitle: React.CSSProperties = {
  margin: "0 0 10px",
  fontSize: 15,
  fontWeight: 800,
};
const personLine: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 9,
  minHeight: 42,
  fontSize: 14,
};
const avatar: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  objectFit: "cover",
};
const divider: React.CSSProperties = {
  height: 1,
  background: "#ddd9d5",
  margin: "10px 0",
};
const smallText: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 7,
  color: "#4f4a45",
  fontSize: 10,
  lineHeight: 1.4,
};
const priceCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: 9,
  padding: 15,
};
const detailRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 20,
  padding: "8px 10px",
  fontSize: 12,
};
const withdrawalPage: React.CSSProperties = {
  minHeight: "calc(100vh - 100px)",
  color: "#26201b",
  fontFamily: "Manrope, system-ui, sans-serif",
  paddingTop: 8,
};
const moneyIcon: React.CSSProperties = {
  width: 78,
  height: 78,
  margin: "0 auto 16px",
  borderRadius: 8,
  background: "#edf5ff",
  display: "grid",
  placeItems: "center",
  fontSize: 38,
};
const withdrawalCard: React.CSSProperties = {
  width: "min(600px, 100%)",
  margin: "27px auto 0",
  background: "#fff",
  borderRadius: 9,
  padding: 24,
  boxSizing: "border-box",
};
const timeline: React.CSSProperties = {
  position: "relative",
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: 14,
  marginTop: 24,
};
const timelineLine: React.CSSProperties = {
  position: "absolute",
  left: "13%",
  right: "13%",
  top: 6,
  height: 1,
  background: "#d7d2ce",
};
const timelineItem: React.CSSProperties = {
  position: "relative",
  textAlign: "center",
  fontSize: 9,
};
const backButton: React.CSSProperties = {
  display: "block",
  margin: "16px auto",
  border: 0,
  background: "transparent",
  color: "#765038",
  textDecoration: "underline",
  fontSize: 11,
  cursor: "pointer",
};
