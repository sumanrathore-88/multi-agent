import { GlassPanel } from "./ui/GlassPanel";
import { formatCurrency } from "@/lib/utils";
import type { Kpis } from "@/lib/metrics";

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const w = 72;
  const h = 24;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(h - ((p - min) / range) * h).toFixed(1)}`)
    .join(" ");
  const areaPath = `${path} L${w},${h} L0,${h} Z`;
  const gradId = `spark-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0" aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KpiCard({
  label,
  value,
  accent,
  sparkline,
  delta,
  deltaTone,
}: {
  label: string;
  value: string;
  accent: string;
  sparkline?: number[];
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
}) {
  return (
    <GlassPanel className="flex flex-1 flex-col justify-between gap-3 p-4" elevation={1}>
      <p className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </p>
      <div className="flex items-end justify-between gap-2">
        <p className="tabular text-2xl font-semibold leading-none" style={{ color: "var(--text-primary)" }}>
          {value}
        </p>
        {sparkline && <Sparkline points={sparkline} color={accent} />}
      </div>
      {delta && (
        <p
          className="tabular text-xs font-medium"
          style={{
            color:
              deltaTone === "up"
                ? "var(--accent-cyan)"
                : deltaTone === "down"
                ? "var(--accent-rose)"
                : "var(--text-tertiary)",
          }}
        >
          {deltaTone === "up" ? "▲ " : deltaTone === "down" ? "▼ " : ""}
          {delta}
        </p>
      )}
    </GlassPanel>
  );
}

export function KpiRow({ kpis, forecastTrend }: { kpis: Kpis; forecastTrend: number[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <KpiCard
        label="Total Pipeline Value"
        value={formatCurrency(kpis.totalPipelineValue, true)}
        accent="var(--accent-blue)"
        sparkline={forecastTrend}
        delta="open deals only"
        deltaTone="neutral"
      />
      <KpiCard
        label="Weighted Forecast"
        value={formatCurrency(kpis.weightedForecast, true)}
        accent="var(--accent-violet)"
        sparkline={forecastTrend.map((v) => v * 0.56)}
        delta="probability-adjusted"
        deltaTone="neutral"
      />
      <KpiCard
        label="Win Rate"
        value={`${kpis.winRate}%`}
        accent="var(--accent-cyan)"
        delta="+3 pts vs last qtr"
        deltaTone="up"
      />
      <KpiCard
        label="Closing This Month"
        value={String(kpis.closingThisMonth)}
        accent="var(--accent-blue)"
        delta={formatCurrency(kpis.closingThisMonthValue, true) + " at stake"}
        deltaTone="neutral"
      />
      <KpiCard
        label="Avg. Sales Cycle"
        value={`${kpis.avgSalesCycleDays}d`}
        accent="var(--accent-violet)"
        delta="-6d vs last qtr"
        deltaTone="up"
      />
    </div>
  );
}
