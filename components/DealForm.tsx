"use client";

import { useState } from "react";
import type { Deal, ProductLine, Region, Stage } from "@/lib/data";
import { PRODUCT_LINES, REGIONS, STAGES } from "@/lib/data";
import { Dropdown } from "./ui/Dropdown";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  background: "var(--surface-glass)",
  border: "1px solid var(--border-hairline)",
  color: "var(--text-primary)",
};

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--accent-blue)]"
      style={inputStyle}
    />
  );
}

export interface DealFormValues {
  name: string;
  client: string;
  value: number;
  stage: Stage;
  productLine: ProductLine;
  region: Region;
  owner: string;
  probability: number;
  expectedCloseDate: string;
  nextAction: string;
  atRisk: boolean;
}

export function DealForm({
  initial,
  owners,
  mode,
  onCancel,
  onSubmit,
  onDelete,
}: {
  initial: DealFormValues;
  owners: string[];
  mode: "create" | "edit";
  onCancel: () => void;
  onSubmit: (values: DealFormValues) => void;
  onDelete?: () => void;
}) {
  const [values, setValues] = useState<DealFormValues>(initial);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function set<K extends keyof DealFormValues>(key: K, v: DealFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  const isValid = values.name.trim().length > 0 && values.client.trim().length > 0 && values.value > 0;

  return (
    <form
      className="flex h-full flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        if (!isValid) return;
        onSubmit(values);
      }}
    >
      <div className="flex items-start justify-between gap-3 p-5" style={{ borderBottom: "1px solid var(--border-hairline)" }}>
        <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          {mode === "create" ? "New Deal" : "Edit Deal"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel"
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

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
        <Field label="Deal name">
          <TextInput
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Cloud Migration — Acme Corp"
          />
        </Field>

        <Field label="Client">
          <TextInput required value={values.client} onChange={(e) => set("client", e.target.value)} placeholder="Client company name" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Deal value (USD)">
            <TextInput
              required
              type="number"
              min={0}
              step={1000}
              value={values.value || ""}
              onChange={(e) => set("value", Number(e.target.value))}
            />
          </Field>
          <Field label="Probability (%)">
            <TextInput
              type="number"
              min={0}
              max={100}
              value={values.probability}
              onChange={(e) => set("probability", Math.min(100, Math.max(0, Number(e.target.value))))}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Stage">
            <Dropdown label="" value={values.stage} options={STAGES} onChange={(v) => set("stage", v as Stage)} />
          </Field>
          <Field label="Product line">
            <Dropdown
              label=""
              value={values.productLine}
              options={PRODUCT_LINES}
              onChange={(v) => set("productLine", v as ProductLine)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Region">
            <Dropdown label="" value={values.region} options={REGIONS} onChange={(v) => set("region", v as Region)} />
          </Field>
          <Field label="Owner">
            <Dropdown label="" value={values.owner} options={owners} onChange={(v) => set("owner", v)} />
          </Field>
        </div>

        <Field label="Expected close date">
          <TextInput
            type="date"
            required
            value={values.expectedCloseDate}
            onChange={(e) => set("expectedCloseDate", e.target.value)}
          />
        </Field>

        <Field label="Next action">
          <TextInput value={values.nextAction} onChange={(e) => set("nextAction", e.target.value)} placeholder="e.g. Schedule discovery call" />
        </Field>

        <label className="flex items-center gap-2.5 rounded-lg px-1 py-1">
          <input
            type="checkbox"
            checked={values.atRisk}
            onChange={(e) => set("atRisk", e.target.checked)}
            className="h-4 w-4 accent-[var(--accent-amber)]"
          />
          <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            Flag as at risk
          </span>
        </label>
      </div>

      <div className="flex items-center gap-2 p-5" style={{ borderTop: "1px solid var(--border-hairline)" }}>
        {mode === "edit" && onDelete && (
          <button
            type="button"
            onClick={() => (confirmingDelete ? onDelete() : setConfirmingDelete(true))}
            onBlur={() => setConfirmingDelete(false)}
            className="rounded-lg px-3 py-2 text-xs font-medium transition-colors"
            style={{
              background: confirmingDelete ? "var(--accent-rose)" : "rgba(232,97,122,0.12)",
              color: confirmingDelete ? "#1a0508" : "var(--accent-rose)",
            }}
          >
            {confirmingDelete ? "Confirm delete" : "Delete deal"}
          </button>
        )}
        <div className="flex-1" />
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-2 text-xs font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="rounded-lg px-4 py-2 text-xs font-semibold transition-opacity disabled:opacity-40"
          style={{ background: "var(--accent-blue)", color: "#06101f" }}
        >
          {mode === "create" ? "Create deal" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
