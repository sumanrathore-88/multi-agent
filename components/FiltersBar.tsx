"use client";

import { Dropdown } from "./ui/Dropdown";
import { PRODUCT_LINES, REGIONS } from "@/lib/data";

export interface FilterState {
  region: string;
  productLine: string;
  owner: string;
  stage: string;
}

export function FiltersBar({
  filters,
  onChange,
  owners,
  stages,
  resultCount,
  onReset,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  owners: string[];
  stages: string[];
  resultCount: number;
  onReset: () => void;
}) {
  const isFiltered =
    filters.region !== "All Regions" ||
    filters.productLine !== "All Products" ||
    filters.owner !== "All Owners" ||
    filters.stage !== "All Stages";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Dropdown
        label="Region"
        value={filters.region}
        options={["All Regions", ...REGIONS]}
        onChange={(v) => onChange({ ...filters, region: v })}
        minWidth={150}
      />
      <Dropdown
        label="Product"
        value={filters.productLine}
        options={["All Products", ...PRODUCT_LINES]}
        onChange={(v) => onChange({ ...filters, productLine: v })}
        minWidth={170}
      />
      <Dropdown
        label="Owner"
        value={filters.owner}
        options={["All Owners", ...owners]}
        onChange={(v) => onChange({ ...filters, owner: v })}
        minWidth={160}
      />
      <Dropdown
        label="Stage"
        value={filters.stage}
        options={["All Stages", ...stages]}
        onChange={(v) => onChange({ ...filters, stage: v })}
        minWidth={150}
      />
      {isFiltered && (
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg px-3 py-2 text-xs font-medium transition-colors"
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
        >
          Clear filters
        </button>
      )}
      <span className="ml-auto text-xs tabular" style={{ color: "var(--text-tertiary)" }}>
        {resultCount} deal{resultCount === 1 ? "" : "s"}
      </span>
    </div>
  );
}
