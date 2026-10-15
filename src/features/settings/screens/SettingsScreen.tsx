import { useEffect, useRef } from "react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { useSettings } from "../hooks/useSettings";
import Toggle from "../components/Toggle";

const page: React.CSSProperties = {
  color: "#26201b",
  fontFamily: "Manrope, system-ui, sans-serif",
  paddingBottom: 28,
};

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 10,
  padding: 16,
};

export default function SettingsScreen() {
  const { setPageAction, setExtraCrumbs } = useDashboardOutletContext();

  const { settings, isDirty, updatePlatform, updateProfile, save } =
    useSettings();

  const fileRef = useRef<HTMLInputElement>(null);

  const saveRef = useRef(save);
  const isDirtyRef = useRef(isDirty);

  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  useEffect(() => {
    setExtraCrumbs([{ label: "Settings" }]);

    const saveButton = (
      <SaveChangesButton saveRef={saveRef} isDirtyRef={isDirtyRef} />
    );

    setPageAction(saveButton);

    return () => {
      setPageAction(null);
      setExtraCrumbs([]);
    };
  }, [setExtraCrumbs, setPageAction]);

  return (
    <div style={page}>
      <style>{`
        .settings-main-grid {
          display: grid;
          gap: 18px;
          align-items: start;
        }

        .settings-profile-fields {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
          padding-top: 20px;
        }

        .delivery-header {
          display: grid;
          grid-template-columns: 1fr 150px;
          padding: 9px 19px;
          background: #f0f0ee;
          font-size: 9px;
          color: #625d58;
        }

        .delivery-row {
          display: grid;
          grid-template-columns: 1fr 150px;
          align-items: center;
          min-height: 46px;
          padding: 0 19px;
          font-size: 11px;
        }

        @media (max-width: 900px) {
          .settings-main-grid {
            grid-template-columns: 1fr;
          }

          .settings-profile-fields {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .delivery-header,
          .delivery-row {
            grid-template-columns: 1fr 125px;
          }

          .settings-picture-actions {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <h1
        style={{
          margin: "0 0 18px",
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        Personal information
      </h1>

      <section
        style={{
          ...card,
          marginBottom: 20,
        }}
      >
        <div
          className="settings-picture-actions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            paddingBottom: 20,
            borderBottom: "1px solid #e7e2dd",
          }}
        >
          <img
            src={
              settings.profile.pictureUrl ||
              "https://picsum.photos/seed/admin-profile/64/64"
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
            style={brownButton}
          >
            Change picture
          </button>

          <button
            type="button"
            onClick={() => updateProfile("pictureUrl", "")}
            style={deleteButton}
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

              if (file) {
                updateProfile("pictureUrl", URL.createObjectURL(file));
              }
            }}
          />
        </div>

        <div className="settings-profile-fields">
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

      <div className="settings-main-grid">
        <section>
          <h2 style={sectionTitle}>Platform settings</h2>

          <div
            style={{
              ...card,
              padding: "9px 15px",
            }}
          >
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
      </div>
    </div>
  );
}

function SaveChangesButton({
  saveRef,
  isDirtyRef,
}: {
  saveRef: React.MutableRefObject<() => void>;
  isDirtyRef: React.MutableRefObject<boolean>;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;

    if (!button) {
      return;
    }

    const updateButton = () => {
      const dirty = isDirtyRef.current;

      button.disabled = !dirty;
      button.style.background = dirty ? "#765038" : "#d8d8d8";
      button.style.cursor = dirty ? "pointer" : "default";
    };

    updateButton();

    const interval = window.setInterval(updateButton, 100);

    return () => {
      window.clearInterval(interval);
    };
  }, [isDirtyRef]);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={() => saveRef.current()}
      style={{
        height: 32,
        padding: "0 18px",
        border: 0,
        borderRadius: 6,
        background: "#d8d8d8",
        color: "#fff",
        fontSize: 11,
        fontWeight: 700,
        cursor: "default",
        transition: "none",
      }}
    >
      Save Changes
    </button>
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
    <label
      style={{
        display: "block",
        minWidth: 0,
      }}
    >
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

const sectionTitle: React.CSSProperties = {
  margin: "0 0 14px",
  fontSize: 15,
  fontWeight: 700,
};

const brownButton: React.CSSProperties = {
  height: 30,
  padding: "0 11px",
  border: 0,
  borderRadius: 5,
  background: "#765038",
  color: "#fff",
  fontSize: 11,
  fontWeight: 700,
  cursor: "pointer",
};

const deleteButton: React.CSSProperties = {
  height: 30,
  padding: "0 11px",
  border: "1px solid #ef7171",
  borderRadius: 5,
  background: "#fff",
  color: "#ef7171",
  fontSize: 11,
  fontWeight: 700,
  cursor: "pointer",
};
