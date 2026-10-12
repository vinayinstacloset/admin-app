import { useEffect, useState } from "react";
import { Landmark } from "lucide-react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { useSearchParams } from "react-router-dom";
import { useFinance } from "../hooks/useFinance";
import type { BankAccount, FinanceEntity } from "../types/finance.types";
import BankModal from "../components/BankModal";
import { Modal } from "../components/FinanceModal";

export default function BankAccountsScreen() {
  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();
  const [searchParams] = useSearchParams();
  const entity: FinanceEntity =
    searchParams.get("entity") === "rider" ? "rider" : "vendor";
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<BankAccount | undefined>();
  const { banks, addBank, updateBank, deleteBank } = useFinance(entity);

  useEffect(() => {
    setExtraCrumbs([
      { label: "Finance", to: "/admin-dashboard/finance" },
      { label: "Bank accounts" },
    ]);
    setPageAction(
      <button
        type="button"
        onClick={() => {
          setSelected(undefined);
          setModal("add");
        }}
        style={addTopButton}
      >
        Add bank +
      </button>,
    );
    return () => {
      setExtraCrumbs([]);
      setPageAction(null);
    };
  }, [setExtraCrumbs, setPageAction]);

  const openEdit = (bank: BankAccount) => {
    setSelected(bank);
    setModal("edit");
  };

  return (
    <div
      style={{ color: "#26201b", fontFamily: "Manrope, system-ui, sans-serif" }}
    >
      <h2 style={{ margin: "0 0 14px", fontSize: 15 }}>
        Bank - {banks.length}
      </h2>

      {banks.length === 0 ? (
        <div style={empty}>
          <div style={bankIcon}>
            <Landmark size={39} color="#087df0" />
          </div>
          <p>Sorry! you don’t have linked bank account right now.</p>
          <button
            type="button"
            onClick={() => setModal("add")}
            style={addButton}
          >
            Add bank account
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,minmax(0,1fr))",
            gap: 20,
          }}
        >
          {banks.map((bank) => (
            <button
              key={bank.id}
              type="button"
              onClick={() => openEdit(bank)}
              style={{ ...bankCard, textAlign: "left", cursor: "pointer" }}
            >
              {bank.linked && <span style={linked}>Linked</span>}
              <div style={bankGrid}>
                <BankValue label="Bank name" value={bank.bankName} />
                <BankValue label="Account number" value={bank.accountNumber} />
                <BankValue label="GST" value={bank.gstNumber} />
              </div>
            </button>
          ))}
        </div>
      )}

      {modal === "add" && (
        <BankModal
          mode="add"
          onClose={() => setModal(null)}
          onSave={(bank) => {
            addBank(bank);
            setModal(null);
          }}
        />
      )}
      {modal === "edit" && selected && (
        <BankModal
          mode="edit"
          bank={selected}
          onClose={() => setModal(null)}
          onSave={(bank) => {
            updateBank(selected.id, bank);
            setModal(null);
          }}
          onDelete={() => setModal("delete")}
        />
      )}
      {modal === "delete" && selected && (
        <Modal onClose={() => setModal(null)} width={475}>
          <div style={{ textAlign: "center", padding: "10px 8px 4px" }}>
            <p style={{ margin: 0, fontSize: 16 }}>
              Are you sure you want to{" "}
              <strong>
                delete
                <br />“{selected.bankName}”?
              </strong>
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 15,
                marginTop: 26,
              }}
            >
              <button
                type="button"
                onClick={() => setModal(null)}
                style={cancelDelete}
              >
                No, Wait
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteBank(selected.id);
                  setModal(null);
                }}
                style={confirmDelete}
              >
                Yes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function BankValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={labelPill}>{label}</span>
      <strong style={{ display: "block", marginTop: 9, fontSize: 12 }}>
        {value}
      </strong>
    </div>
  );
}

const addTopButton: React.CSSProperties = {
  height: 31,
  padding: "0 13px",
  border: 0,
  borderRadius: 5,
  background: "#765038",
  color: "#fff",
  fontSize: 10,
  fontWeight: 700,
  cursor: "pointer",
};
const empty: React.CSSProperties = {
  minHeight: 650,
  display: "grid",
  placeItems: "center",
  alignContent: "center",
  color: "#777",
  fontSize: 10,
};
const bankIcon: React.CSSProperties = {
  width: 100,
  height: 100,
  borderRadius: "50%",
  background: "#e7f2ff",
  display: "grid",
  placeItems: "center",
};
const addButton: React.CSSProperties = {
  height: 34,
  padding: "0 14px",
  border: 0,
  borderRadius: 5,
  background: "#765038",
  color: "#fff",
  fontSize: 10,
  fontWeight: 700,
  cursor: "pointer",
};
const bankCard: React.CSSProperties = {
  minHeight: 110,
  position: "relative",
  background: "#fff",
  borderRadius: 9,
  padding: 30,
  boxSizing: "border-box",
};
const bankGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1.2fr 1fr",
  gap: 22,
  alignItems: "start",
};
const labelPill: React.CSSProperties = {
  display: "inline-block",
  padding: "3px 6px",
  background: "#e8f4ff",
  color: "#087df0",
  borderRadius: 3,
  fontSize: 9,
};
const linked: React.CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  background: "#30b85d",
  color: "#fff",
  fontSize: 8,
  padding: "3px 18px 3px 7px",
  clipPath: "polygon(0 0, 100% 0, 78% 100%, 0 100%)",
};
const cancelDelete: React.CSSProperties = {
  height: 36,
  border: "1px solid #4b4845",
  borderRadius: 5,
  background: "#fff",
  fontSize: 11,
  fontWeight: 700,
};
const confirmDelete: React.CSSProperties = {
  height: 36,
  border: 0,
  borderRadius: 5,
  background: "#ed777d",
  color: "#fff",
  fontSize: 11,
  fontWeight: 700,
};
