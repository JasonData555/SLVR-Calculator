# SLVR Calculator — Security Leader Vacancy Risk

## Project Overview
Executive-grade lead-generation tool for Hitch Partners that quantifies the financial risk of vacant cybersecurity leadership positions. Built as a pure client-side Next.js application with a Monte Carlo simulation engine.

## North Star Goal
Help security leaders and boards understand the true financial cost of a CISO/security leader vacancy — and demonstrate that Hitch Partners' faster placement (~62 days) delivers measurable ROI vs. industry-average searches (~127 days).

## Stack
- **Framework**: Next.js 16 (App Router), TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (base-ui variant — uses `@base-ui/react/*`)
- **Charts**: Recharts (dynamic import with `ssr: false` required)
- **Fonts**: DM Sans (body) + DM Mono (numbers) via `next/font/google`
- **PDF Export**: react-to-print
- **Simulation**: Web Worker at `public/workers/simulation.worker.js`
- **Deployment**: Vercel (pure client-side, no backend needed)

## Architecture

### Simulation Engine (`public/workers/simulation.worker.js`)
Plain JS Web Worker — no imports allowed. Runs 5,000 Monte Carlo iterations × 2 scenarios (no-breach / with-breach) off the main thread.

Key formulas:
- **Breach probability**: Beta distribution (Marsaglia-Tsang via Gamma ratio), parameters from `BREACH_PROB_PARAMS[industry][sizeTier]`
- **Breach cost**: Lognormal distribution, `exp(mu + sigma * z)`, parameters from `LOGNORMAL_PARAMS[industry]`
- **Regulatory penalty**: Triangular CDF inversion (32% of iterations incur a penalty)
- **Correlation**: Gaussian copula via Cholesky decomposition (3×3 matrix: breach_prob ↔ breach_cost r=0.35, breach_cost ↔ regulatory r=0.42)
- **Vacancy risk multiplier**: `1.0 + 0.20 * ln(1 + days/30) - (0.40 if interim)`
- **Company size factor**: `min(2.0, ln(revenue/100)/2 + 1)`
- **Deterministic estimate**: Uses Beta mean × lognormal mean (same baseline as MC) for apples-to-apples comparison

### Data Flow
```
SimulationInputs (useState in page.tsx)
  → useDebounce (300ms)
  → useSimulation hook (manages Worker lifecycle)
  → Web Worker (5,000 iterations)
  → SimulationOutput (postMessage)
  → ResultsPanel (9 blocks)
```

### Key Files
| File | Purpose |
|------|---------|
| `public/workers/simulation.worker.js` | Core MC engine — most complex file |
| `lib/constants.ts` | All industry data, Beta params, role weights |
| `lib/types.ts` | All TypeScript interfaces |
| `hooks/useSimulation.ts` | Worker lifecycle + debounce |
| `components/InputPanel.tsx` | Left column — 10 inputs |
| `components/ResultsPanel.tsx` | Right column — 9 result blocks |
| `components/blocks/CumulativeCostChart.tsx` | Primary visualization (dynamic import) |
| `components/PrintReport.tsx` | PDF export via react-to-print |
| `app/page.tsx` | Root state, 40/60 layout |

## shadcn/ui Notes
This project uses the **base-ui variant** of shadcn (NOT Radix UI). Key differences:
- `Button` does NOT support `asChild` prop — use plain `<a>` tags styled as buttons instead
- `Slider` `onValueChange` receives `number | readonly number[]`, not `number[]`
- `Select` `onValueChange` receives `T | null` — always null-check before casting

## Component Breakdown Display
`componentBreakdown` in the worker uses **mean** (not P50) for all three components. Regulatory P50 would be $0 since 68% of iterations have no fine — mean gives the expected daily cost.

## Monte Carlo Uplift
Shows `(MC_mean - deterministic) / deterministic × 100%`. Typically ~10-20%, reflecting the correlation premium from Cholesky copula and lognormal tail effects vs. the simple product-of-means deterministic estimate.

## Placeholders (replace before launch)
- `CTASection.tsx`: Two `[PLACEHOLDER]` button URLs
  - "Schedule a Conversation" → Hitch Partners calendar link
  - "Download Methodology Paper" → PDF URL
- `PrintReport.tsx`: Replace text logo with image logo

## Development
```bash
cd slvr-next
npm run dev    # port 3001 (see .claude/launch.json)
npm run build  # verify no TypeScript errors
```

## Deployment
```bash
# From slvr-next/
npx vercel --prod
# No env vars needed — pure client-side
```

## Data Sources
- IBM Cost of a Data Breach Report 2025
- Cyentia IRIS 2025
- IANS Research / Artico Search CISO Hiring Study
- Hitch Partners internal search performance data
