import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

export function Pill({
  children,
  color,
  dim,
  className,
}: {
  children: ReactNode;
  color: string;
  dim: string;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        className
      )}
      style={{ color, background: dim }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {children}
    </span>
  );
}
