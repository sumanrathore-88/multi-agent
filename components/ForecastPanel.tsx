import { GlassPanel } from "./ui/GlassPanel";
import { ForecastChart } from "./ForecastChart";
import type { ForecastPoint } from "@/lib/data";

const LEGEND: Array<{ label: string; color: string; dashed?: boolean }> = [
  { label: "Committed", color: "var(--accent-blue)" },
  { label: "Projected", color: "var(--accent-violet)" },
  { label: "Target", color: "var(--text-tertiary)", dashed: true },
];

export function ForecastPanel({ data }: { data: ForecastPoint[] }) {
  return (
    <GlassPanel className="p-5" elevation={1}>
      <div className="mb-1 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Revenue Forecast
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Target vs. committed vs. projected, by month
          </p>
        </div>
        <div className="flex items-center gap-3">
          {LEGEND.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-secondary)" }}>
              <span
                className="h-[2px] w-3 rounded-full"
                style={{
                  background: l.dashed ? "transparent" : l.color,
                  borderTop: l.dashed ? `1.5px dashed ${l.color}` : undefined,
                }}
              />
              {l.label}
            </span>
          ))}
        </div>
      </div>
      <ForecastChart data={data} />
    </GlassPanel>
  );
}
