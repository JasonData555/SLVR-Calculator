# SLVR Calculator — Security Leader Vacancy Risk

## Project Overview
Executive-grade lead-generation tool for Hitch Partners. Quantifies CISO/security leader vacancy risk as a dollar figure. Pure client-side Next.js app — no backend.

**Design direction:** Light institutional — McKinsey research report meets Bloomberg data density. Paper background (#F7F9FB), steel blue (#5B7C99) header bar is the only dark element. Authoritative, clinical, data-forward. Feels like it belongs in a board package.

## North Star Goal
Translate a CISO vacancy into a credible dollar figure and demonstrate that Hitch Partners' faster placement (~62 days) delivers measurable ROI vs. industry average (~127 days).

## Stack
- **Framework**: Next.js 16 (App Router), TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui (base-ui variant — `@base-ui/react/*`)
- **Charts**: Recharts — dynamic import with `ssr: false` required
- **Fonts**: DM Sans (UI/labels) + DM Mono (all numbers) + Libre Baskerville (display headings) via `next/font/google`
- **PDF Export**: react-to-print → `PrintReport.tsx`
- **Simulation**: Web Worker at `public/workers/simulation.worker.js`
- **Deployment**: Vercel — connected via GitHub (`github.com/JasonData555/SLVR-Calculator`, auto-deploy on push to `main`)

## Design System

**Color tokens (defined in `globals.css` `:root`):**
| Token | Hex | Use |
|---|---|---|
| `--navy` | `#0F1729` | Heading text, slider/toggle on-state, chart lines, P50 figures |
| `--steel` | `#5B7C99` | Header bar, primary buttons (hover: #4A6B88) |
| `--navy-mid` | `#1E3A5F` | Subheadings, active states, hover states |
| `--navy-light` | `#EBF1F8` | Callout backgrounds, stat card fills |
| `--navy-faint` | `#F5F8FC` | Alternating fills, input panel background |
| `--paper` | `#F7F9FB` | Page background |
| `--white` | `#FFFFFF` | Card backgrounds, main content area |
| `--rule` | `#DDE3EC` | All dividers, card borders |
| `--text-primary` | `#1A2332` | All body text |
| `--text-mid` | `#3D5068` | Secondary labels, helper text |
| `--text-muted` | `#7A8FA6` | Timestamps, footnotes, section labels |
| `--green` | `#15803D` | Low risk text |
| `--green-bg` | `#F0FDF4` | Low risk badge background |
| `--amber` | `#B45309` | Medium risk text |
| `--amber-bg` | `#FFFBEB` | Medium risk badge background |
| `--red` | `#B91C1C` | High risk text, breach card accents |
| `--red-bg` | `#FEF2F2` | High risk badge background |
| `--accent` | `#1D4ED8` | Chart primary series, links, MC uplift % |

**Typography:**
- `Libre Baskerville` — display headings (page header title, CTA headline). Variable: `--font-libre-baskerville`
- `DM Sans` — all UI labels, helper text, button text, badge text. Variable: `--font-dm-sans`
- `DM Mono` — ALL dollar amounts, ALL percentages, ALL numeric outputs. Variable: `--font-dm-mono`

**Typography utilities (in `globals.css`):**
- `.text-display` — 48px DM Mono, navy, for hero P50 figure
- `.text-serif-display` — Libre Baskerville bold, navy
- `.text-data` — 16px DM Mono, weight 500
- `.text-data-sm` — 13px DM Mono, weight 400
- `.text-label` — 9px DM Sans, weight 600, letter-spacing 0.14em, uppercase, muted color
- `.slvr-section-divider` — flex row with flanking `#DDE3EC` rules
- `.skeleton-dark` / `.skeleton-light` — `#EBF1F8` pulse skeleton (light theme)

## Results Panel Structure (3 sections)
1. **Executive Risk Summary** — `HeroMetricStrip` + `ScenarioCards`
2. **Risk Decomposition** — `MonteCarloCallout` + `ComponentBreakdown` + `CumulativeCostChart` + `ScenarioRiskSummary`
3. **Accelerate the Search** — `SearchROICard` + `BreachWarning` + `CTASection`

## Key Files
| File | Purpose |
|------|---------|
| `app/globals.css` | Light institutional tokens, type scale |
| `app/layout.tsx` | Fonts (DM Sans, DM Mono, Libre Baskerville), OG metadata |
| `public/workers/simulation.worker.js` | Core MC engine — plain JS, no imports |
| `lib/constants.ts` | Industry data, Beta params, role weights |
| `hooks/useSimulation.ts` | Worker lifecycle + 300ms debounce |
| `components/InputPanel.tsx` | Left column — 10 inputs |
| `components/ResultsPanel.tsx` | Right column — 3-section structure + slim status bar |
| `components/blocks/HeroMetricStrip.tsx` | 48px DM Mono P50 figure, static risk badge, 90-day total |
| `components/blocks/CumulativeCostChart.tsx` | Navy P50 line (2.5px), 10-tick X-axis, semantic reference lines (dynamic import) |
| `components/blocks/ScenarioRiskSummary.tsx` | Three-column P10/P50/P90 stat cards + gradient range bar (replaces HistogramChart) |
| `components/PrintReport.tsx` | PDF export (light theme, separate print.css) |

## shadcn/ui Notes (base-ui variant)
- `Button`: no `asChild` — use plain `<a>` styled as button
- `Slider`: `onValueChange` receives `number | readonly number[]` — navy track/thumb
- `Switch`: `data-checked` state is navy `#0F1729`, not blue
- `Select`: `onValueChange` receives `T | null` — null-check before casting

## Component Breakdown
Uses **mean** (not P50) for all three components. Regulatory P50 = $0 (68% of iterations have no fine).

## Placeholders — Replace Before Final Launch
- `CTASection.tsx`: `CONTACT_URL` and `METHODOLOGY_URL` — currently `hitchpartners.com`, update to specific page URLs
- `PrintReport.tsx`: Text logo → `<img>` with Hitch Partners logo

## Development
```bash
cd slvr-next
npm run dev    # port 3001
npm run build  # verify TypeScript
```

## Data Sources
IBM Cost of Data Breach 2025 · Cyentia IRIS 2025 · IANS Research / Artico Search CISO Hiring Study · Hitch Partners internal placement data
