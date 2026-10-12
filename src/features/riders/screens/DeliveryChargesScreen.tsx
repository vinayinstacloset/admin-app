import { useEffect, useMemo, useState } from "react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";

const DELIVERY_TYPES = ["smart", "express", "sameDay"] as const;
type DeliveryType = (typeof DELIVERY_TYPES)[number];

type ChargeValue = string;
type Charges = Record<DeliveryType, ChargeValue[]>;

const RANGES = ["0–2 KM", "2–4 KM", "4–6 KM", "6–8 KM", "8–10 KM"];
const STORAGE_KEY = "admin-rider-delivery-charges";

const EMPTY_CHARGES: Charges = {
  smart: ["", "", "", "", ""],
  express: ["", "", "", "", ""],
  sameDay: ["", "", "", "", ""],
};

const SAMPLE_CHARGES: Charges = {
  smart: ["0", "15", "20", "", ""],
  express: ["15", "20", "25", "", ""],
  sameDay: ["20", "25", "30", "", ""],
};

function readCharges(): Charges {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return EMPTY_CHARGES;
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return EMPTY_CHARGES;

    const source = parsed as Partial<Record<DeliveryType, unknown>>;
    return DELIVERY_TYPES.reduce<Charges>((result, type) => {
      const values = Array.isArray(source[type]) ? source[type] : [];
      result[type] = RANGES.map((_, index) => {
        const value = values[index];
        return typeof value === "string" ? value : "";
      });
      return result;
    }, { ...EMPTY_CHARGES });
  } catch {
    return EMPTY_CHARGES;
  }
}

function cloneCharges(charges: Charges): Charges {
  return {
    smart: [...charges.smart],
    express: [...charges.express],
    sameDay: [...charges.sameDay],
  };
}

export default function DeliveryChargesScreen() {
  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();
  const [charges, setCharges] = useState<Charges>(() => readCharges());
  const [savedCharges, setSavedCharges] = useState<Charges>(() => readCharges());

  const hasChanges = useMemo(
    () => JSON.stringify(charges) !== JSON.stringify(savedCharges),
    [charges, savedCharges],
  );

  useEffect(() => {
    setExtraCrumbs([
      { label: "Riders", to: "/admin-dashboard/riders" },
      { label: "Delivery charges" },
    ]);
    setPageAction(null);

    return () => {
      setExtraCrumbs([]);
      setPageAction(null);
    };
  }, [setExtraCrumbs, setPageAction]);

  const updateCharge = (type: DeliveryType, index: number, value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "").slice(0, 6);
    setCharges((current) => {
      const next = cloneCharges(current);
      next[type][index] = cleaned;
      return next;
    });
  };

  const clearCharge = (type: DeliveryType, index: number) => {
    updateCharge(type, index, "");
  };

  const saveChanges = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(charges));
    } catch {
      // Keep the UI usable even when browser storage is unavailable.
    }
    setSavedCharges(cloneCharges(charges));
  };

  return (
    <div style={{ color: "#2d2925", width: "100%" }}>
      <h1
        style={{
          margin: "0 0 14px",
          fontSize: 15,
          lineHeight: 1.2,
          fontWeight: 700,
        }}
      >
        Delivery charges
      </h1>

      <section
        style={{
          background: "#fff",
          borderRadius: 10,
          padding: "16px 12px 16px",
          minHeight: 498,
          boxSizing: "border-box",
        }}
      >
        <p
          style={{
            margin: "0 0 14px",
            fontSize: 13,
            lineHeight: 1.4,
            fontWeight: 500,
          }}
        >
          Set delivery charges for kilometers range &amp; delivery type
        </p>

        <div
          aria-hidden="true"
          style={{
            width: 142,
            height: 142,
            borderRadius: "50%",
            border: "1px dashed #8a6b54",
            background: "#f6f2ef",
            margin: "20px auto 24px",
            display: "grid",
            placeItems: "center",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: "50%",
              border: "1px solid #8a6b54",
              display: "grid",
              placeItems: "center",
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#ff3852",
                display: "block",
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <div
            style={{
              minWidth: 900,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 1fr 1fr 1fr",
                alignItems: "center",
                minHeight: 35,
                background: "#f1f1ef",
                padding: "0 20px",
                boxSizing: "border-box",
              }}
            >
              <HeaderCell>KM RANGE</HeaderCell>
              <HeaderCell>SMART DELIVERY</HeaderCell>
              <HeaderCell>EXPRESS DELIVERY</HeaderCell>
              <HeaderCell>SAME-DAY DELIVERY</HeaderCell>
            </div>

            {RANGES.map((range, index) => (
              <div
                key={range}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.1fr 1fr 1fr 1fr",
                  alignItems: "center",
                  minHeight: 46,
                  padding: "0 20px",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 500 }}>{range}</div>
                <ChargeInput
                  value={charges.smart[index]}
                  onChange={(value) => updateCharge("smart", index, value)}
                  onClear={() => clearCharge("smart", index)}
                  showFree={charges.smart[index] === "0"}
                />
                <ChargeInput
                  value={charges.express[index]}
                  onChange={(value) => updateCharge("express", index, value)}
                  onClear={() => clearCharge("express", index)}
                />
                <ChargeInput
                  value={charges.sameDay[index]}
                  onChange={(value) => updateCharge("sameDay", index, value)}
                  onClear={() => clearCharge("sameDay", index)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
        <button
          type="button"
          disabled={!hasChanges}
          onClick={saveChanges}
          style={{
            height: 26,
            minWidth: 102,
            border: 0,
            borderRadius: 4,
            padding: "0 13px",
            background: hasChanges ? "#795033" : "#d7d7d7",
            color: hasChanges ? "#fff" : "#a8a8a8",
            fontSize: 9,
            fontWeight: 600,
            cursor: hasChanges ? "pointer" : "not-allowed",
          }}
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

function HeaderCell({ children }: { children: string }) {
  return (
    <div
      style={{
        fontSize: 9,
        color: "#5e5a56",
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
}

function ChargeInput({
  value,
  onChange,
  onClear,
  showFree = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  showFree?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div
        style={{
          width: 76,
          height: 27,
          border: "1px solid #a9a9a9",
          borderRadius: 4,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            width: 22,
            textAlign: "center",
            color: "#4c4946",
            fontSize: 10,
            flex: "0 0 22px",
          }}
        >
          ₹
        </span>
        <input
          aria-label="Delivery charge amount"
          inputMode="numeric"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Amount"
          style={{
            width: 39,
            minWidth: 0,
            border: 0,
            outline: 0,
            padding: 0,
            fontSize: 10,
            color: "#35312e",
            background: "transparent",
          }}
        />
        {value !== "" && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear delivery charge"
            style={{
              width: 20,
              height: 25,
              border: 0,
              background: "transparent",
              color: "#aaa",
              padding: 0,
              fontSize: 12,
              lineHeight: 1,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        )}
      </div>
      {showFree && (
        <span
          style={{
            fontSize: 9,
            color: "#ff6848",
            fontStyle: "italic",
            fontWeight: 500,
          }}
        >
          free
        </span>
      )}
    </div>
  );
}

export { EMPTY_CHARGES, SAMPLE_CHARGES };
