import type { ReactNode } from "react";

export function LoadingRows({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="flex flex-col gap-2" role="status" aria-label="Loading data">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 rounded-xl px-4 py-3" style={{ background: "var(--surface-glass)" }}>
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="h-3 animate-pulse rounded-full"
              style={{
                background: "rgba(255,255,255,0.08)",
                width: c === 0 ? "22%" : `${100 / cols - 4}%`,
                animationDelay: `${(r * cols + c) * 40}ms`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function LoadingBlock({ label = "Loading" }: { label?: string }) {
  return (
    <div
      className="flex h-full min-h-[160px] flex-col items-center justify-center gap-3 text-sm"
      style={{ color: "var(--text-tertiary)" }}
      role="status"
    >
      <div className="relative h-8 w-8">
        <div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        />
        <div
          className="absolute inset-0 animate-spin rounded-full border-2 border-transparent"
          style={{ borderTopColor: "var(--accent-blue)" }}
        />
      </div>
      <span>{label}&hellip;</span>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      {icon && (
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-tertiary)" }}
        >
          {icon}
        </div>
      )}
      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
        {title}
      </p>
      {description && (
        <p className="max-w-xs text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Couldn't load this",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 px-6 py-10 text-center" role="alert">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{ background: "rgba(232, 97, 122, 0.12)", color: "var(--accent-rose)" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        </svg>
      </div>
      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
        {title}
      </p>
      {description && (
        <p className="max-w-xs text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
          {description}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
          style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-primary)" }}
        >
          Try again
        </button>
      )}
    </div>
  );
}
