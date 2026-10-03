"use client";

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ForecastPoint } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="glass-strong rounded-xl p-3"
      style={{ boxShadow: "var(--shadow-elevation-2)" }}
    >
      <p className="mb-1.5 text-xs font-medium" style={{ color: "var(--text-primary)" }}>
        {label} 2026
      </p>
      <div className="flex flex-col gap-1">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-1.5" style={{ color: "var(--text-tertiary)" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
              {p.name}
            </span>
            <span className="tabular font-medium" style={{ color: "var(--text-primary)" }}>
              {formatCurrency(p.value, true)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ForecastChart({ data }: { data: ForecastPoint[] }) {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <defs>
            <linearGradient id="committedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="month"
            tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => formatCurrency(v, true)}
            tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.14)" }} />
          <Area
            name="Committed"
            type="monotone"
            dataKey="committed"
            stroke="var(--accent-blue)"
            strokeWidth={2}
            fill="url(#committedFill)"
            isAnimationActive={false}
          />
          <Line
            name="Target"
            type="monotone"
            dataKey="target"
            stroke="var(--text-tertiary)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            name="Projected"
            type="monotone"
            dataKey="projected"
            isAnimationActive={false}
            stroke="var(--accent-violet)"
            strokeWidth={2}
            dot={{ r: 2.5, fill: "var(--accent-violet)", strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
