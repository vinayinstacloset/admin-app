import { Filter, SlidersHorizontal, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useStoreReviews } from "../hooks";
import type { StoreReview } from "../types/store.types";
import { ratingPercent } from "../utils/store.utils";
import { Dropdown, classNames } from "./StoreCommon";

function ReviewCard({ review }: { review: StoreReview }) {
  return (
    <article className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff0e9] text-[11px] font-bold text-[#ef7c5c]">
          {review.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold">{review.customer}</p>
              <p className="mt-0.5 text-[8px] text-ink/45">{review.date}</p>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={13}
                  fill={index < review.rating ? "#f0c600" : "none"}
                  stroke={index < review.rating ? "#f0c600" : "#d4d4d4"}
                />
              ))}
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-[1.45] text-ink/90">
            {review.text}
          </p>
          {review.reply && (
            <div className="mt-3 rounded-lg border border-black/15 bg-[#f2f1ef] p-3">
              <p className="text-[10px] font-semibold text-[#76533d]">
                Nike reply
              </p>
              <p className="mt-2 text-[10px] leading-[1.45] text-ink/80">
                {review.reply}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function ReviewsView({
  backTo,
  backLabel,
}: { backTo?: string; backLabel?: string } = {}) {
  const { filteredReviews, rating, setRating, sort, setSort } =
    useStoreReviews();
  const [openMenu, setOpenMenu] = useState<"rating" | "sort" | null>(null);

  const total = 136;
  const ratingCounts: Record<number, number> = {
    5: 84,
    4: 30,
    3: 7,
    2: 4,
    1: 3,
  };

  return (
    <div>
      {backTo && (
        <div className="mb-2">
          <Link
            to={backTo}
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#76533d]"
          >
            <span aria-hidden="true">←</span>
            {backLabel ?? "Back"}
          </Link>
        </div>
      )}
      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_375px]">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-[16px] font-bold">Reviews - 136</h2>
            <div className="flex items-center gap-2">
              <Filter size={17} className="text-ink/65" />
              <Dropdown
                value={rating}
                options={["All ratings", "5", "4", "3", "2", "1"]}
                open={openMenu === "rating"}
                onToggle={() =>
                  setOpenMenu(openMenu === "rating" ? null : "rating")
                }
                onSelect={(value) => {
                  setRating(value);
                  setOpenMenu(null);
                }}
              />
              <SlidersHorizontal size={16} className="text-ink/65" />
              <Dropdown
                value={sort}
                options={["Newest first", "Oldest first", "Reply given"]}
                open={openMenu === "sort"}
                onToggle={() =>
                  setOpenMenu(openMenu === "sort" ? null : "sort")
                }
                onSelect={(value) => {
                  setSort(value);
                  setOpenMenu(null);
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <div>
            <h2 className="mb-3 text-[16px] font-bold">Overall rating</h2>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-[28px] font-bold">4.6</span>
                <Star size={17} fill="#f0c600" strokeWidth={0} />
                <span className="text-[9px] text-ink/50">(136 reviews)</span>
              </div>
              <div className="mt-4 space-y-3">
                {[5, 4, 3, 2, 1].map((item) => {
                  const count = ratingCounts[item];
                  const percent = ratingPercent(count, total);
                  return (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-[10px]"
                    >
                      <span className="w-3">{item}</span>
                      <div className="h-1 flex-1 rounded-full bg-[#e8e8e8]">
                        <div
                          className="h-1 rounded-full bg-[#f0c600]"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="w-7 text-right">{percent}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-[16px] font-bold">Review summary</h2>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {[
                  ["Quality ★4.8", "bg-[#eaf9ef] text-[#20ae62]"],
                  ["Delivery speed ★4.7", "bg-[#eaf9ef] text-[#20ae62]"],
                  ["Sizing accuracy ★4.4", "bg-[#eaf3ff] text-[#1682e9]"],
                  ["Packaging ★3.8", "bg-[#fff0ef] text-[#ef6f6f]"],
                  ["Color accuracy ★3.6", "bg-[#fff0ef] text-[#ef6f6f]"],
                ].map(([label, styles]) => (
                  <span
                    key={label}
                    className={classNames(
                      "rounded-full px-3 py-1.5 text-[9px] font-semibold",
                      styles,
                    )}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div className="my-4 border-t border-black/10" />
              <p className="text-[10px] font-semibold">
                Common feedback themes
              </p>
              <p className="mt-2 text-[9px] leading-[1.5] text-ink/60">
                Customers praise fast delivery and fabric quality. Main
                improvement areas: packaging consistency and colour accuracy in
                product photos.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
