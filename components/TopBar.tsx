"use client";

import { useEffect, useRef, useState } from "react";
import { Dropdown } from "./ui/Dropdown";
import { NotificationsMenu } from "./NotificationsMenu";

export const DATE_RANGES = ["This Month", "This Quarter", "This Year", "All Time"];

export function TopBar({
  dateRange,
  onDateRangeChange,
  search,
  onSearchChange,
}: {
  dateRange: string;
  onDateRangeChange: (v: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 px-6"
      style={{
        background: "rgba(9,11,16,0.82)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-hairline)",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{
            background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))",
            boxShadow: "var(--shadow-glow-blue)",
          }}
          aria-hidden
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 18 L10 8 L14 13 L20 4" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="20" cy="4" r="2" fill="white" />
          </svg>
        </div>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Indixpert
          </p>
          <p className="truncate text-[11px]" style={{ color: "var(--text-tertiary)" }}>
            Sales Pipeline
          </p>
        </div>
      </div>

      <div className="hidden min-w-0 flex-1 items-center gap-2 md:flex" style={{ maxWidth: 420 }}>
        <div className="relative w-full">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-tertiary)"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            type="search"
            placeholder="Search deals or clients…"
            className="w-full rounded-lg py-2 pl-9 pr-3 text-xs outline-none"
            style={{
              background: "var(--surface-glass)",
              border: "1px solid var(--border-hairline)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:block">
          <Dropdown label="Range" value={dateRange} options={DATE_RANGES} onChange={onDateRangeChange} minWidth={150} />
        </div>
        <NotificationsMenu />
        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors"
            style={{ background: profileOpen ? "var(--surface-glass-strong)" : "transparent" }}
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold tabular"
              style={{ background: "rgba(76,134,255,0.18)", color: "var(--accent-blue)" }}
            >
              KS
            </span>
          </button>
          {profileOpen && (
            <div
              className="popover-surface absolute right-0 z-30 mt-2 w-52 rounded-xl p-1.5"
              style={{ boxShadow: "var(--shadow-elevation-2)" }}
            >
              <div className="px-3 py-2">
                <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                  Kailash Singh
                </p>
                <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  VP, Sales
                </p>
              </div>
              <div className="my-1 h-px" style={{ background: "var(--border-hairline)" }} />
              {["Account settings", "Team permissions", "Sign out"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="block w-full rounded-lg px-3 py-2 text-left text-xs transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
