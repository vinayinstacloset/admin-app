import { Coins, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { hoverStyle } from "../../../shared/utils/interactiveStyle";

const STORAGE_KEY = "admin-signup-bonus-coins";

type SuccessMode = "created" | "updated";

export default function BonusTab() {
  const [savedCoins, setSavedCoins] = useState("");
  const [coins, setCoins] = useState("");
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState<SuccessMode | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) ?? "";
    setSavedCoins(stored);
    setCoins(stored);
  }, []);

  const hasSavedValue = Boolean(savedCoins);
  const isEditable = !hasSavedValue || editing;
  const hasChanges = coins !== savedCoins;
  const canSubmit = Boolean(coins) && Number(coins) > 0 && hasChanges;

  const save = () => {
    if (!canSubmit) return;
    window.localStorage.setItem(STORAGE_KEY, coins);
    setSavedCoins(coins);
    setEditing(false);
    setSuccess(hasSavedValue ? "updated" : "created");
  };

  const startEditing = () => {
    setCoins(savedCoins);
    setEditing(true);
  };

  return (
    <>
      <div style={card}>
        <img
          src="/offer-coupon/signup-bonus.jpg"
          alt="New user bonus"
          style={{
            width: 230,
            height: 130,
            objectFit: "contain",
            marginTop: 3,
          }}
        />
        <p style={description}>
          Enter signup bonus for our new instacloset user. Each coin value will
          be 1 rupee.
        </p>

        <div style={valueRow}>
          <div style={bonusFieldWrap}>
            <Coins size={22} color="#ffad22" style={coinIcon} />
            <input
              aria-label="Signup bonus coins"
              type="text"
              inputMode="numeric"
              value={coins}
              disabled={!isEditable}
              onChange={(event) =>
                setCoins(event.target.value.replace(/\D/g, ""))
              }
              placeholder="Enter coins"
              style={{
                ...bonusField,
                color: coins ? "#27231f" : "#b4b1ae",
                fontWeight: coins ? 700 : 500,
                cursor: isEditable ? "text" : "default",
              }}
            />
            {isEditable && coins && (
              <button
                type="button"
                aria-label="Clear coins"
                onClick={() => setCoins("")}
                style={clearBonusButton}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {hasSavedValue && !editing && (
            <button
              type="button"
              aria-label="Edit signup bonus"
              onClick={startEditing}
              style={editButton}
            >
              <Pencil size={16} />
            </button>
          )}
        </div>
      </div>

      <div style={footer}>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={save}
          style={{
            ...saveButton,
            ...(!canSubmit ? disabledButton : {}),
          }}
          {...hoverStyle(
            { background: "#694831" },
            { background: "#76523b" },
            true,
          )}
        >
          {hasSavedValue ? "Update" : "Save"}
        </button>
      </div>

      {success && (
        <BonusSuccessModal
          mode={success}
          coins={coins}
          onClose={() => setSuccess(null)}
        />
      )}
    </>
  );
}

const card: CSSProperties = {
  background: "#fff",
  minHeight: 260,
  borderRadius: 9,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
};

const description: CSSProperties = {
  margin: "0 0 20px",
  fontSize: 12.5,
  color: "#27231f",
};

const valueRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

const bonusFieldWrap: CSSProperties = {
  position: "relative",
  width: 160,
  height: 40,
};

const coinIcon: CSSProperties = {
  position: "absolute",
  left: 13,
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
};

const bonusField: CSSProperties = {
  width: "100%",
  height: "100%",
  boxSizing: "border-box",
  border: 0,
  borderRadius: 5,
  background: "#f1f0ee",
  padding: "0 34px 0 42px",
  fontSize: 16,
  outline: "none",
  fontFamily: "inherit",
  textAlign: "left",
};

const clearBonusButton: CSSProperties = {
  position: "absolute",
  right: 8,
  top: "50%",
  transform: "translateY(-50%)",
  border: 0,
  background: "transparent",
  color: "#aaa",
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
  padding: 0,
};

const editButton: CSSProperties = {
  width: 26,
  height: 26,
  border: 0,
  background: "transparent",
  color: "#514b47",
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
  padding: 0,
};

const footer: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  minHeight: 52,
};

const saveButton: CSSProperties = {
  height: 36,
  padding: "0 18px",
  border: 0,
  borderRadius: 5,
  background: "#76523b",
  color: "#fff",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
};

const disabledButton: CSSProperties = {
  background: "#d9d9d9",
  color: "#aaa",
  cursor: "not-allowed",
};

function BonusSuccessModal({
  mode,
  coins,
  onClose,
}: {
  mode: SuccessMode;
  coins: string;
  onClose: () => void;
}) {
  const message =
    mode === "created"
      ? `${coins} coins bonus for new instacloset user!`
      : "Signup Bonus updated!";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,.23)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "min(475px, calc(100vw - 32px))",
          height: 132,
          background: "#fff",
          borderRadius: 9,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            right: 16,
            top: 16,
            border: 0,
            background: "transparent",
            cursor: "pointer",
            color: "#777",
          }}
        >
          <X size={22} />
        </button>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 39,
              height: 39,
              border: "2px solid #2fc56c",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 14px",
            }}
          >
            <span style={{ color: "#2fc56c", fontSize: 25, lineHeight: 1 }}>
              ✓
            </span>
          </div>
          <div style={{ fontSize: 15, color: "#1f1b18" }}>{message}</div>
        </div>
      </div>
    </div>
  );
}
