"use client";

import { useEffect, useMemo, useState } from "react";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const listener = () => setReduced(mq.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);
  return reduced;
}

interface Node {
  x: number;
  y: number;
  r: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function NetworkHero({ height = 420 }: { height?: number }) {
  const reducedMotion = useReducedMotion();
  const { nodes, edges, pulses } = useMemo(() => {
    const rand = seededRandom(42);
    const w = 1600;
    const h = height;
    const count = 46;
    const ns: Node[] = Array.from({ length: count }, () => ({
      x: rand() * w,
      y: rand() * h,
      r: 1.4 + rand() * 2.2,
    }));
    const es: Array<{ a: Node; b: Node; dist: number }> = [];
    for (let i = 0; i < ns.length; i++) {
      for (let j = i + 1; j < ns.length; j++) {
        const dx = ns[i].x - ns[j].x;
        const dy = ns[i].y - ns[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 190) es.push({ a: ns[i], b: ns[j], dist });
      }
    }
    const shuffled = es.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const pulseEdges = shuffled.slice(0, 7);
    return { nodes: ns, edges: es, pulses: pulseEdges };
  }, [height]);

  return (
    <svg
      viewBox={`0 0 1600 ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <radialGradient id="nodeGlowBlue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4c86ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#4c86ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fadeMask" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="75%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="fadeOut">
          <rect width="1600" height={height} fill="url(#fadeMask)" />
        </mask>
      </defs>
      <g mask="url(#fadeOut)" opacity="0.55">
        {edges.map((e, i) => (
          <line
            key={i}
            x1={e.a.x}
            y1={e.a.y}
            x2={e.b.x}
            y2={e.b.y}
            stroke="rgba(140,160,210,0.16)"
            strokeWidth="1"
          />
        ))}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r} fill="rgba(200,210,235,0.5)" />
        ))}
        {!reducedMotion && pulses.map((e, i) => {
          const colors = ["#4c86ff", "#2fd9e8", "#8f6bff"];
          const color = colors[i % colors.length];
          return (
            <g key={`pulse-${i}`}>
              <circle r="2.6" fill={color}>
                <animateMotion
                  dur={`${6 + (i % 3) * 1.6}s`}
                  repeatCount="indefinite"
                  path={`M${e.a.x},${e.a.y} L${e.b.x},${e.b.y}`}
                />
                <animate attributeName="opacity" values="0;1;1;0" dur={`${6 + (i % 3) * 1.6}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
