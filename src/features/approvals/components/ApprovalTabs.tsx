import type { ApprovalType } from "../types/approvals.types";

interface ApprovalTabsProps {
  active: "vendor" | "rider";
  counts: Record<ApprovalType, number>;
  onChange: (type: ApprovalType) => void;
}

export default function ApprovalTabs({
  active,
  counts,
  onChange,
}: ApprovalTabsProps) {
  return (
    <div className="flex items-center gap-5">
      {(["vendor", "rider"] as const).map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={`relative pb-2 text-[15px] capitalize ${
            active === type
              ? "font-bold text-brand-700"
              : "font-medium text-ink/45"
          }`}
        >
          {type}
          <span className="ml-1.5">- {counts[type]}</span>
          {active === type && (
            <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-brand-600" />
          )}
        </button>
      ))}
    </div>
  );
}
