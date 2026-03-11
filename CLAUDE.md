# SLVR Calculator — Security Leader Vacancy Risk

## Project Overview
Executive-grade lead-generation tool for Hitch Partners. Quantifies CISO/security leader vacancy risk as a dollar figure. Pure client-side Next.js app — no backend.

**Design direction:** Bloomberg Terminal × McKinsey board deck. Dark navy (#0A1628), executive gold (#C4A55A), DM Mono for all numbers.

## North Star Goal
Translate a CISO vacancy into a credible dollar figure and demonstrate that Hitch Partners' faster placement (~62 days) delivers measurable ROI vs. industry average (~127 days).

## Stack
- **Framework**: Next.js 16 (App Router), TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui (base-ui variant — `@base-ui/react/*`)
- **Charts**: Recharts — dynamic import with `ssr: false` required
- **Fonts**: DM Sans (body) + DM Mono (numbers) via `next/font/google`
- **PDF Export**: react-to-print → `PrintReport.tsx`
- **Simulation**: Web Worker at `public/workers/simulation.worker.js`
- **Deployment**: Vercel (`npx vercel --prod` from `slvr-next/`)

## Current Session State
Dark theme redesign complete (Bloomberg × McKinsey direction). All components updated.

**Color tokens (defined in `globals.css` `:root`):**
| Token | Hex | Use |
|---|---|---|
| `--slvr-navy` | `#0A1628` | Page background |
| `--slvr-surface` | `#111E35` | Panel background |
| `--slvr-card-bg` | `#162040` | Card/block surfaces |
| `--slvr-border` | `#1E3A5F` | All borders, dividers |
| `--slvr-gold` | `#C4A55A` | Primary accent, CTA button |
| `--slvr-gold-dim` | `#F0C674` | Hero number, P50 data values |
| `--slvr-teal` | `#2DD4BF` | Positive/Hitch highlights |
| `--slvr-muted-text` | `#6B7FA3` | Labels, captions |
| `--slvr-text` | `#E8EDF5` | Body text |

**Typography utilities (in `globals.css`):** `.text-display` (52–60px DM Mono hero), `.text-data` (16px mono), `.text-data-sm` (13px mono), `.text-label` (11px uppercase tracking), `.slvr-section-divider`, `.skeleton-dark`.

**Results panel structure (3 sections):**
1. Executive Risk Summary — `HeroMetricStrip` + ScenarioCards
2. Risk Decomposition — MonteCarloCallout + ComponentBreakdown + charts
3. Accelerate the Search — SearchROICard + BreachWarning + CTASection

**New component:** `components/blocks/HeroMetricStrip.tsx` — P50 daily cost at display scale, risk chip, total exposure.

## Key Files
| File | Purpose |
|------|---------|
| `app/globals.css` | Dark theme tokens, SLVR custom props, type scale |
| `public/workers/simulation.worker.js` | Core MC engine — plain JS, no imports |
| `lib/constants.ts` | Industry data, Beta params, role weights |
| `hooks/useSimulation.ts` | Worker lifecycle + 300ms debounce |
| `components/InputPanel.tsx` | Left column — 10 inputs |
| `components/ResultsPanel.tsx` | Right column — 3-section structure |
| `components/blocks/HeroMetricStrip.tsx` | Hero P50 metric display |
| `components/blocks/CumulativeCostChart.tsx` | Gold P50 line, dark grid (dynamic import) |
| `components/PrintReport.tsx` | PDF export (light theme, separate print.css) |

## shadcn/ui Notes (base-ui variant)
- `Button`: no `asChild` — use plain `<a>` styled as button
- `Slider`: `onValueChange` receives `number | readonly number[]`
- `Select`: `onValueChange` receives `T | null` — null-check before casting

## Component Breakdown
Uses **mean** (not P50) for all three components. Regulatory P50 = $0 (68% of iterations have no fine).

## Placeholders — Replace Before Launch
- `CTASection.tsx`: `CONTACT_URL` and `METHODOLOGY_URL` (both `#`)
- `PrintReport.tsx`: Text logo → `<img>` with Hitch Partners logo

## Development
```bash
cd slvr-next
npm run dev    # port 3001
npm run build  # verify TypeScript
```

## Data Sources
IBM Cost of Data Breach 2025 · Cyentia IRIS 2025 · IANS Research / Artico Search CISO Hiring Study · Hitch Partners internal placement data
