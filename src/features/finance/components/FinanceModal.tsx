import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ChevronDown, CreditCard, Landmark, X } from "lucide-react";
import type { BankAccount, PayoutFrequency } from "../types/finance.types";
import { formatCurrency } from "../utils/finance.utils";

const brown = "#765038";
const blue = "#0b7df0";

interface ModalProps {
  children: ReactNode;
  width?: number;
  onClose: () => void;
}

export function Modal({ children, width = 405, onClose }: ModalProps) {
  return (
    <div style={overlay}>
      <div style={{ ...modal, width: `min(${width}px, calc(100vw - 28px))` }}>
        {children}
      </div>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        style={backdropButton}
      />
    </div>
  );
}

export function AddBalanceModal({
  onClose,
  onContinue,
}: {
  onClose: () => void;
  onContinue: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("");
  const value = Number(amount.replace(/,/g, ""));
  const valid = Number.isFinite(value) && value > 0 && value <= 300000;

  return (
    <Modal onClose={onClose}>
      <h2 style={modalTitle}>Add Balance</h2>
      <p style={modalDescription}>
        Add money into your wallet so that payout will go easily to our user
      </p>
      <div style={divider} />
      <div style={amountBox}>
        <span style={{ color: blue, fontSize: 22, fontWeight: 800 }}>₹</span>
        <input
          autoFocus
          value={
            amount
              ? Number(amount.replace(/,/g, "")).toLocaleString("en-IN")
              : ""
          }
          onChange={(event) =>
            setAmount(event.target.value.replace(/[^0-9]/g, "").slice(0, 6))
          }
          placeholder="Enter Amount"
          inputMode="numeric"
          style={amountInput}
        />
      </div>
      <div style={limitText}>Maximum at a time: ₹3,00,000</div>
      <ModalButtons
        onCancel={onClose}
        primary="Continue"
        primaryDisabled={!valid}
        onPrimary={() => onContinue(value)}
      />
    </Modal>
  );
}

export function PaymentModal({
  amount,
  banks,
  onClose,
  onSuccess,
  onError,
}: {
  amount: number;
  banks: BankAccount[];
  onClose: () => void;
  onSuccess: () => void;
  onError?: () => void;
}) {
  const [method, setMethod] = useState<"bank" | "card">("bank");
  const [bankId, setBankId] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });

  const valid =
    method === "bank"
      ? Boolean(bankId)
      : card.number.replace(/\s/g, "").length >= 12 &&
        card.expiry.length >= 4 &&
        card.cvv.length >= 3;

  return (
    <Modal onClose={onClose}>
      <div style={modalHeader}>
        <ArrowLeft size={17} />
        <div>
          <h2 style={modalTitle}>Payment methods</h2>
          <p style={modalDescription}>Select your payment method</p>
        </div>
        <strong style={{ marginLeft: "auto", fontSize: 12 }}>
          {formatCurrency(amount)}
        </strong>
      </div>
      <div style={divider} />

      <button
        type="button"
        onClick={() => setMethod("bank")}
        style={methodHeader}
      >
        <Landmark size={16} color={blue} />
        <strong>Bank Transfer</strong>
        <ChevronDown
          size={15}
          style={{
            marginLeft: "auto",
            transform: method === "bank" ? "rotate(180deg)" : undefined,
          }}
        />
      </button>
      {method === "bank" && (
        <div style={{ display: "grid", gap: 8, padding: "0 0 18px" }}>
          {banks.length === 0 ? (
            <div style={emptyPayment}>No linked bank accounts.</div>
          ) : (
            banks.map((bank) => (
              <label key={bank.id} style={bankChoice}>
                <input
                  type="radio"
                  checked={bankId === bank.id}
                  onChange={() => setBankId(bank.id)}
                />
                <span>
                  {bank.bankName}{" "}
                  {bank.accountNumber.replace(/\d(?=\d{4})/g, "•")}
                </span>
              </label>
            ))
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setMethod("card")}
        style={{ ...methodHeader, borderTop: "1px solid #dedede" }}
      >
        <CreditCard size={16} color={blue} />
        <strong>Credit/Debit Card</strong>
        <ChevronDown
          size={15}
          style={{
            marginLeft: "auto",
            transform: method === "card" ? "rotate(180deg)" : undefined,
          }}
        />
      </button>
      {method === "card" && (
        <div style={{ display: "grid", gap: 10, padding: "10px 6px 18px" }}>
          <input
            placeholder="Card Number"
            value={card.number}
            onChange={(event) =>
              setCard({
                ...card,
                number: event.target.value.replace(/[^0-9 ]/g, "").slice(0, 19),
              })
            }
            style={input}
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <input
              placeholder="Valid Thru(MM/YY)"
              value={card.expiry}
              onChange={(event) =>
                setCard({
                  ...card,
                  expiry: event.target.value
                    .replace(/[^0-9/]/g, "")
                    .slice(0, 5),
                })
              }
              style={input}
            />
            <input
              placeholder="CVV"
              value={card.cvv}
              onChange={(event) =>
                setCard({
                  ...card,
                  cvv: event.target.value.replace(/\D/g, "").slice(0, 4),
                })
              }
              style={input}
            />
          </div>
        </div>
      )}
      <ModalButtons
        onCancel={onClose}
        primary="Pay"
        primaryDisabled={!valid}
        onPrimary={() => {
          if (method === "card" && amount > 100000) {
            onError?.();
            return;
          }
          onSuccess();
        }}
      />
    </Modal>
  );
}

export function SuccessModal({
  amount,
  onClose,
}: {
  amount: number;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose} width={475}>
      <div style={{ textAlign: "center", padding: "18px 12px 14px" }}>
        <div style={successCircle}>✓</div>
        <p
          style={{
            margin: "20px auto 0",
            fontSize: 17,
            lineHeight: 1.45,
            maxWidth: 350,
          }}
        >
          <strong>{formatCurrency(amount)}</strong> successfully added into your
          instacloset wallet.
        </p>
        <button
          type="button"
          onClick={onClose}
          style={{ ...closeIcon, top: 12, right: 12 }}
        >
          <X size={20} />
        </button>
      </div>
    </Modal>
  );
}

export function ErrorModal({
  onClose,
  onRetry,
}: {
  onClose: () => void;
  onRetry: () => void;
}) {
  return (
    <Modal onClose={onClose} width={475}>
      <div style={{ textAlign: "center", padding: "18px 12px 14px" }}>
        <div style={errorCircle}>!</div>
        <p style={{ margin: "22px auto 0", fontSize: 16, lineHeight: 1.45 }}>
          Sorry! your card doesn’t have enough balance.
        </p>
        <button type="button" onClick={onRetry} style={retryButton}>
          Try again
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{ ...closeIcon, top: 12, right: 12 }}
        >
          <X size={20} />
        </button>
      </div>
    </Modal>
  );
}

