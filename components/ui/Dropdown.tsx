"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/utils";

export function Dropdown({
  label,
  value,
  options,
  onChange,
  minWidth = 150,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  minWidth?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const isDefault = value === options[0];

  return (
    <div className="relative" ref={ref} style={{ minWidth }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cx(
          "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors",
          isDefault ? "text-[var(--text-secondary)]" : "text-[var(--text-primary)]"
        )}
        style={{
          background: open ? "var(--surface-glass-strong)" : "var(--surface-glass)",
          border: "1px solid var(--border-hairline)",
        }}
      >
        <span className="truncate">
          {label && <span className="text-[var(--text-tertiary)]">{label}: </span>}
          {value}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cx("shrink-0 transition-transform", open && "rotate-180")}
          style={{ color: "var(--text-tertiary)" }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="popover-surface absolute left-0 z-30 mt-1.5 max-h-64 w-full min-w-[180px] overflow-auto rounded-xl p-1.5"
          style={{ boxShadow: "var(--shadow-elevation-2)" }}
        >
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                role="option"
                aria-selected={opt === value}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors"
                style={{
                  background: opt === value ? "rgba(76,134,255,0.14)" : "transparent",
                  color: opt === value ? "var(--text-primary)" : "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  if (opt !== value) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  if (opt !== value) e.currentTarget.style.background = "transparent";
                }}
              >
                {opt}
                {opt === value && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
