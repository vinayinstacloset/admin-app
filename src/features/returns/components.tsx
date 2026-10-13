import {
  ChevronDown,
  Info,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import type { ReturnStatus } from "./types/returns.types";

export function ReturnStatusPill({
  status,
}: {
  status: Exclude<ReturnStatus, "All">;
}) {
  const style: Record<Exclude<ReturnStatus, "All">, string> = {
    New: "bg-[#fff9df] text-[#e6b900]",
    Refunded: "bg-[#ecfbf2] text-[#39bd65]",
    "On the way": "bg-[#f6eaff] text-[#a335f1]",
    Collected: "bg-[#e8f3ff] text-[#1682e8]",
    Rejected: "bg-[#fff0f0] text-[#ee7373]",
  };
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[9px] font-medium whitespace-nowrap ${style[status]}`}
    >
      {status}
    </span>
  );
}

export function ReturnDropdown({
  value,
  options,
  onChange,
  width = 148,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  width?: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative shrink-0" style={{ width }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-[30px] w-full rounded-md border border-black/10 bg-white px-3 text-[10px] text-[#3b3734] flex items-center justify-between gap-2"
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={11} />
      </button>
      {open && (
        <div className="absolute right-0 top-[34px] z-[120] w-full min-w-[150px] overflow-hidden rounded-md border border-black/10 bg-white shadow-[0_8px_24px_rgba(0,0,0,.12)]">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left text-[10px] ${option === value ? "bg-[#eee9e5] font-semibold text-[#6f513e]" : "text-[#3f3a36] hover:bg-[#f7f4f1]"}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ReturnSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative w-[300px] max-w-[34vw]">
      <Search
        size={13}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#aaa39e]"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-[30px] w-full rounded-md border border-black/10 bg-white pl-8 pr-2 text-[10px] outline-none placeholder:text-[#aaa39e]"
      />
    </div>
  );
}

export function RejectRefundModal({
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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 p-5"
      onMouseDown={onClose}
    >
      <div
        className="w-[405px] rounded-xl bg-white p-5 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold">Reject refund request</h3>
          <button type="button" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="my-3 h-px bg-[#ddd8d3]" />
        <label className="block text-[10px] font-semibold text-[#5e5853] mb-2">
          Rejection message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message to customer..."
          className="h-[174px] w-full resize-none rounded-none border border-[#aaa39e] p-3 text-[11px] outline-none placeholder:text-[#aaa39e]"
        />
        <p className="mt-2 flex gap-1 text-[9.5px] italic text-[#706963]">
          <Info size={11} className="mt-[1px] shrink-0" />
          The customer and vendor will be able to see this message to understand
          why the order was rejected.
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 flex-1 rounded-md border border-[#4f4a46] text-[10.5px] font-semibold text-[#5e5853]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!message.trim()}
            onClick={() => {
              onConfirm(message.trim());
              setMessage("");
            }}
            className={`h-9 flex-1 rounded-md text-[10.5px] font-semibold text-white ${message.trim() ? "bg-[#ed7373]" : "bg-[#d9d9d9]"}`}
          >
            Confirm rejection
          </button>
        </div>
      </div>
    </div>
  );
}

export function PaymentModal({
  open,
  amount,
  onClose,
  onContinue,
}: {
  open: boolean;
  amount: number;
  onClose: () => void;
  onContinue: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30"
      onMouseDown={onClose}
    >
      <div
        className="w-[335px] bg-white border border-[#ddd] shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-3 pb-2 border-b border-[#e2e2e2] flex justify-between items-center">
          <b className="text-[19px] text-[#0070ba]">PayPal</b>
          <span className="text-[10px] font-semibold">
            🛒 ₹{amount.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="p-3">
          <p className="text-[17px] text-[#666]">
            Pay with debit or credit card
          </p>
          <p className="text-[9px] text-[#777] mt-1">
            We don’t share your financial details with the merchant.
          </p>
          <input
            className="mt-4 h-9 w-full border border-[#36b7f2] px-2 text-[10px]"
            placeholder="✉ Email Address"
          />
          <div className="mt-3 grid grid-cols-2 gap-8">
            <select className="h-8 border border-[#ddd] px-2 text-[10px]">
              <option>Canada</option>
            </select>
            <input
              className="h-8 border border-[#ddd] px-2 text-[10px]"
              placeholder="Zip / Post Code"
            />
          </div>
          <label className="mt-3 flex items-center gap-2 border border-[#ddd] p-3 text-[10px]">
            <input type="radio" name="pay" />{" "}
            <span>
              <b>PayPal</b>
              <small className="block text-[#999]">
                Pay easily, fast and securely with your PayPal account.
              </small>
            </span>
          </label>
          <label className="flex items-center gap-2 border-x border-b border-[#ddd] p-3 text-[10px]">
            <input type="radio" name="pay" />{" "}
            <span>
              <b>Pay by Card</b>
              <small className="block text-[#999]">
                Pay securely via Visa, Mastercard or American Express.
              </small>
            </span>
          </label>
          <button
            type="button"
            onClick={onContinue}
            className="mt-3 h-10 w-full bg-[#49b800] text-[18px] font-semibold text-white"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductCard({
  compact = false,
  onView,
}: {
  compact?: boolean;
  onView?: () => void;
}) {
  return (
    <div
      className={`rounded-xl bg-white border border-black/5 ${compact ? "p-3 flex items-center gap-3" : "p-4 flex gap-4"}`}
    >
      <div
        className={`relative shrink-0 overflow-hidden rounded-lg bg-[#e8e8e8] ${compact ? "h-[50px] w-[50px]" : "h-[250px] w-[250px]"}`}
      >
        <img
          src="/reference/riders/product-blue.jpg"
          alt="Alone dark blue T-shirt"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`${compact ? "text-[10.5px]" : "text-[16px]"} font-semibold text-[#272321]`}
          >
            Alone dark blue T-shirt for Gen-Z
          </h3>
          {onView && (
            <button
              type="button"
              onClick={onView}
              className="text-[9px] text-blue-600 underline shrink-0"
            >
              View details
            </button>
          )}
        </div>
        {!compact && (
          <>
            <div className="mt-3 flex gap-4 text-[10px] text-[#514b47]">
              <span>▦ T-Shirt</span>
              <span>〽 L</span>
              <span>◉ Dark blue</span>
            </div>
            <p className="mt-4 text-[9.5px] leading-4 text-[#6f6862]">
              <b>Description:</b>
              <br />A versatile, casual garment named for its T-shaped body and
              sleeves, typically featuring a crew neck and short sleeves without
              buttons or collars.
            </p>
          </>
        )}
        <div className="mt-2 flex items-end gap-2">
          <b className={`${compact ? "text-[10px]" : "text-[17px]"}`}>₹599</b>
          {!compact && (
            <>
              <span className="text-[10px] text-[#999] line-through">₹649</span>
              <span className="text-[10px] text-[#ff6536]">🏷 12% off</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function CustomerCard() {
  return (
    <div className="rounded-xl bg-white border border-black/5 p-4 flex items-center gap-6">
      <img
        src="/reference/riders/customer.jpg"
        alt="Ayan Qureshi"
        className="h-[62px] w-[62px] rounded-full object-cover"
      />
      <div className="grid flex-1 grid-cols-5 gap-5 text-[10px]">
        <div>
          <span className="block text-[#8b837c]">Full Name:</span>
          <b>Arjun Mehta</b>
        </div>
        <div>
          <span className="block text-[#8b837c]">Email:</span>
          <b>arjunmehta@gmail.com</b>
        </div>
        <div>
          <span className="block text-[#8b837c]">Mobile No:</span>
          <b>+91 99887 55441</b>
        </div>
        <div>
          <span className="block text-[#8b837c]">Age/Gender:</span>
          <b>21/Female</b>
        </div>
        <div>
          <span className="block text-[#8b837c]">City/State:</span>
          <b>Mumbai/Maharashtra</b>
        </div>
      </div>
    </div>
  );
}

export function PersonInfo({ type }: { type: "customer" | "rider" }) {
  if (type === "customer")
    return (
      <div className="rounded-xl bg-white border border-black/5 p-3">
        <div className="flex items-center gap-3">
          <img
            src="/reference/riders/customer.jpg"
            alt="Customer"
            className="h-11 w-11 rounded-full object-cover"
          />
          <b className="text-[14px]">
            Ayan Qureshi{" "}
            <span className="font-normal text-[10px]">(22/male)</span>
          </b>
        </div>
        <div className="mt-3 border-t border-black/10 pt-3 flex gap-2 text-[10px] leading-4">
          <MapPin size={12} /> Shimla park, MM Valley, 5th floor, Building no:
          502, kausa – Mumbra, Lingampalli (Telangana)– 2.8 Km
        </div>
      </div>
    );
  return (
    <div className="rounded-xl bg-white border border-black/5 p-3">
      <div className="flex items-center gap-3">
        <img
          src="/reference/riders/avatar.jpg"
          alt="Rajan Kumar"
          className="h-11 w-11 rounded-full object-cover"
        />
        <b className="text-[14px]">Rajan Kumar</b>
      </div>
      <div className="mt-3 border-t border-black/10 pt-3 flex justify-between text-[10px]">
        <span>
          <Phone size={12} className="inline mr-1" />
          +91 82347 09765
        </span>
        <span>
          <Star size={12} className="inline mr-1" />
          4.6 (116)
        </span>
      </div>
    </div>
  );
}

export function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}
