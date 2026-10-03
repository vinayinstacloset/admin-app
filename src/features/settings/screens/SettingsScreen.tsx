import { useEffect, useRef } from "react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { useSettings } from "../hooks/useSettings";
import { parseMoneyInput } from "../utils/settings.utils";
import Toggle from "../components/Toggle";

const page = { color: "#26201b", fontFamily: "Manrope, system-ui, sans-serif" };
const card = { background: "#fff", borderRadius: 10, padding: 16 };

export default function SettingsScreen() {
  const { setPageAction, setExtraCrumbs } = useDashboardOutletContext();
  const {
    settings,
    isDirty,
    updatePlatform,
    updateCommission,
    updateProfile,
    save,
  } = useSettings();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setExtraCrumbs([{ label: "Settings" }]);
    setPageAction(
      <button
        type="button"
        onClick={save}
        disabled={!isDirty}
        style={{
          height: 32,
          padding: "0 18px",
          border: 0,
          borderRadius: 6,
          background: isDirty ? "#765038" : "#d8d8d8",
          color: "#fff",
          fontSize: 11,
          fontWeight: 700,
          cursor: isDirty ? "pointer" : "default",
        }}
      >
        Save Changes
      </button>,
    );
    return () => {
      setPageAction(null);
      setExtraCrumbs([]);
    };
  }, [isDirty, save, setExtraCrumbs, setPageAction]);

  return (
    <div style={{ ...page, paddingBottom: 28 }}>
      <h1 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700 }}>
        Personal information
      </h1>
      <section style={{ ...card, marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            paddingBottom: 20,
            borderBottom: "1px solid #e7e2dd",
          }}
        >
          <img
            src={
              settings.profile.pictureUrl || "https://i.pravatar.cc/160?img=12"
            }
            alt="Profile"
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              objectFit: "cover",
              background: "#f3f3f3",
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            style={{
              height: 30,
              padding: "0 11px",
              border: 0,
              borderRadius: 5,
              background: "#765038",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            Change picture
          </button>
          <button
            type="button"
            onClick={() => updateProfile("pictureUrl", "")}
            style={{
              height: 30,
              padding: "0 11px",
              border: "1px solid #ef7171",
              borderRadius: 5,
              background: "#fff",
              color: "#ef7171",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            Delete picture
          </button>
          <input
            ref={fileRef}
            hidden
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) updateProfile("pictureUrl", URL.createObjectURL(file));
            }}
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: 15,
            paddingTop: 20,
          }}
        >
          <Field
            label="Full Name"
            value={settings.profile.fullName}
            onChange={(value) => updateProfile("fullName", value)}
          />
          <Field
            label="Email"
            value={settings.profile.email}
            onChange={(value) => updateProfile("email", value)}
          />
          <Field
            label="Mobile No."
            value={settings.profile.mobile}
            onChange={(value) => updateProfile("mobile", value)}
          />
        </div>
      </section>

      <div
        style={{
          display: "grid",
          //gridTemplateColumns: "minmax(0, 1fr) 385px",
          gap: 18,
          alignItems: "start",
        }}
      >
        <section>
          <h2 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>
            Platform settings
          </h2>
          <div style={{ ...card, padding: "9px 15px" }}>
            
            <Toggle
              label="Auto-approve low-risk vendors"
              description="Skip manual review for verified GST"
              checked={settings.platform.autoApproveLowRiskVendors}
              onChange={() =>
                updatePlatform(
                  "autoApproveLowRiskVendors",
                  !settings.platform.autoApproveLowRiskVendors,
                )
              }
            />
            <Toggle
              label="Send low-rating warnings"
              description="Auto-warn vendors below 3.5 stars"
              checked={settings.platform.sendLowRatingWarnings}
              onChange={() =>
                updatePlatform(
                  "sendLowRatingWarnings",
                  !settings.platform.sendLowRatingWarnings,
                )
              }
            />
            <Toggle
              label="New order notifications"
              description="Push + email alerts for admin"
              checked={settings.platform.newOrderNotifications}
              onChange={() =>
                updatePlatform(
                  "newOrderNotifications",
                  !settings.platform.newOrderNotifications,
                )
              }
            />
          </div>
        </section>
        {/* <section>
          <h2 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>
            Commission rates
          </h2>
          <div style={{ ...card, display: "grid", gap: 15 }}>
            <NumberField
              label="Default vendor commission (%)"
              value={settings.commission.defaultVendorCommission}
              onChange={(value) =>
                updateCommission(
                  "defaultVendorCommission",
                  parseMoneyInput(value),
                )
              }
            />
            <NumberField
              label="Rider payout per delivery (₹)"
              value={settings.commission.riderPayoutPerDelivery}
              onChange={(value) =>
                updateCommission(
                  "riderPayoutPerDelivery",
                  parseMoneyInput(value),
                )
              }
            />
          </div>
        </section> */}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label style={{ display: "block", minWidth: 0 }}>
      <span
        style={{
          display: "block",
          marginBottom: 9,
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: "100%",
          height: 40,
          boxSizing: "border-box",
          border: "1px solid #aaa",
          borderRadius: 5,
          padding: "0 14px",
          outline: "none",
          fontSize: 11,
          fontWeight: 600,
          color: "#26201b",
          background: "#fff",
        }}
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 600 }}>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputMode="numeric"
        style={{
          width: 60,
          height: 27,
          boxSizing: "border-box",
          border: "1px solid #aaa",
          borderRadius: 4,
          padding: "0 8px",
          outline: "none",
          textAlign: "center",
          fontSize: 10,
        }}
      />
    </label>
  );
}
