"use client";

import { useEffect, useMemo, useState } from "react";
import { TopBar, DATE_RANGES } from "@/components/TopBar";
import { NetworkHero } from "@/components/NetworkHero";
import { KpiRow } from "@/components/KpiRow";
import { PipelineFunnel } from "@/components/PipelineFunnel";
import { ForecastPanel } from "@/components/ForecastPanel";
import { FiltersBar, type FilterState } from "@/components/FiltersBar";
import { DealTable } from "@/components/DealTable";
import { PerformanceInsights } from "@/components/PerformanceInsights";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Drawer } from "@/components/ui/Drawer";
import { DealDetail } from "@/components/DealDetail";
import { DealForm, type DealFormValues } from "@/components/DealForm";
import { LoadingBlock } from "@/components/ui/States";
import { deals as SEED_DEALS, salesReps, forecastData, STAGES, PRODUCT_LINES, REGIONS } from "@/lib/data";
import type { Deal } from "@/lib/data";
import { computeKpis, computeStageMetrics, recentlyUpdated, atRiskDeals, upcomingFollowUps } from "@/lib/metrics";
import { toISODate } from "@/lib/utils";

const TODAY = new Date("2026-10-03T00:00:00");

function withinDateRange(deal: Deal, range: string): boolean {
  if (range === "All Time") return true;
  const close = new Date(deal.expectedCloseDate + "T00:00:00");
  if (range === "This Month") {
    return close.getUTCFullYear() === TODAY.getUTCFullYear() && close.getUTCMonth() === TODAY.getUTCMonth();
  }
  if (range === "This Quarter") {
    const q = Math.floor(TODAY.getUTCMonth() / 3);
    const dq = Math.floor(close.getUTCMonth() / 3);
    return close.getUTCFullYear() === TODAY.getUTCFullYear() && dq === q;
  }
  if (range === "This Year") {
    return close.getUTCFullYear() === TODAY.getUTCFullYear();
  }
  return true;
}

