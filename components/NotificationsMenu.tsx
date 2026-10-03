"use client";

import { useEffect, useRef, useState } from "react";
import { ErrorState, LoadingBlock } from "./ui/States";
import { cx } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: "blue" | "cyan" | "violet" | "amber";
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Brightline Financial moved to Negotiation",
    detail: "Sarah Jennings advanced the $540K AI Implementation deal.",
    time: "2h ago",
    tone: "violet",
  },
  {
    id: "n2",
    title: "Vantage Tooling Co. closed won",
    detail: "$385K AI Implementation deal closed by Amara Okafor.",
    time: "Yesterday",
    tone: "cyan",
  },
  {
    id: "n3",
    title: "3 deals flagged at risk",
    detail: "No activity logged in 9+ days across EMEA and LATAM.",
    time: "Yesterday",
    tone: "amber",
  },
  {
    id: "n4",
    title: "Forecast updated for October",
    detail: "Projected revenue revised to $1.87M, above target.",
    time: "2 days ago",
    tone: "blue",
  },
];

type LoadState = "loading" | "error" | "ready";

const TONE_COLOR: Record<Notification["tone"], string> = {
  blue: "var(--accent-blue)",
  cyan: "var(--accent-cyan)",
  violet: "var(--accent-violet)",
  amber: "var(--accent-amber)",
};

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<LoadState>("loading");
  const [attempt, setAttempt] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setState("loading");
    const t = setTimeout(() => {
      setState(attempt === 0 ? "error" : "ready");
    }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, attempt]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
        style={{ background: open ? "var(--surface-glass-strong)" : "transparent" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        <span
          className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--accent-amber)" }}
        />
      </button>
      {open && (
        <div
          className="popover-surface absolute right-0 z-30 mt-2 w-80 rounded-2xl p-2"
          style={{ boxShadow: "var(--shadow-elevation-2)" }}
        >
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Notifications
            </span>
            {state === "ready" && (
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {NOTIFICATIONS.length} new
              </span>
            )}
          </div>
          <div className="max-h-[70vh] min-h-[180px] overflow-y-auto">
            {state === "loading" && <LoadingBlock label="Checking for updates" />}
            {state === "error" && (
              <ErrorState
                title="Couldn't refresh notifications"
                description="A network hiccup interrupted the request."
                onRetry={() => setAttempt((a) => a + 1)}
              />
            )}
            {state === "ready" && (
              <ul className="flex flex-col gap-0.5 pb-1">
                {NOTIFICATIONS.map((n) => (
                  <li
                    key={n.id}
                    className={cx("flex gap-3 rounded-xl px-2 py-2.5 transition-colors")}
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: TONE_COLOR[n.tone] }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium leading-snug" style={{ color: "var(--text-primary)" }}>
                        {n.title}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-snug" style={{ color: "var(--text-tertiary)" }}>
                        {n.detail}
                      </p>
                      <p className="mt-1 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                        {n.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
