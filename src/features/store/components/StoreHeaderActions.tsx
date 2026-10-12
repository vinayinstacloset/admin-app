import { Download, Mail } from "lucide-react";
import { classNames } from "./StoreCommon";

export function StoreHeaderActions({
  showStoreControls = false,
  showMail = false,
  onToggle,
  onExport,
  isOpen,
}: {
  showStoreControls?: boolean;
  showMail?: boolean;
  onToggle?: () => void;
  onExport?: () => void;
  isOpen?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      {showStoreControls && (
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs font-bold text-ink">Store</p>
            <p className="text-[9px] text-ink/55">Open & Close</p>
          </div>
          <button
            type="button"
            aria-label="Toggle store status"
            onClick={onToggle}
            className={classNames(
              "relative h-6 w-11 rounded-full transition-colors",
              isOpen ? "bg-[#21bf67]" : "bg-[red]",
            )}
          >
            <span
              className={classNames(
                "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all",
                isOpen ? "left-6" : "left-1",
              )}
            />
          </button>
        </div>
      )}
      {onExport && (
        <button
          type="button"
          onClick={onExport}
          className="flex h-9 items-center gap-2 rounded-lg bg-[#0878df] px-4 text-xs font-semibold text-white hover:bg-[#066bc7]"
        >
          <Download size={14} />
          Export
        </button>
      )}
      {showMail && <Mail size={20} className="text-ink/80" />}
    </div>
  );
}

export function OrdersHeaderActions({
  isOpen,
  onToggle,
  onExport,
}: {
  isOpen: boolean;
  onToggle: () => void;
  onExport: () => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <StoreHeaderActions
        showStoreControls
        isOpen={isOpen}
        onToggle={onToggle}
      />
      <button
        type="button"
        onClick={onExport}
        className="flex h-9 items-center gap-2 rounded-lg bg-[#0878df] px-4 text-xs font-semibold text-white hover:bg-[#066bc7]"
      >
        <Download size={14} />
        Export
      </button>
    </div>
  );
}