const DEFAULT_FILTERS: FilterState = {
  region: "All Regions",
  productLine: "All Products",
  owner: "All Owners",
  stage: "All Stages",
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(DATE_RANGES[3]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [deals, setDeals] = useState<Deal[]>(SEED_DEALS);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [drawerMode, setDrawerMode] = useState<"view" | "edit" | "create" | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const owners = useMemo(() => Array.from(new Set(deals.map((d) => d.owner))).sort(), [deals]);

  const pipelineDeals = useMemo(() => {
    const q = search.trim().toLowerCase();
    return deals.filter((d) => {
      if (!withinDateRange(d, dateRange)) return false;
      if (filters.region !== "All Regions" && d.region !== filters.region) return false;
      if (filters.productLine !== "All Products" && d.productLine !== filters.productLine) return false;
      if (filters.owner !== "All Owners" && d.owner !== filters.owner) return false;
      if (q && !d.name.toLowerCase().includes(q) && !d.client.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [deals, dateRange, filters, search]);

  const tableDeals = useMemo(
    () =>
      filters.stage === "All Stages"
        ? pipelineDeals
        : pipelineDeals.filter((d) => d.stage === filters.stage),
    [pipelineDeals, filters.stage]
  );

  const stageMetrics = useMemo(() => computeStageMetrics(pipelineDeals), [pipelineDeals]);
  const kpis = useMemo(() => computeKpis(pipelineDeals), [pipelineDeals]);
  const forecastTrend = useMemo(() => forecastData.slice(0, 7).map((p) => p.committed), []);

  const topReps = useMemo(() => {
    const scoped =
      filters.region === "All Regions" ? salesReps : salesReps.filter((r) => r.region === filters.region);
    return [...scoped]
      .sort((a, b) => b.totalClosedValue / b.quota - a.totalClosedValue / a.quota)
      .slice(0, 5);
  }, [filters.region]);

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
  }

  function openView(deal: Deal) {
    setSelectedDeal(deal);
    setDrawerMode("view");
  }

  function openEdit(deal: Deal) {
    setSelectedDeal(deal);
    setDrawerMode("edit");
  }

  function openCreate() {
    setSelectedDeal(null);
    setDrawerMode("create");
  }

  function closeDrawer() {
    setDrawerMode(null);
    setSelectedDeal(null);
  }

  function handleFormSubmit(values: DealFormValues) {
    const todayIso = toISODate(TODAY);
    if (drawerMode === "edit" && selectedDeal) {
      const updated: Deal = { ...selectedDeal, ...values, lastUpdated: todayIso };
      setDeals((prev) => prev.map((d) => (d.id === selectedDeal.id ? updated : d)));
      setSelectedDeal(updated);
      setDrawerMode("view");
    } else {
      const created: Deal = {
        ...values,
        id: `deal-${Date.now()}`,
        createdDate: todayIso,
        lastUpdated: todayIso,
      };
      setDeals((prev) => [created, ...prev]);
      closeDrawer();
    }
  }

  function handleDelete() {
    if (!selectedDeal) return;
    setDeals((prev) => prev.filter((d) => d.id !== selectedDeal.id));
    closeDrawer();
  }

  const blankFormValues: DealFormValues = {
    name: "",
    client: "",
    value: 0,
    stage: "Lead",
    productLine: PRODUCT_LINES[0],
    region: REGIONS[0],
    owner: owners[0] ?? "",
    probability: 15,
    expectedCloseDate: toISODate(TODAY),
    nextAction: "",
    atRisk: false,
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <TopBar dateRange={dateRange} onDateRangeChange={setDateRange} search={search} onSearchChange={setSearch} />

      <main className="relative mx-auto flex max-w-[1440px] flex-col gap-6 px-4 pb-16 pt-6 sm:px-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[420px] overflow-hidden">
          <NetworkHero height={420} />
        </div>

        <div className="relative z-10 flex flex-col gap-1">
          <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Pipeline Overview
          </h1>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {dateRange} · updated moments ago · sample data for demonstration
          </p>
        </div>

        {loading ? (
          <GlassPanel className="relative z-10 p-10">
            <LoadingBlock label="Loading pipeline data" />
          </GlassPanel>
        ) : (
          <>
            <div className="relative z-10">
              <KpiRow kpis={kpis} forecastTrend={forecastTrend} />
            </div>

            <GlassPanel className="relative z-10 p-5" elevation={2}>
              <div className="mb-4 flex items-baseline justify-between">
                <div>
                  <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    Pipeline Stages
                  </h2>
                  <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    Click a stage to filter the deal table below
                  </p>
                </div>
              </div>
              <PipelineFunnel
                metrics={stageMetrics}
                selectedStage={filters.stage === "All Stages" ? null : filters.stage}
                onSelectStage={(stage) => setFilters((f) => ({ ...f, stage: stage ?? "All Stages" }))}
              />
            </GlassPanel>

            <div className="relative z-10">
              <ForecastPanel data={forecastData} />
            </div>

            <GlassPanel className="relative z-10 p-5" elevation={1}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Deal Activity
                </h2>
                <button
                  type="button"
                  onClick={openCreate}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90"
                  style={{ background: "var(--accent-blue)", color: "#06101f" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  New Deal
                </button>
              </div>
              <FiltersBar
                filters={filters}
                onChange={setFilters}
                owners={owners}
                stages={STAGES}
                resultCount={tableDeals.length}
                onReset={resetFilters}
              />
              <div className="mt-4">
                <DealTable deals={tableDeals} onOpenDeal={openView} onClearFilters={resetFilters} />
              </div>
            </GlassPanel>

            <div className="relative z-10 flex flex-col gap-3">
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Performance Insights
              </h2>
              <PerformanceInsights
                topReps={topReps}
                recentlyUpdated={recentlyUpdated(pipelineDeals)}
                atRisk={atRiskDeals(pipelineDeals)}
                upcoming={upcomingFollowUps(pipelineDeals)}
              />
            </div>
          </>
        )}
      </main>

      <Drawer open={drawerMode !== null} onClose={closeDrawer} title={selectedDeal?.name ?? "New deal"}>
        {drawerMode === "view" && selectedDeal && (
          <DealDetail deal={selectedDeal} onClose={closeDrawer} onEdit={() => openEdit(selectedDeal)} />
        )}
        {drawerMode === "edit" && selectedDeal && (
          <DealForm
            mode="edit"
            owners={owners}
            initial={{
              name: selectedDeal.name,
              client: selectedDeal.client,
              value: selectedDeal.value,
              stage: selectedDeal.stage,
              productLine: selectedDeal.productLine,
              region: selectedDeal.region,
              owner: selectedDeal.owner,
              probability: selectedDeal.probability,
              expectedCloseDate: selectedDeal.expectedCloseDate,
              nextAction: selectedDeal.nextAction,
              atRisk: selectedDeal.atRisk,
            }}
            onCancel={() => setDrawerMode("view")}
            onSubmit={handleFormSubmit}
            onDelete={handleDelete}
          />
        )}
        {drawerMode === "create" && (
          <DealForm mode="create" owners={owners} initial={blankFormValues} onCancel={closeDrawer} onSubmit={handleFormSubmit} />
        )}
      </Drawer>
    </div>
  );
}
