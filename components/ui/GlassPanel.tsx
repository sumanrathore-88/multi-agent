import type { ReactNode, CSSProperties } from "react";
import { cx } from "@/lib/utils";

export function GlassPanel({
  children,
  className,
  strong = false,
  elevation = 1,
  style,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  elevation?: 1 | 2 | 3;
  style?: CSSProperties;
  as?: "div" | "section" | "article";
}) {
  const shadow =
    elevation === 3
      ? "var(--shadow-elevation-3)"
      : elevation === 2
      ? "var(--shadow-elevation-2)"
      : "var(--shadow-elevation-1)";
  return (
    <Tag
      className={cx(strong ? "glass-strong" : "glass", "rounded-2xl", className)}
      style={{ boxShadow: shadow, ...style }}
    >
      {children}
    </Tag>
  );
}
