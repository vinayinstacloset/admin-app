import { Check, X } from "lucide-react";
import { useState } from "react";
import type { IntegrationItem } from "../types/catalogue.types";
import { integrationLabel } from "../utils/catalogue.utils";

export function ApproveModal({
  item,
  onClose,
  onConfirm,
}: {
  item: IntegrationItem;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/30 p-4 backdrop-blur-[1px]">
      <div className="relative w-full max-w-[535px] rounded-xl bg-white px-6 py-7 text-center shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-ink/50 hover:text-ink"
        >
          <X size={21} />
        </button>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#28bd62] text-[#28bd62]">
          <Check size={28} />
        </div>
        <p className="mt-5 text-[16px] text-ink">
          <strong>“{item.name}”</strong> {integrationLabel(item.entityType)}{" "}
          approved!
        </p>
        <button type="button" onClick={onConfirm} className="mt-5 hidden">
          Confirm
        </button>
      </div>
    </div>
  );
}

export function RejectModal({
  item,
  onClose,
  onConfirm,
}: {
  item: IntegrationItem;
  onClose: () => void;
  onConfirm: (message: string) => void;
}) {
  const [message, setMessage] = useState("");
  const quick = ["Image blur +", "Not necessary +", "Image resizing issue"];
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/30 p-4 backdrop-blur-[1px]">
      <div className="w-full max-w-[460px] rounded-xl bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <h2 className="text-[16px] font-semibold text-ink">
            Reject “{item.name}” {integrationLabel(item.entityType)}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-ink/50 hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>
        <label className="mt-5 block text-[11px] font-semibold text-ink/70">
          Rejection message
        </label>
        <div className="mt-2 rounded-md border border-black/20">
          <div className="flex flex-wrap gap-2 border-b border-black/10 p-2">
            {quick.map((text) => (
              <button
                key={text}
                type="button"
                onClick={() =>
                  setMessage(
                    (current) =>
                      `${current}${current ? " " : ""}${text.replace(" +", "")}`,
                  )
                }
                className="rounded-full bg-[#faf7f4] px-2.5 py-1 text-[8px] font-medium text-[#765038]"
              >
                {text}
              </button>
            ))}
          </div>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write your message to store managers..."
            className="h-40 w-full resize-none p-3 text-[10px] outline-none"
          />
        </div>
        <p className="mt-2 text-[9px] text-ink/45">
          ⓘ This message will be sent to the vendor.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-md border border-black/50 text-[10px] font-semibold text-ink/70"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!message.trim()}
            onClick={() => onConfirm(message.trim())}
            className={`h-9 rounded-md text-[10px] font-semibold text-white ${message.trim() ? "bg-[#e96a6a]" : "bg-[#d6d6d6]"}`}
          >
            Confirm rejection
          </button>
        </div>
      </div>
    </div>
  );
}
