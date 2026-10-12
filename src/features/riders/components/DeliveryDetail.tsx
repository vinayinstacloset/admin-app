import { Link } from "react-router-dom";
import { Mail, Phone, Star } from "lucide-react";
import type { Delivery } from "../data/mockData";
import { riderProfile } from "../data/mockData";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";

export default function DeliveryDetail({
  delivery,
}: {
  delivery: Delivery;
  onBack: () => void;
}) {
  const isMax760 = useMediaQuery("(max-width: 760px)");
  const isLive = delivery.status === "On the way";
  return (
    <div style={{ paddingTop: 0 }}>
      <section style={{ marginBottom: 18 }}>
        {isLive ? (
          <>
            <h2 style={{ fontSize: 14, margin: "0 0 10px" }}>
              Delivery status
            </h2>
            <div
              style={{
                position: "relative",
                borderRadius: 9,
                overflow: "hidden",
                background: "#e8ece5",
                height: 275,
              }}
            >
              <iframe
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  border: 0,
                  borderRadius: 8,
                }}
                title="Delivery route"
                src="https://www.openstreetmap.org/export/embed.html?bbox=72.8100%2C19.0550%2C72.8750%2C19.0950&layer=mapnik&marker=19.0750%2C72.8420"
                loading="lazy"
              />
              <div
                style={{
                  position: "absolute",
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  border: "6px solid #fff",
                  boxShadow: "0 4px 12px #0002",
                  left: "18%",
                  top: "17%",
                  background: "#ef5038",
                }}
              >
                <span>🚚</span>
              </div>
              <div
                style={{
                  position: "absolute",
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  border: "6px solid #fff",
                  boxShadow: "0 4px 12px #0002",
                  right: "18%",
                  top: "35%",
                  background: "#66c755",
                }}
              >
                <span>⌄</span>
              </div>
              <div
                style={{
                  ...{
                    position: "absolute",
                    left: "50%",
                    bottom: 22,
                    transform: "translateX(-50%)",
                    background: "#fff",
                    borderRadius: 6,
                    boxShadow: "0 3px 12px #0002",
                    padding: "14px 22px",
                    display: "flex",
                    gap: 90,
                    alignItems: "center",
                    fontSize: 11,
                    minWidth: 240,
                  },
                  ...(isMax760 ? { gap: 25 } : {}),
                }}
              >
                <span>◷ ETA</span>
                <b style={{ fontSize: 11 }}>12:30 PM</b>
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              height: 190,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
            }}
          >
            <img
              style={{ width: 160, height: 150, objectFit: "contain" }}
              src="/reference/riders/delivered-illustration.jpg"
              alt=""
            />
            <b style={{ fontSize: 14 }}>
              Order delivered on 26th Mar, 7:50 PM!
            </b>
          </div>
        )}
      </section>
      <h2
        style={{
          fontSize: 14,
          fontWeight: 700,
          marginTop: 0,
          marginRight: 0,
          marginLeft: 0,
          marginBottom: 10,
        }}
      >
        Items <span style={{ fontWeight: 400 }}>· 2</span>
      </h2>
      <div
        style={{
          ...{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 18,
          },
          ...(isMax760 ? { gridTemplateColumns: "1fr" } : {}),
        }}
      >
        <ProductCard
          image="/reference/riders/product-blue.jpg"
          title="Alone dark blue T-shirt for Gen-Z"
          price="₹499"
          old="₹549"
          discount="12% off"
          meta="T-Shirt  ·  L  ·  Dark blue"
        />
        <ProductCard
          image="/reference/riders/product-red.jpg"
          title="Red bright Anime cool T-shirt for Gen-Z"
          price="₹1,099"
          old="₹1,249"
          discount="21% off"
          meta="T-Shirt  ·  M  ·  Red"
        />
      </div>
      <div
        style={{
          ...{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 0.75fr",
            gap: 20,
          },
          ...(isMax760 ? { gridTemplateColumns: "1fr" } : {}),
        }}
      >
        <InfoCard
          title="Customer"
          image="/reference/riders/customer.jpg"
          name="Arjun Mehta"
          subtitle="21/Female"
          email="arjunmehta@gmail.com"
          phone="8976129766"
        />
        <InfoCard
          title="Vendor"
          image="/reference/riders/vendor.jpg"
          name="A-1 Fashion"
          subtitle=""
          email="alfashionstore@gmail.com"
          phone="8259645722"
        />
        <PriceCard />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginTop: 14,
        }}
      >
        <div style={{ marginTop: 18 }}>
          <h2 style={{ fontSize: 14, margin: "0 0 9px" }}>Rider details</h2>
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: 13,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <img
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                objectFit: "cover",
              }}
              src={riderProfile.avatar}
              alt=""
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <b style={{ fontSize: 13 }}>Rajan Kumar</b>
              <span style={{ fontSize: 9 }}>
                <Phone size={12} /> {riderProfile.phone}
              </span>
            </div>
            <Link to="/admin-dashboard/riders/1">View details ›</Link>
            <span style={{ fontSize: 9 }}>
              <Star size={13} /> 4.6 (116)
            </span>
          </div>
        </div>
        {!isLive && (
          <div>
            <h2 style={{ fontSize: 14, margin: "0 0 10px" }}>
              Customer feedback
            </h2>
            <div style={{ background: "#fff", borderRadius: 8, padding: 18 }}>
              <b style={{ fontSize: 20 }}>
                <span style={{ color: "#e3c000" }}>★</span> 4
                <small style={{ fontSize: 10, color: "#555" }}>/5</small>
              </b>
              <p style={{ fontSize: 10, lineHeight: 1.45, margin: "15px 0 0" }}>
                “Absolutely loved the Blue Kurti — material is great, stitching
                is perfect and delivery was super fast! Will definitely order
                again.”
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({
  image,
  title,
  price,
  old,
  discount,
  meta,
}: {
  image: string;
  title: string;
  price: string;
  old: string;
  discount: string;
  meta: string;
}) {
  const isMax1100 = useMediaQuery("(max-width: 1100px)");
  const isMax760 = useMediaQuery("(max-width: 760px)");
  return (
    <div
      style={{
        ...{
          background: "#fff",
          borderRadius: 8,
          padding: 15,
          display: "grid",
          gridTemplateColumns: "250px 1fr",
          gap: 15,
          minHeight: 250,
        },
        ...(isMax1100 ? { gridTemplateColumns: "180px 1fr" } : {}),
        ...(isMax760 ? { gridTemplateColumns: "120px 1fr" } : {}),
      }}
    >
      <img
        style={{
          ...{ width: 250, height: 250, objectFit: "cover", borderRadius: 7 },
          ...(isMax1100 ? { width: 180, height: 180 } : {}),
          ...(isMax760 ? { width: 120, height: 120 } : {}),
        }}
        src={image}
        alt=""
      />
      <div>
        <h3 style={{ fontSize: 15, lineHeight: 1.35, margin: "5px 0 9px" }}>
          {title}
        </h3>
        <p style={{ fontSize: 11, color: "#5d5954" }}>{meta}</p>
        <p style={{ fontSize: 10, lineHeight: 1.5, color: "#65615d" }}>
          <b>Description:</b>
          <br />A versatile, casual garment named for its T-shaped body and
          sleeves, typically featuring a crew neck and short sleeves without
          buttons or collars.
        </p>
        <strong style={{ fontSize: 16 }}>{price}</strong>
        <div>
          <s style={{ fontSize: 10, color: "#999" }}>{old}</s>{" "}
          <em style={{ fontStyle: "normal", color: "#ff6545", fontSize: 10 }}>
            ♧ {discount}
          </em>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  image,
  name,
  subtitle,
  email,
  phone,
}: {
  title: string;
  image: string;
  name: string;
  subtitle: string;
  email: string;
  phone: string;
}) {
  return (
    <div>
      <h2>{title}</h2>
      <div style={{ background: "#fff", borderRadius: 8, padding: 13 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            style={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              objectFit: "cover",
            }}
            src={image}
            alt=""
          />
          <b style={{ fontSize: 12 }}>
            {name}{" "}
            {subtitle && (
              <small style={{ fontWeight: 400, color: "#777" }}>
                ({subtitle})
              </small>
            )}
          </b>
          <a style={{ marginLeft: "auto", color: "#1678ca", fontSize: 9 }}>
            View details›
          </a>
        </div>
        <div
          style={{
            borderTop: "1px solid #ddd",
            marginTop: 10,
            paddingTop: 9,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 9,
          }}
        >
          <span>
            <Mail size={12} /> {email}
          </span>
          <span>
            <Phone size={12} /> {phone}
          </span>
        </div>
      </div>
    </div>
  );
}

function PriceCard() {
  return (
    <div>
      <h2>Price details</h2>
      <div style={{ background: "#fff", borderRadius: 8, padding: 13 }}>
        <p
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
          }}
        >
          MRP <b>₹1,589</b>
        </p>
        <p
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
          }}
        >
          GST <b>₹50</b>
        </p>
        <hr
          style={{
            borderRight: 0,
            borderBottom: 0,
            borderLeft: 0,
            borderTop: "1px solid #ddd",
          }}
        />
        <p
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
          }}
        >
          Total <b>₹1,709</b>
        </p>
        <hr
          style={{
            borderRight: 0,
            borderBottom: 0,
            borderLeft: 0,
            borderTop: "1px solid #ddd",
          }}
        />
        <p
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
          }}
        >
          Vendor payout <b style={{ color: "#ff6c6c" }}>₹1,641</b>
        </p>
        <p
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
          }}
        >
          Rider payout <b style={{ color: "#ff6c6c" }}>₹39</b>
        </p>
        <p
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
          }}
        >
          Platform commission <b style={{ color: "#2ab86b" }}>₹29</b>
        </p>
      </div>
    </div>
  );
}
