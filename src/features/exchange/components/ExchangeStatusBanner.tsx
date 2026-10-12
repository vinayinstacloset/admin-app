import { CheckCircle2, Clock3 } from "lucide-react";
import type { ExchangeStatus } from "../types/exchange.types";

export default function ExchangeStatusBanner({
  status,
  onTrack,
}: {
  status: ExchangeStatus;
  onTrack?: () => void;
}) {
  if (status === "New") return null;
  const config: Record<
    Exclude<ExchangeStatus, "New">,
    { icon: string; text: string; tone: string }
  > = {
    Approved: {
      icon: "☑",
      text: "Wait for vendor to perform ready for delivery action.",
      tone: "text-ink",
    },
    Ready: {
      icon: "🚴",
      text: "Currently, No rider accepted the delivery. Wait for rider to accept the delivery.",
      tone: "text-ink",
    },
    "On the way": {
      icon: "🚚",
      text: "Rider is on the way. See where he is reached",
      tone: "text-ink",
    },
    Exchanged: {
      icon: "📦",
      text: "Order exchanged on 26th Mar, 7:50 PM!",
      tone: "text-ink",
    },
    Rejected: { icon: "", text: "", tone: "text-ink" },
  };
  const item = config[status];
  if (status === "Rejected") return null;
  return (
    <div className="mb-3 flex flex-col items-center justify-center py-1 text-center">
      <div className="text-[65px] leading-none">{item.icon}</div>
      <p className={`mt-1 text-[11px] ${item.tone}`}>{item.text}</p>
      {status === "On the way" && onTrack && (
        <button
          type="button"
          onClick={onTrack}
          className="mt-1 text-[10px] text-blue-600 underline"
        >
          Track rider location
        </button>
      )}
      {status === "Approved" && <CheckCircle2 size={0} className="hidden" />}
      {status === "Ready" && <Clock3 size={0} className="hidden" />}
    </div>
  );
}
