import { X } from "lucide-react";
import { useState } from "react";

interface Props { open: boolean; onClose: () => void; onConfirm: (rider: string) => void; title?: string; }
export default function AssignRiderModal({ open, onClose, onConfirm, title = "Assign rider" }: Props) {
  const [selected, setSelected] = useState("Rajan Kumar");
  if (!open) return null;
  const riders = [
    ["Rajan Kumar", "+91 82347 09765", "1.6 km", "https://i.pravatar.cc/64?img=33"],
    ["Nitish Kumar", "+91 82347 09876", "2.1 km", "https://i.pravatar.cc/64?img=12"],
    ["Vijay Kumar", "+91 82347 09987", "2.8 km", "https://i.pravatar.cc/64?img=20"],
  ];
  return <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/25 p-5"><div className="w-[405px] max-w-full rounded-xl bg-white p-5 shadow-2xl"><div className="flex items-center justify-between border-b border-black/10 pb-4"><h3 className="text-[14px] font-semibold">{title}</h3><button type="button" onClick={onClose}><X size={17}/></button></div><div className="mt-4 flex items-center justify-between"><p className="text-[10px] font-bold">Select rider</p><span className="text-[9px] text-[#16b45a]">3 available</span></div><div className="mt-3 space-y-2">{riders.map(([name, phone, distance, avatar]) => <button key={name} type="button" onClick={() => setSelected(name)} className={`grid w-full grid-cols-[42px_1fr_18px] items-center gap-3 rounded-md p-2 text-left ${selected === name ? "bg-[#eeeae6]" : "bg-[#f5f4f2]"}`}><img src={avatar} alt="" className="h-10 w-10 rounded-full object-cover"/><span><b className="block text-[11px]">{name}</b><span className="mt-1 block text-[9px] text-ink/55">{phone} · {distance}</span></span><span className={`h-4 w-4 rounded-full border border-[#806f61] ${selected === name ? "bg-[#765038] shadow-[inset_0_0_0_4px_white]" : ""}`}/></button>)}</div><div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={onClose} className="h-9 rounded border border-[#765038] text-[10.5px] font-semibold">Cancel</button><button type="button" onClick={() => onConfirm(selected)} className="h-9 rounded bg-[#765038] text-[10.5px] font-semibold text-white">{title}</button></div></div></div>;
}
