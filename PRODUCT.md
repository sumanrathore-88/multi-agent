# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (chosen by user). Deploy target: local/dev preview only for now; a static/production build can be generated later if needed — no hosting decision made yet.

## Users

Sales reps and sales managers at an IT company (cloud migration, cybersecurity, SaaS subscriptions, managed services, AI implementation) who need to track deals moving through the pipeline, forecast revenue, and spot at-risk opportunities.

## Product Purpose

A sales pipeline dashboard that gives an IT sales team a single, scannable view of pipeline health: total and weighted value, stage-by-stage conversion, deal-level detail, rep performance, and near-term risks/follow-ups — so reps and managers can act on what needs attention without digging through a CRM.

## Positioning

Not a general-purpose CRM. A focused, visually distinctive pipeline analytics surface: a staged/funnel pipeline view with per-stage deal count, value, and conversion rate, paired with forecast-vs-target charting and deal-level drill-down — purpose-built around IT-industry deal types rather than generic "sales" categories.

## Operating Context

Used by sales reps and managers reviewing pipeline state, filtering by date range, region, product/service line, deal owner, and pipeline stage; clicking into a stage or a deal row for detail; scanning rep performance and at-risk/upcoming-follow-up lists during pipeline reviews or forecasting check-ins.

## Capabilities and Constraints

- Interactive filters (date range, region, product/service, owner, stage) that drive the KPIs, pipeline visualization, forecast chart, and deal table.
- Pipeline stages: Lead, Qualified, Proposal, Negotiation, Closed Won — each showing deal count, total value, and conversion rate; clicking a stage surfaces its deals.
- Sortable deal activity table: deal name, client, value, stage, owner, probability, expected close date, next action; opening a row shows deal detail.
- Forecast chart comparing target, committed, and projected revenue over time.
- KPIs: total pipeline value, weighted forecast, win rate, deals closing this month, average sales cycle.
- Performance insights: top-performing reps, recently updated deals, at-risk opportunities, upcoming follow-ups.
- Explicit empty, loading, and error states required.
- No real backend/API in scope yet — data is realistic fabricated IT-industry sample data (explicitly requested by the brief, not placeholder/lorem-ipsum content). Future work must not present this sample data as real customer/company data.
- Responsive for desktop and tablet (not a phone-first requirement).
- No image-generation or stock-photo tool is available in this environment; the hero visual will be built as a code-native (SVG/CSS/WebGL) illustration rather than a sourced photo/raster asset.

## Brand Commitments

Company name: Indixpert (user-specified). Logged-in user shown in the top bar: Kailash Singh (user-specified). No logo, visual identity, or other brand assets beyond these two names were provided — the top bar's mark is still an authored abstract glyph, not a real logo. Treat anything else brand-related as a placeholder, not a confirmed fact.

## Evidence on Hand

No real company data, customers, deals, or brand assets were provided. All deal records, rep names, company names, and figures are fabricated sample data representative of IT-industry sales (cloud migration, cybersecurity, SaaS, managed services, AI implementation), per the brief's explicit instruction. Future work must not invent testimonials, case studies, or press, and must not imply this sample data is real.

## Product Principles

1. Scannability over decoration — 3D depth and motion support hierarchy, never obscure numbers or compete with data.
2. Every figure must look realistic and internally consistent (stage math, conversion rates, forecast totals should add up).
3. Interactive drill-down (stage → deals, deal → detail) is a core mechanism, not an enhancement.
4. Premium enterprise SaaS restraint: dark, confident surfaces with accent color used deliberately, not everywhere.
5. Handle the unhappy paths (empty/loading/error) as first-class states, not afterthoughts.

## Accessibility & Inclusion

Standard accessibility expected (keyboard operability, sufficient contrast on dark surfaces, legible chart labels/tooltips). No additional product-specific requirement beyond the brief's general "accessible" instruction.
