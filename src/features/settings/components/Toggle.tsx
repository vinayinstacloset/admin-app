interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  description: string;
}

export default function Toggle({
  checked,
  onChange,
  label,
  description,
}: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        border: 0,
        background: "transparent",
        padding: "10px 0",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <span style={{ minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            color: "#26201b",
          }}
        >
          {label}
        </span>
        <span
          style={{
            display: "block",
            marginTop: 3,
            fontSize: 10,
            color: "#8a8078",
          }}
        >
          {description}
        </span>
      </span>
      <span
        aria-hidden="true"
        style={{
          position: "relative",
          flex: "0 0 auto",
          width: 44,
          height: 22,
          borderRadius: 999,
          background: checked ? "#39bd65" : "#e9edff",
          transition: "background .18s ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 25 : 3,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,.12)",
            transition: "left .18s ease",
          }}
        />
      </span>
    </button>
  );
}
