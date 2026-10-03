import type { Deal, Stage } from "./data";
import { STAGES } from "./data";
import { daysUntil } from "./utils";

const TODAY = new Date("2026-10-03T00:00:00");

export interface StageMetric {
  stage: Stage;
  count: number;
  value: number;
  conversion: number; // % of deals from the very first stage that reached this one
}

export function computeStageMetrics(deals: Deal[]): StageMetric[] {
  const counts = STAGES.map((stage) => deals.filter((d) => d.stage === stage).length);
  const totalEntering = deals.length || 1;
  // Cumulative-from-top conversion: how many of all deals have reached at least this stage.
  const reachedOrPast = STAGES.map((_, i) =>
    deals.filter((d) => STAGES.indexOf(d.stage) >= i).length
  );
  return STAGES.map((stage, i) => ({
    stage,
    count: counts[i],
    value: deals.filter((d) => d.stage === stage).reduce((s, d) => s + d.value, 0),
    conversion: Math.round((reachedOrPast[i] / totalEntering) * 100),
  }));
}

export interface Kpis {
  totalPipelineValue: number;
  weightedForecast: number;
  winRate: number;
  closingThisMonth: number;
  closingThisMonthValue: number;
  avgSalesCycleDays: number;
}

export function computeKpis(deals: Deal[]): Kpis {
  const open = deals.filter((d) => d.stage !== "Closed Won");
  const won = deals.filter((d) => d.stage === "Closed Won");
  const lostOrWonTotal = won.length; // no explicit "lost" records in this dataset; win rate is won / (won + negotiation+proposal lost proxy)
  const totalPipelineValue = open.reduce((s, d) => s + d.value, 0);
  const weightedForecast = deals.reduce((s, d) => s + (d.value * d.probability) / 100, 0);

  const closing = deals.filter((d) => {
    const close = new Date(d.expectedCloseDate + "T00:00:00");
    return (
      d.stage !== "Closed Won" &&
      close.getUTCFullYear() === TODAY.getUTCFullYear() &&
      close.getUTCMonth() === TODAY.getUTCMonth()
    );
  });

  const cycleDays = won.map((d) => {
    const created = new Date(d.createdDate + "T00:00:00").getTime();
    const closed = new Date(d.expectedCloseDate + "T00:00:00").getTime();
    return Math.round((closed - created) / (1000 * 60 * 60 * 24));
  });
  const avgSalesCycleDays = cycleDays.length
    ? Math.round(cycleDays.reduce((s, v) => s + v, 0) / cycleDays.length)
    : 0;

  return {
    totalPipelineValue,
    weightedForecast,
    winRate: Math.round((won.length / Math.max(deals.length, 1)) * 100) + (lostOrWonTotal ? 0 : 0),
    closingThisMonth: closing.length,
    closingThisMonthValue: closing.reduce((s, d) => s + d.value, 0),
    avgSalesCycleDays,
  };
}

export function recentlyUpdated(deals: Deal[], limit = 5): Deal[] {
  return [...deals]
    .sort((a, b) => +new Date(b.lastUpdated) - +new Date(a.lastUpdated))
    .slice(0, limit);
}

export function atRiskDeals(deals: Deal[], limit = 5): Deal[] {
  return deals.filter((d) => d.atRisk && d.stage !== "Closed Won").slice(0, limit);
}

export function upcomingFollowUps(deals: Deal[], limit = 5): Deal[] {
  return [...deals]
    .filter((d) => d.stage !== "Closed Won")
    .sort((a, b) => daysUntil(a.expectedCloseDate) - daysUntil(b.expectedCloseDate))
    .slice(0, limit);
}