export function PayoutSettingsModal({
  frequency,
  onClose,
  onSave,
}: {
  frequency: PayoutFrequency;
  onClose: () => void;
  onSave: (value: PayoutFrequency) => void;
}) {
  const [value, setValue] = useState(frequency);
  const [frequencyOpen, setFrequencyOpen] = useState(false);
  return (
    <Modal onClose={onClose} width={405}>
      <h2 style={modalTitle}>Payout settings</h2>
      <div style={divider} />
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 700,
          color: "#68605a",
        }}
      >
        Payout frequency
        <div style={{ position: "relative", marginTop: 10 }}>
          <button
            type="button"
            onClick={() => setFrequencyOpen((open) => !open)}
            style={{
              ...input,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {value}
            <ChevronDown
              size={15}
              style={{
                transform: frequencyOpen ? "rotate(180deg)" : undefined,
              }}
            />
          </button>
          {frequencyOpen && (
            <div style={frequencyMenu}>
              {(["Weekly", "Monthly"] as PayoutFrequency[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setValue(item);
                    setFrequencyOpen(false);
                  }}
                  style={{
                    ...frequencyOption,
                    background: item === value ? "#ece8e5" : "#fff",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </label>
      <ModalButtons
        onCancel={onClose}
        primary="Save"
        primaryDisabled={value === frequency}
        onPrimary={() => onSave(value)}
      />
    </Modal>
  );
}

function ModalButtons({
  onCancel,
  primary,
  primaryDisabled,
  onPrimary,
}: {
  onCancel: () => void;
  primary: string;
  primaryDisabled: boolean;
  onPrimary: () => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 9,
        marginTop: 24,
      }}
    >
      <button type="button" onClick={onCancel} style={secondaryButton}>
        {primary === "Save" ? "Discard" : "Discard"}
      </button>
      <button
        type="button"
        disabled={primaryDisabled}
        onClick={onPrimary}
        style={{
          ...primaryButton,
          background: primaryDisabled ? "#d8d8d8" : brown,
          cursor: primaryDisabled ? "default" : "pointer",
        }}
      >
        {primary}
      </button>
    </div>
  );
}

export const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 100,
  display: "grid",
  placeItems: "center",
  background: "rgba(38,32,27,.25)",
  padding: 14,
};
export const modal: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  background: "#fff",
  borderRadius: 14,
  padding: 20,
  boxSizing: "border-box",
  boxShadow: "0 18px 50px rgba(0,0,0,.12)",
};
export const backdropButton: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  border: 0,
  background: "transparent",
};
export const modalTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 16,
  fontWeight: 800,
  color: "#26201b",
};
export const modalDescription: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: 10,
  color: "#716961",
};
export const divider: React.CSSProperties = {
  height: 1,
  background: "#ded9d4",
  margin: "11px 0 20px",
};
export const input: React.CSSProperties = {
  width: "100%",
  height: 36,
  boxSizing: "border-box",
  border: "1px solid #9f9a95",
  borderRadius: 3,
  padding: "0 13px",
  outline: "none",
  fontSize: 11,
  color: "#26201b",
  background: "#fff",
};
const amountInput: React.CSSProperties = {
  width: "100%",
  border: 0,
  outline: 0,
  background: "transparent",
  color: blue,
  fontSize: 22,
  fontWeight: 800,
  textAlign: "center",
};
const amountBox: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  height: 60,
  background: "#eef5fd",
  borderRadius: 4,
  margin: "40px 45px 8px",
};
const limitText: React.CSSProperties = {
  textAlign: "center",
  fontSize: 9,
  color: "#6c6762",
};
const secondaryButton: React.CSSProperties = {
  height: 36,
  border: "1px solid #4e4a47",
  borderRadius: 5,
  background: "#fff",
  color: "#59534e",
  fontSize: 11,
  fontWeight: 700,
};
const primaryButton: React.CSSProperties = {
  height: 36,
  border: 0,
  borderRadius: 5,
  color: "#fff",
  fontSize: 11,
  fontWeight: 700,
};
const modalHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
};
const methodHeader: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 8,
  border: 0,
  background: "#fff",
  padding: "4px 0 12px",
  textAlign: "left",
  fontSize: 11,
};
const bankChoice: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: "#f3f3f1",
  borderRadius: 4,
  padding: "13px 12px",
  fontSize: 10,
  fontWeight: 700,
  cursor: "pointer",
};
const emptyPayment: React.CSSProperties = {
  padding: 14,
  background: "#f6f6f6",
  fontSize: 10,
  color: "#777",
};
const successCircle: React.CSSProperties = {
  width: 40,
  height: 40,
  margin: "0 auto",
  border: "2px solid #31bf67",
  borderRadius: "50%",
  color: "#31bf67",
  display: "grid",
  placeItems: "center",
  fontSize: 25,
};
const errorCircle: React.CSSProperties = {
  width: 40,
  height: 40,
  margin: "0 auto",
  border: "2px solid #ed777d",
  borderRadius: "50%",
  color: "#ed777d",
  display: "grid",
  placeItems: "center",
  fontSize: 25,
  fontWeight: 800,
};
const frequencyMenu: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  top: 40,
  zIndex: 30,
  background: "#fff",
  border: "1px solid #e2ddd8",
  borderRadius: 5,
  padding: 4,
  boxShadow: "0 5px 16px rgba(0,0,0,.14)",
};
const frequencyOption: React.CSSProperties = {
  width: "100%",
  height: 30,
  border: 0,
  borderRadius: 3,
  background: "#fff",
  textAlign: "left",
  padding: "0 9px",
  fontSize: 10,
  cursor: "pointer",
  color: "#514b47",
};
const retryButton: React.CSSProperties = {
  marginTop: 10,
  border: 0,
  background: "transparent",
  color: "#087df0",
  textDecoration: "underline",
  fontSize: 13,
  cursor: "pointer",
};
const closeIcon: React.CSSProperties = {
  position: "absolute",
  border: 0,
  background: "transparent",
  color: "#777",
  cursor: "pointer",
};
