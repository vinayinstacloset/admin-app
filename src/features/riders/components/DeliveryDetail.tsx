import { Link } from "react-router-dom";
import { Mail, Phone, Star } from "lucide-react";
import type { Delivery } from "../data/mockData";
import { riderProfile } from "../data/mockData";

export default function DeliveryDetail({
  delivery,
}: {
  delivery: Delivery;
  onBack: () => void;
}) {
  const isLive = delivery.status === "On the way";
  return (
    <div className="rider-order-page">
      <section className="delivery-status-section">
        {isLive ? (
          <>
            <h2>Delivery status</h2>
            <div className="real-map detail-map">
              <iframe
                title="Delivery route"
                src="https://www.openstreetmap.org/export/embed.html?bbox=72.8100%2C19.0550%2C72.8750%2C19.0950&layer=mapnik&marker=19.0750%2C72.8420"
                loading="lazy"
              />
              <div className="map-route-marker truck">
                <span>🚚</span>
              </div>
              <div className="map-route-marker destination">
                <span>⌄</span>
              </div>
              <div className="map-eta">
                <span>◷ ETA</span>
                <b>12:30 PM</b>
              </div>
            </div>
          </>
        ) : (
          <div className="delivered-state">
            <img src="/reference/riders/delivered-illustration.jpg" alt="" />
            <b>Order delivered on 26th Mar, 7:50 PM!</b>
          </div>
        )}
      </section>
      <h2 className="section-title">
        Items <span>· 2</span>
      </h2>
      <div className="product-grid">
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
      <div className="detail-three">
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
      <div className="detail-bottom-grid">
        <div className="rider-mini-detail">
          <h2>Rider details</h2>
          <div className="rider-person-card">
            <img src={riderProfile.avatar} alt="" />
            <div>
              <b>Rajan Kumar</b>
              <span>
                <Phone size={12} /> {riderProfile.phone}
              </span>
            </div>
            <Link to="/admin-dashboard/riders/1">View details ›</Link>
            <span>
              <Star size={13} /> 4.6 (116)
            </span>
          </div>
        </div>
        {!isLive && (
          <div className="feedback-card-wrap">
            <h2>Customer feedback</h2>
            <div className="feedback-card">
              <b>
                ★ 4<small>/5</small>
              </b>
              <p>
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
  return (
    <div className="product-card">
      <img src={image} alt="" />
      <div>
        <h3>{title}</h3>
        <p className="product-meta">{meta}</p>
        <p className="description">
          <b>Description:</b>
          <br />A versatile, casual garment named for its T-shaped body and
          sleeves, typically featuring a crew neck and short sleeves without
          buttons or collars.
        </p>
        <strong>{price}</strong>
        <div>
          <s>{old}</s> <em>♧ {discount}</em>
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
      <div className="info-card">
        <div className="info-main">
          <img src={image} alt="" />
          <b>
            {name} {subtitle && <small>({subtitle})</small>}
          </b>
          <a>View details›</a>
        </div>
        <div className="info-contact">
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
      <div className="price-card">
        <p>
          MRP <b>₹1,589</b>
        </p>
        <p>
          GST <b>₹50</b>
        </p>
        <hr />
        <p>
          Total <b>₹1,709</b>
        </p>
        <hr />
        <p>
          Vendor payout <b className="red">₹1,641</b>
        </p>
        <p>
          Rider payout <b className="red">₹39</b>
        </p>
        <p>
          Platform commission <b className="green">₹29</b>
        </p>
      </div>
    </div>
  );
}
