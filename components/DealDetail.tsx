import type { Deal } from "@/lib/data";
import { STAGE_COLOR } from "@/lib/theme";
import { formatCurrency, formatDate, initials } from "@/lib/utils";
import { Pill } from "./ui/Pill";

export function DealDetail({
  deal,
  onClose,
  onEdit,
}: {
  deal: Deal;
  onClose: () => void;
  onEdit: () => void;
}) {
  const colors = STAGE_COLOR[deal.stage];
  const rows: Array<[string, string]> = [
    ["Client", deal.client],
    ["Product line", deal.productLine],
    ["Region", deal.region],
    ["Owner", deal.owner],
    ["Created", formatDate(deal.createdDate)],
    ["Expected close", formatDate(deal.expectedCloseDate)],
    ["Last updated", formatDate(deal.lastUpdated)],
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 p-5" style={{ borderBottom: "1px solid var(--border-hairline)" }}>
        <div>
          <Pill color={colors.accent === "none" ? "var(--text-tertiary)" : colors.accent} dim={colors.dim} className="mb-2">
            {deal.stage}
          </Pill>
          <h2 className="text-base font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
            {deal.name}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
            style={{ background: "rgba(76,134,255,0.14)", color: "var(--accent-blue)" }}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close deal details"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
            style={{ color: "var(--text-tertiary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3" style={{ background: "var(--surface-glass)" }}>
            <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              Deal value
            </p>
            <p className="tabular mt-0.5 text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              {formatCurrency(deal.value)}
            </p>
          </div>
          <div className="rounded-xl p-3" style={{ background: "var(--surface-glass)" }}>
            <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              Probability
            </p>
            <p className="tabular mt-0.5 text-lg font-semibold" style={{ color: colors.text }}>
              {deal.probability}%
            </p>
          </div>
        </div>

        {deal.atRisk && (
          <div
            className="flex items-start gap-2 rounded-xl p-3 text-xs"
            style={{ background: "rgba(224,162,58,0.1)", color: "#f0c178" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-0.5 shrink-0">
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            </svg>
            <span>Flagged at risk — no recent activity logged against this deal.</span>
          </div>
        )}

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
            Details
          </p>
          <dl className="flex flex-col gap-2">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-xs">
                <dt style={{ color: "var(--text-tertiary)" }}>{k}</dt>
                <dd className="font-medium" style={{ color: "var(--text-primary)" }}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
            Owner
          </p>
          <div className="flex items-center gap-2.5 rounded-xl p-3" style={{ background: "var(--surface-glass)" }}>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold tabular"
              style={{ background: "rgba(76,134,255,0.18)", color: "var(--accent-blue)" }}
            >
              {initials(deal.owner)}
            </span>
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {deal.owner}
            </span>
          </div>
        </div>

        <div className="mt-auto">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
            Next action
          </p>
          <div
            className="rounded-xl p-3 text-sm"
            style={{ background: "rgba(76,134,255,0.08)", color: "var(--text-primary)", border: "1px solid rgba(76,134,255,0.18)" }}
          >
            {deal.nextAction}
          </div>
        </div>
      </div>
    </div>
  );
}
