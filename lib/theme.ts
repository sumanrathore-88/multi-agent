import type { Stage } from "./data";

export const STAGE_COLOR: Record<Stage, { accent: string; dim: string; text: string; glow: string }> = {
  Lead: {
    accent: "#8b93a7",
    dim: "rgba(139, 147, 167, 0.14)",
    text: "#aab2c4",
    glow: "none",
  },
  Qualified: {
    accent: "var(--accent-blue)",
    dim: "rgba(76, 134, 255, 0.14)",
    text: "#8fb2ff",
    glow: "var(--shadow-glow-blue)",
  },
  Proposal: {
    accent: "var(--accent-blue)",
    dim: "rgba(76, 134, 255, 0.2)",
    text: "#aac6ff",
    glow: "var(--shadow-glow-blue)",
  },
  Negotiation: {
    accent: "var(--accent-violet)",
    dim: "rgba(143, 107, 255, 0.16)",
    text: "#c3b2ff",
    glow: "var(--shadow-glow-violet)",
  },
  "Closed Won": {
    accent: "var(--accent-cyan)",
    dim: "rgba(47, 217, 232, 0.16)",
    text: "#7fe9f0",
    glow: "var(--shadow-glow-cyan)",
  },
};

export const STAGE_ORDER: Stage[] = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won"];
