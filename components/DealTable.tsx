"use client";

import { useMemo, useState } from "react";
import type { Deal } from "@/lib/data";
import { STAGE_COLOR } from "@/lib/theme";
import { cx, formatCurrency, formatDateShort } from "@/lib/utils";
import { Pill } from "./ui/Pill";
import { EmptyState } from "./ui/States";

type SortKey = "name" | "client" | "value" | "stage" | "owner" | "probability" | "expectedCloseDate";

const COLUMNS: Array<{ key: SortKey; label: string; width: number }> = [
  { key: "name", label: "Deal", width: 230 },
  { key: "client", label: "Client", width: 130 },
  { key: "value", label: "Value", width: 85 },
  { key: "stage", label: "Stage", width: 130 },
  { key: "owner", label: "Owner", width: 110 },
  { key: "probability", label: "Probability", width: 110 },
  { key: "expectedCloseDate", label: "Close Date", width: 85 },
];
const NEXT_ACTION_WIDTH = 170;

export function DealTable({
  deals,
  onOpenDeal,
  onClearFilters,
}: {
  deals: Deal[];
  onOpenDeal: (deal: Deal) => void;
  onClearFilters: () => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("expectedCloseDate");
  const [sortDir, setSortDir] = useState<1 | -1>(1);

  const sorted = useMemo(() => {
    const copy = [...deals];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * sortDir;
      return String(av).localeCompare(String(bv)) * sortDir;
    });
    return copy;
  }, [deals, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 1 ? -1 : 1));
    } else {
      setSortKey(key);
      setSortDir(1);
    }
  }

  if (deals.length === 0) {
    return (
      <EmptyState
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        }
        title="No deals match these filters"
        description="Try widening the date range or clearing a filter to see more of the pipeline."
        action={
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-1 rounded-lg px-3 py-1.5 text-xs font-medium"
            style={{ background: "rgba(76,134,255,0.16)", color: "var(--accent-blue)" }}
          >
            Clear all filters
          </button>
        }
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        className="w-full border-collapse text-sm"
        style={{ tableLayout: "fixed", minWidth: COLUMNS.reduce((s, c) => s + c.width, NEXT_ACTION_WIDTH) }}
      >
        <colgroup>
          {COLUMNS.map((col) => (
            <col key={col.key} style={{ width: col.width }} />
          ))}
          <col style={{ width: NEXT_ACTION_WIDTH }} />
        </colgroup>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-hairline)" }}>
            {COLUMNS.map((col) => (
              <th key={col.key} className="px-3 py-2 text-left font-medium" style={{ color: "var(--text-tertiary)" }}>
                <button
                  type="button"
                  onClick={() => toggleSort(col.key)}
                  className="flex items-center gap-1 text-xs uppercase tracking-wide transition-colors"
                  style={{ color: sortKey === col.key ? "var(--text-primary)" : "var(--text-tertiary)" }}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className={cx(sortDir === -1 && "rotate-180")}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </button>
              </th>
            ))}
            <th className="px-3 py-2 text-left font-medium" style={{ color: "var(--text-tertiary)" }}>
              <span className="text-xs uppercase tracking-wide">Next Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((deal) => {
            const colors = STAGE_COLOR[deal.stage];
            return (
              <tr
                key={deal.id}
                tabIndex={0}
                aria-label={`Open details for ${deal.name}`}
                onClick={() => onOpenDeal(deal)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpenDeal(deal);
                  }
                }}
                className="group cursor-pointer transition-colors focus-visible:bg-[rgba(76,134,255,0.08)]"
                style={{ borderBottom: "1px solid var(--border-hairline)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td className="px-3 py-3">
                  <p className="line-clamp-2 font-medium leading-snug" style={{ color: "var(--text-primary)" }}>
                    {deal.name}
                  </p>
                  <p className="truncate text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {deal.productLine}
                  </p>
                </td>
                <td className="truncate px-3 py-3" style={{ color: "var(--text-secondary)" }}>
                  {deal.client}
                </td>
                <td className="tabular px-3 py-3 font-medium" style={{ color: "var(--text-primary)" }}>
                  {formatCurrency(deal.value, true)}
                </td>
                <td className="px-3 py-3">
                  <Pill color={colors.accent === "none" ? "var(--text-tertiary)" : colors.accent} dim={colors.dim}>
                    {deal.stage}
                  </Pill>
                  {deal.atRisk && (
                    <span className="ml-1.5 inline-flex items-center gap-1 text-[10px] font-medium" style={{ color: "var(--accent-amber)" }}>
                      ● at risk
                    </span>
                  )}
                </td>
                <td className="px-3 py-3" style={{ color: "var(--text-secondary)" }}>
                  {deal.owner}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-14 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${deal.probability}%`, background: colors.accent === "none" ? "var(--text-tertiary)" : colors.accent }}
                      />
                    </div>
                    <span className="tabular text-xs" style={{ color: "var(--text-secondary)" }}>
                      {deal.probability}%
                    </span>
                  </div>
                </td>
                <td className="tabular px-3 py-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                  {formatDateShort(deal.expectedCloseDate)}
                </td>
                <td className="truncate px-3 py-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {deal.nextAction}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
