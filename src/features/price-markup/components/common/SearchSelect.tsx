import { useCallback, useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useClickOutside } from "../../hooks/useClickOutside";
import {
  hoverStyle,
  focusStyle,
} from "../../../../shared/utils/interactiveStyle";

export interface SearchSelectOption {
  id: string;
  label: string;
  description?: string;
  image?: string;
}

interface SearchSelectProps {
  label: string;
  placeholder: string;
  query: string;
  onQueryChange: (query: string) => void;
  options: SearchSelectOption[];
  selectedLabel: string | null;
  onSelect: (id: string) => void;
  onClear: () => void;
  emptyText: string;
}

// Search box that turns into the chosen value (with a clear "x") once a
// suggestion is picked — used for "Search product" and "Search vendor".
export default function SearchSelect({
  label,
  placeholder,
  query,
  onQueryChange,
  options,
  selectedLabel,
  onSelect,
  onClear,
  emptyText,
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const close = useCallback(() => setOpen(false), []);

  useClickOutside(rootRef, close, open);

  const hasSelection = selectedLabel !== null;
  const showMenu = open && !hasSelection;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 7,
        minWidth: 0,
      }}
      ref={rootRef}
    >
      <label
        style={{ fontSize: 11.5, fontWeight: 500, color: "#3f3934" }}
        htmlFor={inputId}
      >
        {label}
      </label>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          padding: "0 12px",
          border: "1px solid #b9b5b1",
          borderRadius: 3,
          background: "#fff",
          fontSize: 11.5,
          height: 38,
        }}
        {...focusStyle(
          { borderColor: "#6d4c36", outline: 0 },
          { borderColor: "#b9b5b1", outline: "" },
        )}
      >
        <Search size={17} style={{ flex: "none", color: "#6b6560" }} />
        <input
          style={{
            flex: 1,
            minWidth: 0,
            border: 0,
            outline: 0,
            background: "transparent",
            fontStyle: "inherit",
            fontVariant: "inherit",
            fontSize: "inherit",
            lineHeight: "inherit",
            fontFamily: "inherit",
            fontWeight: 600,
            color: "#1f1a17",
          }}
          id={inputId}
          data-placeholder="pm"
          autoComplete="off"
          placeholder={placeholder}
          readOnly={hasSelection}
          value={hasSelection ? selectedLabel : query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            onQueryChange(event.target.value);
            setOpen(true);
          }}
        />
        {(hasSelection || query) && (
          <button
            type="button"
            style={{
              display: "inline-flex",
              padding: 0,
              border: 0,
              background: "transparent",
              color: "#8a8580",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
            aria-label="Clear search"
            onClick={() => {
              onClear();
              onQueryChange("");
              setOpen(false);
            }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {showMenu && (
        <ul
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 20,
            maxHeight: 220,
            margin: 0,
            padding: 4,
            overflowY: "auto",
            listStyle: "none",
            borderRadius: 6,
            background: "#fff",
            boxShadow: "0 4px 18px rgba(0, 0, 0, 0.16)",
          }}
          role="listbox"
        >
          {options.length === 0 && (
            <li
              style={{ padding: "10px 8px", fontSize: 11.5, color: "#6b6560" }}
            >
              {emptyText}
            </li>
          )}
          {options.map((option) => (
            <li key={option.id} role="presentation">
              <button
                style={{
                  fontFamily: "inherit",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: 8,
                  border: 0,
                  borderRadius: 4,
                  background: "transparent",
                  textAlign: "left",
                  fontSize: 11.5,
                  color: "#1f1a17",
                }}
                {...hoverStyle(
                  { background: "#f0ece9" },
                  { background: "transparent" },
                )}
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => {
                  onSelect(option.id);
                  setOpen(false);
                }}
              >
                {option.image && (
                  <img
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 3,
                      objectFit: "cover",
                    }}
                    src={option.image}
                    alt=""
                  />
                )}
                <span>
                  {option.label}
                  {option.description && (
                    <small
                      style={{
                        display: "block",
                        fontSize: 10,
                        color: "#6b6560",
                      }}
                    >
                      {option.description}
                    </small>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
