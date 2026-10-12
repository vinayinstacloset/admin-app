import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import type { BankAccount } from "../types/finance.types";
import { Modal, divider, input, modalTitle } from "./FinanceModal";

export default function BankModal({
  mode,
  bank,
  onClose,
  onSave,
  onDelete,
}: {
  mode: "add" | "edit";
  bank?: BankAccount;
  onClose: () => void;
  onSave: (bank: Omit<BankAccount, "id">) => void;
  onDelete?: () => void;
}) {
  const [bankName, setBankName] = useState(bank?.bankName ?? "");
  const [accountNumber, setAccountNumber] = useState(bank?.accountNumber ?? "");
  const [gstNumber, setGstNumber] = useState(bank?.gstNumber ?? "");
  const [linked, setLinked] = useState(bank?.linked ?? false);

  const valid = Boolean(
    bankName.trim() &&
    accountNumber.replace(/\s/g, "").length >= 8 &&
    gstNumber.trim(),
  );

  return (
    <Modal onClose={onClose} width={405}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={modalTitle}>{mode === "add" ? "Add Bank" : "Edit Bank"}</h2>
        {mode === "edit" && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            style={{
              border: 0,
              background: "#fff0f0",
              color: "#ed777d",
              width: 34,
              height: 34,
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <div style={divider} />
      <BankField
        label="Bank name"
        value={bankName}
        placeholder="Enter bank name"
        onChange={setBankName}
      />
      <BankField
        label="Account number"
        value={accountNumber}
        placeholder="Enter account number"
        onChange={setAccountNumber}
      />
      <BankField
        label="GST number"
        value={gstNumber}
        placeholder="Enter GST number"
        onChange={setGstNumber}
      />
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 14,
          fontSize: 10,
          color: "#514b47",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={linked}
          onChange={(e) => setLinked(e.target.checked)}
        />
        Link this bank with Instacloset.
      </label>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 9,
          marginTop: 24,
        }}
      >
        <button type="button" onClick={onClose} style={secondaryButton}>
          {mode === "edit" ? "Cancel" : "Discard"}
        </button>
        <button
          type="button"
          disabled={!valid}
          onClick={() =>
            onSave({
              bankName: bankName.trim(),
              accountNumber: accountNumber.trim(),
              gstNumber: gstNumber.trim(),
              linked,
            })
          }
          style={{
            ...primaryButton,
            background: valid ? "#765038" : "#d8d8d8",
            cursor: valid ? "pointer" : "default",
          }}
        >
          {mode === "edit" ? "Update" : "Save"}
        </button>
      </div>
    </Modal>
  );
}

function BankField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label style={{ display: "block", marginBottom: 17 }}>
      <span
        style={{
          display: "block",
          marginBottom: 9,
          fontSize: 10,
          fontWeight: 700,
          color: "#68605a",
        }}
      >
        {label}
      </span>
      <div style={{ position: "relative" }}>
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={input}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            style={{
              position: "absolute",
              right: 8,
              top: 8,
              border: 0,
              background: "transparent",
              color: "#aaa",
              cursor: "pointer",
            }}
          >
            <X size={15} />
          </button>
        )}
      </div>
    </label>
  );
}

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
