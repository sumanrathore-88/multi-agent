"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export function Drawer({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden={!open}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ opacity: open ? 1 : 0, transition: "opacity 220ms ease" }}
    >
      <div
        onClick={onClose}
        className={open ? "pointer-events-auto absolute inset-0" : "absolute inset-0"}
        style={{ background: "rgba(4,5,8,0.55)", backdropFilter: "blur(2px)" }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={open ? "pointer-events-auto absolute right-0 top-0 h-full" : "absolute right-0 top-0 h-full"}
        style={{
          width: "min(460px, 100vw)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 320ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          className="popover-surface h-full overflow-y-auto"
          style={{ boxShadow: "var(--shadow-elevation-3)", borderLeft: "1px solid var(--border-hairline-strong)" }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
