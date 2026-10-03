---
name: Indixpert Pipeline Dashboard
description: A layered, 3D glass command surface for IT sales pipeline health.
colors:
  bg: "#090b10"
  bg-elevated: "#10131b"
  bg-sunken: "#060709"
  text-primary: "#eef1f7"
  text-secondary: "#9aa3b5"
  text-tertiary: "#838ba1"
  accent-blue: "#4c86ff"
  accent-blue-dim: "#2c4d94"
  accent-cyan: "#2fd9e8"
  accent-cyan-dim: "#1c7e87"
  accent-violet: "#8f6bff"
  accent-violet-dim: "#4f3b94"
  accent-amber: "#e0a23a"
  accent-rose: "#e8617a"
  border-hairline: "rgba(255, 255, 255, 0.08)"
  border-hairline-strong: "rgba(255, 255, 255, 0.14)"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.04em"
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "tnum, zero"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "rgba(76,134,255,0.16)"
    textColor: "{colors.accent-blue}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  button-primary-hover:
    backgroundColor: "rgba(76,134,255,0.24)"
  dropdown-trigger:
    backgroundColor: "rgba(255,255,255,0.045)"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  popover-panel:
    backgroundColor: "rgba(13,16,23,0.97)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
  card-glass:
    backgroundColor: "rgba(255,255,255,0.045)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "16px"
  pill:
    rounded: "{rounded.full}"
    padding: "4px 10px"
---

# Design System: Indixpert Pipeline Dashboard

## Overview

**Creative North Star: "The Architectural Command Deck"**

Indixpert reads as a physically-layered instrument panel, not a card grid skinned dark. The ground is a near-black charcoal-navy that recedes, and everything that matters floats above it on hairline-bordered glass at a distinct, legible depth. Three accent roles — electric blue, cyan, violet — are assigned by meaning (primary data/action, positive/growth, forecast/predictive) and never mixed decoratively; amber and rose exist only as risk/alert signals, outside the three-role discipline. Depth is real: the pipeline funnel uses CSS 3D perspective, per-card `translateZ`/`translateY`/scale/brightness falloff, so the stacking is perceptible at rest, not just revealed on hover.

Numbers are always tabular (JetBrains Mono, `tnum`/`zero` features) so columns of currency and percentages align. Labels and prose stay in Inter, a crisp grotesk. The system rejects the flat single-plane card-grid every SaaS dashboard defaults to, and rejects decorative glow or gradient as a substitute for genuine elevation.

**Key Characteristics:**
- Charcoal-navy ground with glass panels at disciplined elevation steps, not a flat dark theme.
- Three accent roles (blue/cyan/violet) assigned by data meaning; amber/rose reserved for risk and error only.
- Real CSS 3D perspective and per-layer transform falloff on the pipeline funnel, visible at rest.
- Tabular, monospaced figures everywhere a number appears.
- Floating overlays (dropdowns, popovers, the deal drawer) use a near-opaque `.popover-surface` fill, never thin glass, so they reliably occlude content behind them.

## Colors

A near-black charcoal-navy ground carries low-opacity glass surfaces; three accent hues are each reserved for one data meaning, never combined for decoration.

### Primary
- **Electric Blue** (`#4c86ff`): primary data and actions — logo mark, primary KPI accents, search/dropdown focus ring, committed-forecast line, default stage color for early/mid pipeline stages (Qualified, Proposal).

### Secondary
- **Signal Cyan** (`#2fd9e8`): positive/growth signal — win rate, Closed Won stage, quota-attainment bars, "up" deltas.
- **Forecast Violet** (`#8f6bff`): predictive/forecast layer — weighted forecast KPI, Negotiation stage, projected-revenue line and dots.

### Neutral
- **Void Ground** (`#090b10`): page background, deepening toward `#060709` (`--bg-sunken`) for recessed wells.
- **Elevated Charcoal** (`#10131b`): the next-step-up surface tone (`--bg-elevated`) for app-chrome contexts.
- **Primary Text** (`#eef1f7`): headline figures, titles, primary labels.
- **Secondary Text** (`#9aa3b5`): body copy, table cells, secondary labels.
- **Tertiary Text** (`#838ba1`): captions, hints, inactive labels, axis ticks.
- **Hairline Border** (`rgba(255,255,255,0.08)`, strong variant `rgba(255,255,255,0.14)`): the border on every glass surface and divider; strength doubles for popovers and active/open states.

### Signal (non-decorative)
- **Amber** (`#e0a23a`): "at risk" flags and unread-notification dot only.
- **Rose** (`#e8617a`): "down" deltas and error-state iconography only.

### Named Rules
**The Three-Role Rule.** Blue, cyan, and violet are each tied to one data meaning (action/primary, growth/positive, forecast/predictive) and are never swapped or mixed decoratively on the same element. Amber and rose are reserved for risk and error signaling and never used as a fourth decorative accent.

