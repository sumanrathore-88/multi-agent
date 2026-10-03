import type { Deal, SalesRep } from "@/lib/data";
import { GlassPanel } from "./ui/GlassPanel";
import { EmptyState } from "./ui/States";
import { formatCurrency, formatDateShort, daysUntil, initials } from "@/lib/utils";

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        {title}
      </h3>
      {hint && (
        <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          {hint}
        </span>
      )}
    </div>
  );
}

function RepRow({ rep, rank }: { rep: SalesRep; rank: number }) {
  const attainment = Math.round((rep.totalClosedValue / rep.quota) * 100);
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-4 text-xs tabular" style={{ color: "var(--text-tertiary)" }}>
        {rank}
      </span>
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold tabular"
        style={{ background: "rgba(76,134,255,0.16)", color: "var(--accent-blue)" }}
      >
        {rep.avatarInitials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium" style={{ color: "var(--text-primary)" }}>
          {rep.name}
        </p>
        <div className="mt-1 h-1 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${Math.min(attainment, 100)}%`, background: "var(--accent-cyan)" }}
          />
        </div>
      </div>
      <span className="shrink-0 text-right text-xs tabular" style={{ color: "var(--text-secondary)" }}>
        {attainment}%
      </span>
    </div>
  );
}

function DealRow({ deal, trailing }: { deal: Deal; trailing: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold tabular"
        style={{ background: "rgba(143,107,255,0.16)", color: "var(--accent-violet)" }}
      >
        {initials(deal.owner)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium" style={{ color: "var(--text-primary)" }}>
          {deal.client}
        </p>
        <p className="truncate text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          {deal.nextAction}
        </p>
      </div>
      <span className="shrink-0 text-right text-[11px] tabular" style={{ color: "var(--text-tertiary)" }}>
        {trailing}
      </span>
    </div>
  );
}

export function PerformanceInsights({
  topReps,
  recentlyUpdated,
  atRisk,
  upcoming,
}: {
  topReps: SalesRep[];
  recentlyUpdated: Deal[];
  atRisk: Deal[];
  upcoming: Deal[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-4">
      <GlassPanel className="p-4" elevation={1}>
        <SectionHeader title="Top Performing Reps" hint="YTD quota attainment" />
        <div className="flex flex-col">
          {topReps.map((rep, i) => (
            <RepRow key={rep.id} rep={rep} rank={i + 1} />
          ))}
        </div>
      </GlassPanel>

      <GlassPanel className="p-4" elevation={1}>
        <SectionHeader title="Recently Updated" hint="last activity" />
        {recentlyUpdated.length === 0 ? (
          <EmptyState title="No recent activity" />
        ) : (
          recentlyUpdated.map((d) => <DealRow key={d.id} deal={d} trailing={formatDateShort(d.lastUpdated)} />)
        )}
      </GlassPanel>

      <GlassPanel className="p-4" elevation={1}>
        <SectionHeader title="At-Risk Opportunities" hint={`${atRisk.length} flagged`} />
        {atRisk.length === 0 ? (
          <EmptyState title="Nothing at risk" description="Every open deal has recent activity." />
        ) : (
          atRisk.map((d) => <DealRow key={d.id} deal={d} trailing={formatCurrency(d.value, true)} />)
        )}
      </GlassPanel>

      <GlassPanel className="p-4" elevation={1}>
        <SectionHeader title="Upcoming Follow-ups" hint="soonest close" />
        {upcoming.length === 0 ? (
          <EmptyState title="Nothing due soon" />
        ) : (
          upcoming.map((d) => (
            <DealRow key={d.id} deal={d} trailing={`${Math.max(daysUntil(d.expectedCloseDate), 0)}d`} />
          ))
        )}
      </GlassPanel>
    </div>
  );
}
