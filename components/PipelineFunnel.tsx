"use client";

import { useState } from "react";
import type { StageMetric } from "@/lib/metrics";
import { STAGE_COLOR } from "@/lib/theme";
import { formatCurrency } from "@/lib/utils";
import { cx } from "@/lib/utils";

export function PipelineFunnel({
  metrics,
  selectedStage,
  onSelectStage,
}: {
  metrics: StageMetric[];
  selectedStage: string | null;
  onSelectStage: (stage: string | null) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const maxCount = Math.max(...metrics.map((m) => m.count), 1);

  return (
    <div className="perspective-grid">
      <div
        className="flex items-stretch gap-0 overflow-x-auto pb-6 pt-2"
        style={{ transformStyle: "preserve-3d", transform: "rotateX(7deg)", transformOrigin: "center bottom" }}
      >
        {metrics.map((m, i) => {
          const widthScale = 0.62 + (m.count / maxCount) * 0.38;
          const isActive = selectedStage === m.stage;
          const isHovered = hovered === m.stage;
          const colors = STAGE_COLOR[m.stage];
          const restZ = -i * 46;
          const restY = i * 7;
          const restScale = 1 - i * 0.028;
          const brightness = 1 - i * 0.035;
          const dropOff =
            i > 0 ? Math.max(0, metrics[i - 1].conversion - m.conversion) : null;

          return (
            <div key={m.stage} className="relative flex items-center" style={{ flex: "1 1 0" }}>
              {i > 0 && (
                <div
                  className="hidden shrink-0 flex-col items-center justify-center px-1 md:flex"
                  style={{ width: 44 }}
                  aria-hidden
                >
                  <svg width="36" height="14" viewBox="0 0 36 14" fill="none">
                    <path d="M0 7 H30" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
                    <path d="M24 2 L30 7 L24 12" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {dropOff !== null && (
                    <span className="mt-0.5 text-[10px] tabular" style={{ color: "var(--text-tertiary)" }}>
                      −{dropOff}%
                    </span>
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={() => onSelectStage(isActive ? null : m.stage)}
                onMouseEnter={() => setHovered(m.stage)}
                onMouseLeave={() => setHovered(null)}
                className="group relative flex w-full flex-col justify-between gap-3 rounded-2xl p-4 text-left outline-none transition-[transform,filter,box-shadow] duration-300"
                style={{
                  minHeight: 168,
                  background: isActive ? colors.dim : "var(--surface-glass)",
                  border: `1px solid ${isActive ? colors.accent : "var(--border-hairline)"}`,
                  transform:
                    isHovered || isActive
                      ? `translateZ(32px) translateY(0px) scale(${1.02 * (0.94 + widthScale * 0.06)})`
                      : `translateZ(${restZ}px) translateY(${restY}px) scale(${restScale * (0.94 + widthScale * 0.06)})`,
                  filter: isHovered || isActive ? "brightness(1)" : `brightness(${brightness})`,
                  boxShadow: isActive || isHovered ? colors.glow : "var(--shadow-elevation-1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: colors.accent === "none" ? "var(--text-tertiary)" : colors.accent }}
                  />
                  <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
                    Stage {i + 1}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {m.stage}
                  </p>
                  <p className="tabular mt-1 text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                    {formatCurrency(m.value, true)}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="tabular" style={{ color: "var(--text-secondary)" }}>
                    {m.count} deals
                  </span>
                  <span className="tabular font-medium" style={{ color: colors.text }}>
                    {m.conversion}%
                  </span>
                </div>
                <div
                  className="h-1 w-full overflow-hidden rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${m.conversion}%`,
                      background: colors.accent === "none" ? "var(--text-tertiary)" : colors.accent,
                    }}
                  />
                </div>
                {isActive && (
                  <span
                    className={cx("absolute -top-2 right-3 rounded-full px-2 py-0.5 text-[10px] font-medium")}
                    style={{ background: colors.accent, color: "#07090d" }}
                  >
                    Viewing
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