**The Opaque Overlay Rule.** Any floating surface that must occlude content behind it (dropdown menus, the notifications/profile popovers, the deal drawer) uses the near-opaque `.popover-surface` fill (`rgba(13,16,23,0.97)` + blur), not the thin `.glass`/`.glass-strong` surfaces used for in-flow panels. Backdrop blur alone is a nice-to-have, never the occlusion mechanism.

## Typography

**Display/Body Font:** Inter (with ui-sans-serif, system-ui, sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, monospace fallback)

**Character:** A crisp, restrained grotesk for every label and sentence, paired with a monospaced data face reserved strictly for numbers — the pairing reads as instrument-panel precision rather than editorial expression.

### Hierarchy
- **Display** (600, 1.125rem / `text-lg`, 1.2 line-height): page title ("Pipeline Overview").
- **Title** (600, 0.875rem / `text-sm`, 1.3 line-height): panel and section headings ("Pipeline Stages", "Deal Activity", "Top Performing Reps").
- **Body** (400, 0.75rem / `text-xs`, 1.5 line-height): table cells, descriptions, menu items.
- **Label** (500, 0.625–0.6875rem / `text-[10px]`–`text-[11px]`, uppercase tracking-wide where used): column headers, stage badges ("Stage 1"), captions.
- **Data** (600, tabular-mono, `tnum`+`zero` feature settings): every KPI headline, currency value, percentage, and date in a table or card — applied via the `.tabular` utility class, never left in the body sans face.

### Named Rules
**The Tabular Everywhere Rule.** Any numeral representing money, a percentage, a count, or a date in a data context renders in `.tabular` (JetBrains Mono, `tnum`/`zero`). Prose and labels stay in Inter; the two faces are never interchanged.

## Layout

A single centered column capped at `max-w-[1440px]`, with consistent horizontal padding (`px-4` mobile, `px-6` at `sm`+) and a `gap-6` vertical rhythm between major sections (KPI row, funnel panel, forecast panel, deal table panel, performance insights). Internal panel padding is `p-4`–`p-5`; card-level gaps use `gap-3`. The KPI row is a responsive grid (2 columns mobile → 3 at `sm` → 5 at `lg`); Performance Insights is 1 column mobile → 2 at `lg` → 4 at `xl`. The deal table scrolls horizontally on narrow viewports rather than reflowing columns. A sticky top bar (`h-16`) stays pinned above all content at `z-40`.

## Elevation & Depth

Hybrid: most panels sit at a shallow tonal glass elevation, while the pipeline funnel is the system's one commitment to genuine 3D depth. Three numbered elevation shadows (`--shadow-elevation-1/2/3`) step from a tight near shadow to a broad soft falloff, used respectively for in-flow cards, section panels, and the full-height deal drawer/popovers. The funnel additionally applies `perspective: 2200px` plus a `rotateX(7deg)` tilt on its row, with each stage card carrying its own `translateZ`, `translateY`, `scale`, and `brightness` falloff by index — so the five stages recede in real simulated space at rest, not only revealed by a hover trick. Accent "glow" shadows (`--shadow-glow-blue/cyan/violet`) appear only on the active/hovered funnel card and the logo mark, as a response to state, never as ambient decoration.

### Shadow Vocabulary
- **Elevation 1** (`0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -8px rgba(0,0,0,0.5)`): default resting card/panel (KPI cards, funnel cards at rest, insight cards).
- **Elevation 2** (`0 2px 4px rgba(0,0,0,0.45), 0 16px 40px -12px rgba(0,0,0,0.6)`): section-level panels (pipeline stages panel, forecast panel) and open popovers/dropdowns.
- **Elevation 3** (`0 4px 8px rgba(0,0,0,0.5), 0 28px 64px -16px rgba(0,0,0,0.65)`): the deal detail drawer, the highest surface in the stack.
- **Glow Blue/Cyan/Violet** (`0 0 0 1px <accent>/0.25, 0 12px 32px -8px <accent>/0.3–0.35`): state-driven accent emphasis on the active/hovered funnel stage and the logo mark only.

### Named Rules
**The Depth-at-Rest Rule.** The funnel's 3D layering (perspective, rotateX, per-card translateZ/scale/brightness) must be visible on first paint, not conjured only by hover. Hover/active states push a card forward (`translateZ(32px)`); they do not create depth that didn't already exist.

## Shapes

