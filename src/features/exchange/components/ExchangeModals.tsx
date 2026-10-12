import { CheckCircle2, MapPin, X } from "lucide-react";
import { useState } from "react";
import type { ExchangeRider } from "../types/exchange.types";

export function ConfirmationModal({
  open,
  title,
  message,
  confirmLabel,
  tone = "green",
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  tone?: "green" | "red" | "brown";
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  const button =
    tone === "red"
      ? "bg-[#ed7373]"
      : tone === "brown"
        ? "bg-[#805b42]"
        : "bg-[#39be69]";
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-5"
      onMouseDown={onClose}
    >
      <div
        className="w-[430px] max-w-full rounded-xl bg-white p-6 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
        <div className="my-4 h-px bg-black/10" />
        <p className="text-[11px] leading-5 text-ink/60">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 flex-1 rounded-md border border-black/50 text-[10.5px] font-semibold text-ink/70"
          >
            No, Wait
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`h-9 flex-1 rounded-md text-[10.5px] font-semibold text-white ${button}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function RejectExchangeModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (message: string) => void;
}) {
  const [message, setMessage] = useState("");
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-5"
      onMouseDown={onClose}
    >
      <div
        className="w-[405px] max-w-full rounded-xl bg-white p-5 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h3 className="text-[15px] font-semibold">Reject exchange order</h3>
        <div className="my-3 h-px bg-black/10" />
        <label className="text-[11px] font-semibold text-ink/65">
          Rejection message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message to customer..."
          className="mt-2 h-[175px] w-full resize-none rounded-none border border-black/40 p-3 text-[11px] outline-none placeholder:text-ink/35"
        />
        <p className="mt-2 text-[9px] italic leading-4 text-ink/55">
          ⓘ The customer and vendor will be able to see this message to
          understand why the order was rejected.
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 flex-1 rounded-md border border-black/60 text-[10.5px] font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!message.trim()}
            onClick={() => onConfirm(message.trim())}
            className="h-9 flex-1 rounded-md bg-[#ed7373] text-[10.5px] font-semibold text-white disabled:bg-[#d7d7d7]"
          >
            Confirm rejection
          </button>
        </div>
      </div>
    </div>
  );
}

export function AssignRiderModal({
  open,
  riders,
  onClose,
  onConfirm,
}: {
  open: boolean;
  riders: ExchangeRider[];
  onClose: () => void;
  onConfirm: (rider: ExchangeRider) => void;
}) {
  const [selected, setSelected] = useState("");
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-5"
      onMouseDown={onClose}
    >
      <div
        className="w-[405px] max-w-full rounded-xl bg-white p-5 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h3 className="text-[15px] font-semibold">#DD-5428 assign rider</h3>
        <div className="my-3 h-px bg-black/10" />
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-ink/65">
            Select rider
          </span>
          <span className="text-[10px] text-[#39be69]">
            {riders.length} available
          </span>
        </div>
        <div className="space-y-2">
          {riders.map((rider, index) => (
            <button
              key={`${rider.name}-${index}`}
              type="button"
              onClick={() => setSelected(String(index))}
              className={`flex w-full items-center gap-3 rounded-md p-2.5 text-left ${selected === String(index) ? "bg-[#eee9e5]" : "bg-[#f3f3f2]"}`}
            >
              <img
                src={rider.image}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-semibold">
                  {rider.name}
                </span>
                <span className="mt-1 block text-[9.5px] text-ink/65">
                  ⌕ {rider.phone} &nbsp;&nbsp;{" "}
                  <MapPin size={10} className="inline" /> {rider.distance}
                </span>
              </span>
              <span
                className={`h-4 w-4 rounded-full border ${selected === String(index) ? "border-[#805b42] bg-[#805b42] shadow-[inset_0_0_0_3px_#fff]" : "border-black/40"}`}
              />
            </button>
          ))}
        </div>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 flex-1 rounded-md border border-black/60 text-[10.5px] font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selected}
            onClick={() => onConfirm(riders[Number(selected)])}
            className="h-9 flex-1 rounded-md bg-[#805b42] text-[10.5px] font-semibold text-white disabled:bg-[#d7d7d7]"
          >
            Assign rider
          </button>
        </div>
      </div>
    </div>
  );
}

export function SuccessModal({
  open,
  title,
  message,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-5"
      onMouseDown={onClose}
    >
      <div
        className="relative w-[470px] max-w-full rounded-xl bg-white px-6 py-7 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-ink/60"
        >
          <X size={20} />
        </button>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ecfbf2] text-[#39be69]">
          <CheckCircle2 size={31} />
        </div>
        <p className="mt-5 text-center text-[15px] leading-6 text-ink">
          <b>{title}</b> {message}
        </p>
      </div>
    </div>
  );
}

export function RiderLocationModal({
  open,
  onClose,
  eta = "12:30 PM",
}: {
  open: boolean;
  onClose: () => void;
  eta?: string;
}) {
  if (!open) return null;
  const mapUrl =
    "https://www.openstreetmap.org/export/embed.html?bbox=72.8100%2C19.0550%2C72.8750%2C19.0950&layer=mapnik&marker=19.0750%2C72.8420";
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-5"
      onMouseDown={onClose}
    >
      <div
        className="w-[1190px] max-w-full rounded-xl bg-white p-4 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[15px] font-medium">Rider location –</h3>
          <button type="button" onClick={onClose}>
            <X size={24} className="text-ink/60" />
          </button>
        </div>
        <div className="relative h-[290px] overflow-hidden rounded-lg">
          <iframe
            title="Rider location map"
            src={mapUrl}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
          />
          <div className="pointer-events-none absolute left-[22%] top-[10%] flex h-24 w-24 items-center justify-center rounded-full bg-[#ef4537] text-white shadow-lg text-3xl">
            ▣
          </div>
          <div className="pointer-events-none absolute right-[22%] top-[35%] flex h-20 w-20 items-center justify-center rounded-full bg-[#5fc94d] text-white shadow-lg text-3xl">
            ▣
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md bg-white px-5 py-3 shadow-lg text-[11px] text-ink/60">
            <span>◷ ETA</span>
            <b className="ml-20 text-ink">{eta}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
