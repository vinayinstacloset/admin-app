import { ChevronLeft, ChevronRight } from "lucide-react";
interface PaginationProps {
  page: number;
  totalPages: number;
  totalElements: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}
export default function Pagination({
  page,
  totalPages,
  totalElements,
  pageSize = 10,
  onPageChange,
}: PaginationProps) {
  if (totalElements <= 0) return null;
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalElements);
  const pages = Array.from({ length: totalPages }, (_, i) => i).filter(
    (n) => n === 0 || n === totalPages - 1 || Math.abs(n - page) <= 1,
  );
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#ece8e3] bg-white px-4 py-3">
      <p className="text-xs text-ink/55">
        Showing{" "}
        <span className="font-semibold text-ink">
          {start}–{end}
        </span>{" "}
        of <span className="font-semibold text-ink">{totalElements}</span>{" "}
        records
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 0}
          onClick={() => onPageChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e0da] text-ink/70 hover:bg-cream disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((n, i) => (
          <span key={n} className="contents">
            {i > 0 && n - pages[i - 1] > 1 && (
              <span className="px-1 text-xs text-ink/40">…</span>
            )}
            <button
              type="button"
              key={n}
              onClick={() => onPageChange(n)}
              aria-current={page === n ? "page" : undefined}
              className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold ${page === n ? "bg-[#0878df] text-white shadow-sm" : "border border-[#e5e0da] text-ink/65 hover:bg-cream"}`}
            >
              {n + 1}
            </button>
          </span>
        ))}
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e0da] text-ink/70 hover:bg-cream disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