Rounded-rectangle throughout, stepped by role: small controls (buttons, dropdown triggers, pills' inner dot) at 8px, popovers and funnel/KPI cards at 12–16px, and avatars/status dots/pills always fully circular (`rounded-full`). No sharp corners, no hard offset/neobrutalist shadows anywhere in the system — every shadow is soft and diffuse per the Elevation vocabulary above. Icons are inline SVG line-art (stroke-based, 1.5–2.4px stroke), never an icon-font glyph.

## Components

### Buttons
- **Shape:** 8px radius (`rounded-lg`).
- **Primary action (e.g. "Clear all filters", "Try again"):** low-opacity accent-tinted background (e.g. `rgba(76,134,255,0.16)`) with accent-colored text; no filled solid-accent button exists in the system.
- **Hover / Focus:** background opacity increases on hover; focus-visible uses a 2px blue outline with 2px offset (global `:focus-visible` rule), not a box-shadow ring.
- **Ghost (profile menu items, "Clear filters" text button):** transparent at rest, `rgba(255,255,255,0.05)` on hover.

### Pills (stage/status tags)
- **Style:** fully rounded (`rounded-full`), accent-tinted background at low opacity with a matching solid dot and accent-colored text — one pill per deal stage, colored by `STAGE_COLOR`.
- **State:** no selected/unselected variant; pills are always in their "on" tinted state since they represent a fixed data value, not a toggle.

### Cards / Containers (GlassPanel)
- **Corner Style:** 16px radius (`rounded-2xl`), uniform across KPI cards, the funnel panel, forecast panel, table panel, and insight cards.
- **Background:** `.glass` (`rgba(255,255,255,0.045)` + 20px blur) for standard panels, `.glass-strong` (`rgba(255,255,255,0.07)` + 24px blur) for panels needing more separation (e.g. chart tooltip).
- **Shadow Strategy:** elevation 1–3 per the table above, chosen per panel's stacking priority.
- **Border:** 1px hairline (`rgba(255,255,255,0.08)`, strong variant for active/open states).
- **Internal Padding:** 16–20px (`p-4`/`p-5`).

### Overlays (Dropdown, Notifications, Profile menu, Drawer)
- **Style:** `.popover-surface` — near-opaque `rgba(13,16,23,0.97)` fill with blur, 12–16px radius, strong hairline border, elevation-2 or -3 shadow. This is distinct from `.glass`/`.glass-strong`: overlays must fully occlude whatever sits behind them, so opacity is the real mechanism and blur is supplementary.
- **Focus / Keyboard:** dropdown options are a `role="listbox"`/`role="option"` list; Escape closes; outside-click closes. The deal drawer is a `role="dialog"` with `aria-modal`, Escape-to-close, and body-scroll lock.

### Tables (Deal Activity)
- **Style:** borderless cells with a hairline row divider; fixed column widths via `<colgroup>`; sortable headers with a small chevron icon indicating active sort + direction.
- **Row interaction:** rows are natively `<tr>` (no role override) with `tabIndex={0}`, `aria-label`, and `onKeyDown` (Enter/Space) layered on top of `onClick`, so rows stay keyboard-operable without breaking their native table semantics.
- **Inline signal:** an "at risk" marker renders as a small amber dot + label next to the stage pill, not as a separate stage.

### Signature Component: Pipeline Funnel
A five-stage, horizontally receding 3D stack: `perspective: 2200px` on the container, `rotateX(7deg)` on the row, and each stage card individually offset by `translateZ(-i*46px)`, `translateY(i*7px)`, a slight `scale` falloff, and a `brightness` falloff by index — so later stages recede and dim at rest. Hovering or selecting a stage snaps it to `translateZ(32px)` at full brightness with its accent glow shadow. Conversion drop-off between adjacent stages is called out as a small `−N%` label on the connecting chevron.

## Do's and Don'ts

### Do:
- **Do** assign each of blue/cyan/violet to exactly one data meaning (primary/action, growth/positive, forecast/predictive) and keep that mapping consistent across KPIs, stage colors, and chart lines.
- **Do** render every data numeral — currency, percentage, count, date — in the `.tabular` monospaced class.
- **Do** use `.popover-surface`'s near-opaque fill for any overlay that must occlude content behind it (dropdowns, popovers, the drawer); treat backdrop-filter as supplementary, not load-bearing.
- **Do** make the funnel's 3D depth (perspective + rotateX + per-card translateZ/scale/brightness) visible at rest, with hover/selection only pushing a card further forward.
- **Do** disclose scope and provenance in plain text near the data it affects (e.g. the "sample data for demonstration" note, "YTD quota attainment" label) rather than letting a chart's real scope stay implicit.

### Don't:
- **Don't** mix the three accent hues decoratively on the same element, or introduce a fourth decorative accent; amber and rose stay reserved for risk/error signaling.
- **Don't** use thin `.glass`/`.glass-strong` surfaces for anything that must reliably hide content behind it — that's what caused the earlier stacking/occlusion bug this system now guards against via `.popover-surface`.
- **Don't** let an entrance animation leave a chart showing axes with no series on first paint; data-bearing chart elements render with `isAnimationActive={false}`.
- **Don't** introduce hard-offset/neobrutalist shadows, glyph icon fonts, or system display faces; every shadow in this system is soft and diffuse (Elevation vocabulary above), every icon is inline stroke-SVG, and every face is Inter or JetBrains Mono.
