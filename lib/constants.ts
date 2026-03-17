// ============================================================
// SLVR Calculator — All Data Constants
// Sources: IBM Cost of Data Breach 2025, Cyentia IRIS 2025
// ============================================================

import type {
  Industry,
  SecurityRole,
  GapSeverity,
  RegulatoryEnvironment,
  CompanySizeTier,
  VacancyType,
  SecurityMaturity,
} from './types';

// ——— Industry Core Data ——————————————————————————————————————
// annualBreachProb: Cyentia IRIS 2025 annual probability
// breachCostMillions: IBM Cost of Data Breach 2025 industry avg
// sectorRiskWeight: leadership impact multiplier
export const INDUSTRY_DATA: Record<
  Industry,
  { annualBreachProb: number; breachCostMillions: number; sectorRiskWeight: number }
> = {
  Healthcare:             { annualBreachProb: 0.89, breachCostMillions: 9.77, sectorRiskWeight: 2.5 },
  Fintech:                { annualBreachProb: 0.72, breachCostMillions: 6.80, sectorRiskWeight: 2.3 },
  'Financial Services':   { annualBreachProb: 0.65, breachCostMillions: 5.90, sectorRiskWeight: 2.2 },
  Healthtech:             { annualBreachProb: 0.85, breachCostMillions: 8.50, sectorRiskWeight: 2.4 },
  Technology:             { annualBreachProb: 0.52, breachCostMillions: 4.88, sectorRiskWeight: 1.8 },
  'Enterprise SaaS':      { annualBreachProb: 0.58, breachCostMillions: 5.20, sectorRiskWeight: 2.0 },
  'Cloud Security':       { annualBreachProb: 0.48, breachCostMillions: 4.50, sectorRiskWeight: 1.6 },
  'Cloud Infrastructure': { annualBreachProb: 0.54, breachCostMillions: 4.90, sectorRiskWeight: 1.9 },
  Retail:                 { annualBreachProb: 0.44, breachCostMillions: 3.50, sectorRiskWeight: 1.6 },
  Manufacturing:          { annualBreachProb: 0.36, breachCostMillions: 4.00, sectorRiskWeight: 1.4 },
  'Energy & Utilities':   { annualBreachProb: 0.42, breachCostMillions: 4.20, sectorRiskWeight: 2.0 },
  Education:              { annualBreachProb: 0.37, breachCostMillions: 3.20, sectorRiskWeight: 1.3 },
};

// ——— Beta Distribution Parameters (Breach Probability) ———————
// Derived from Cyentia IRIS 2025. α+β ≈ 165 (≈6 months empirical data).
// Healthcare Large calibration: α=6.2, β=158.8 (3.76% daily) — from spec.
// Size scaling: large = 2.5× medium, enterprise = 4× medium, small = 0.4× medium.
export const BREACH_PROB_PARAMS: Record<
  Industry,
  Record<CompanySizeTier, { alpha: number; beta: number }>
> = {
  Healthcare: {
    small:      { alpha: 1.00, beta: 164.00 },
    medium:     { alpha: 2.51, beta: 162.49 },
    large:      { alpha: 6.27, beta: 158.73 },
    enterprise: { alpha: 10.03, beta: 154.97 },
  },
  Fintech: {
    small:      { alpha: 0.81, beta: 164.19 },
    medium:     { alpha: 2.03, beta: 162.97 },
    large:      { alpha: 5.07, beta: 159.93 },
    enterprise: { alpha: 8.12, beta: 156.88 },
  },
  'Financial Services': {
    small:      { alpha: 0.73, beta: 164.27 },
    medium:     { alpha: 1.83, beta: 163.17 },
    large:      { alpha: 4.58, beta: 160.42 },
    enterprise: { alpha: 7.33, beta: 157.67 },
  },
  Healthtech: {
    small:      { alpha: 0.96, beta: 164.04 },
    medium:     { alpha: 2.40, beta: 162.60 },
    large:      { alpha: 5.99, beta: 159.01 },
    enterprise: { alpha: 9.58, beta: 155.42 },
  },
  Technology: {
    small:      { alpha: 0.59, beta: 164.41 },
    medium:     { alpha: 1.46, beta: 163.54 },
    large:      { alpha: 3.66, beta: 161.34 },
    enterprise: { alpha: 5.86, beta: 159.14 },
  },
  'Enterprise SaaS': {
    small:      { alpha: 0.65, beta: 164.35 },
    medium:     { alpha: 1.63, beta: 163.37 },
    large:      { alpha: 4.09, beta: 160.91 },
    enterprise: { alpha: 6.54, beta: 158.46 },
  },
  'Cloud Security': {
    small:      { alpha: 0.54, beta: 164.46 },
    medium:     { alpha: 1.35, beta: 163.65 },
    large:      { alpha: 3.38, beta: 161.62 },
    enterprise: { alpha: 5.41, beta: 159.59 },
  },
  'Cloud Infrastructure': {
    small:      { alpha: 0.61, beta: 164.39 },
    medium:     { alpha: 1.52, beta: 163.48 },
    large:      { alpha: 3.80, beta: 161.20 },
    enterprise: { alpha: 6.09, beta: 158.91 },
  },
  Retail: {
    small:      { alpha: 0.50, beta: 164.50 },
    medium:     { alpha: 1.24, beta: 163.76 },
    large:      { alpha: 3.10, beta: 161.90 },
    enterprise: { alpha: 4.96, beta: 160.04 },
  },
  Manufacturing: {
    small:      { alpha: 0.41, beta: 164.59 },
    medium:     { alpha: 1.01, beta: 163.99 },
    large:      { alpha: 2.54, beta: 162.46 },
    enterprise: { alpha: 4.06, beta: 160.94 },
  },
  'Energy & Utilities': {
    small:      { alpha: 0.47, beta: 164.53 },
    medium:     { alpha: 1.18, beta: 163.82 },
    large:      { alpha: 2.96, beta: 162.04 },
    enterprise: { alpha: 4.73, beta: 160.27 },
  },
  Education: {
    small:      { alpha: 0.42, beta: 164.58 },
    medium:     { alpha: 1.04, beta: 163.96 },
    large:      { alpha: 2.61, beta: 162.39 },
    enterprise: { alpha: 4.17, beta: 160.83 },
  },
};

// ——— Lognormal Parameters (Breach Cost) ——————————————————————
// mu = ln(IBM_industry_mean_dollars) - sigma²/2
// sigma = 0.6 (calibrated to IBM 2025 observed cost spread)
// Company size scaling applied deterministically via companySizeFactor()
export const LOGNORMAL_PARAMS: Record<Industry, { mu: number; sigma: number }> = {
  Healthcare:             { mu: 15.92, sigma: 0.6 },
  Fintech:                { mu: 15.55, sigma: 0.6 },
  'Financial Services':   { mu: 15.41, sigma: 0.6 },
  Healthtech:             { mu: 15.78, sigma: 0.6 },
  Technology:             { mu: 15.22, sigma: 0.6 },
  'Enterprise SaaS':      { mu: 15.28, sigma: 0.6 },
  'Cloud Security':       { mu: 15.14, sigma: 0.6 },
  'Cloud Infrastructure': { mu: 15.23, sigma: 0.6 },
  Retail:                 { mu: 14.89, sigma: 0.6 },
  Manufacturing:          { mu: 15.02, sigma: 0.6 },
  'Energy & Utilities':   { mu: 15.07, sigma: 0.6 },
  Education:              { mu: 14.80, sigma: 0.6 },
};

// ——— Triangular Regulatory Penalty Ranges ————————————————————
// 32% of breaches result in regulatory fines (IBM 2025)
// Source: IBM Cost of Data Breach 2025, sector-specific regulatory exposure
export const REGULATORY_PENALTY_PARAMS: Record<
  Industry,
  { min: number; mode: number; max: number }
> = {
  Healthcare:             { min: 25_000,   mode: 250_000,  max: 2_500_000  },
  Fintech:                { min: 50_000,   mode: 500_000,  max: 10_000_000 },
  'Financial Services':   { min: 50_000,   mode: 500_000,  max: 10_000_000 },
  Healthtech:             { min: 25_000,   mode: 300_000,  max: 3_000_000  },
  Technology:             { min: 10_000,   mode: 100_000,  max: 1_000_000  },
  'Enterprise SaaS':      { min: 10_000,   mode: 100_000,  max: 1_000_000  },
  'Cloud Security':       { min: 10_000,   mode: 150_000,  max: 2_000_000  },
  'Cloud Infrastructure': { min: 10_000,   mode: 150_000,  max: 2_000_000  },
  Retail:                 { min: 10_000,   mode: 75_000,   max: 500_000    },
  Manufacturing:          { min: 5_000,    mode: 50_000,   max: 500_000    },
  'Energy & Utilities':   { min: 25_000,   mode: 200_000,  max: 5_000_000  },
  Education:              { min: 5_000,    mode: 25_000,   max: 250_000    },
};

// ——— Role Risk Weights ————————————————————————————————————————
// Per-component multipliers applied every iteration
export const ROLE_RISK_WEIGHTS: Record<
  SecurityRole,
  { breach: number; regulatory: number; operational: number }
> = {
  CISO:                        { breach: 1.00, regulatory: 1.00, operational: 1.00 },
  'Deputy CISO':               { breach: 0.75, regulatory: 0.80, operational: 0.85 },
  'Head of Product Security':  { breach: 0.65, regulatory: 0.55, operational: 0.90 },
  'Head of GRC':               { breach: 0.40, regulatory: 1.20, operational: 0.60 },
  'Head of IAM':               { breach: 0.70, regulatory: 0.85, operational: 0.80 },
  'Head of Security Operations': { breach: 0.85, regulatory: 0.60, operational: 0.95 },
  'Head of Cloud Security':    { breach: 0.75, regulatory: 0.70, operational: 0.88 },
};

// ——— Efficiency Loss by Leadership Gap Severity ———————————————
export const EFFICIENCY_LOSS: Record<GapSeverity, number> = {
  Low:    0.15,
  Medium: 0.35,
  High:   0.65,
};

// ——— Compliance Gap Factor by Regulatory Environment ————————
// Assumption: Low=0.5, Medium=1.0, High=2.0, Critical=4.0
export const COMPLIANCE_GAP_FACTOR: Record<RegulatoryEnvironment, number> = {
  Low:      0.5,
  Medium:   1.0,
  High:     2.0,
  Critical: 4.0,
};

// ——— Correlation Matrix (3×3 for Gaussian copula) ————————————
// Breach Prob ↔ Breach Cost:        r = 0.35
// Breach Cost ↔ Regulatory Penalty: r = 0.42
// Breach Prob ↔ Regulatory Penalty: r = 0.00 (no direct correlation specified)
// Company Size ↔ Breach Cost (r=0.68) applied deterministically via companySizeFactor()
export const CORRELATION_MATRIX: number[][] = [
  [1.0,  0.35, 0.0 ],
  [0.35, 1.0,  0.42],
  [0.0,  0.42, 1.0 ],
];

// ——— Search Timeline Benchmarks ——————————————————————————————
// Source: IANS Research / Artico Search CISO Hiring Study
// Hitch Partners: verified internal search performance data
export const SEARCH_TIMELINES = {
  industry: 127,   // Industry typical (~127 days)
  general:   94,   // General search firms (~94 days)
  hitch:     62,   // Hitch Partners (~62 days)
} as const;

export const SEARCH_FEE = 75_000; // $75K benchmark placement fee for ROI ratio

// ——— Risk Level Thresholds (P50 no-breach daily CoV) ————————
export const RISK_THRESHOLDS = { low: 15_000, medium: 30_000 } as const;

// ——— Company Size Tier Boundaries ————————————————————————————
export const SIZE_TIER_BOUNDARIES = {
  small:      100,    // < $100M revenue
  medium:     1_000,  // $100M – $1B
  large:      10_000, // $1B – $10B
  // enterprise: > $10B
} as const;

// ——— Input Defaults ———————————————————————————————————————————
export const INPUT_DEFAULTS: import('./types').SimulationInputs = {
  industry:               'Healthcare' as Industry,
  role:                   'CISO' as SecurityRole,
  revenueMillions:        500,
  employees:              2_500,
  teamSize:               12,
  regulatoryEnvironment:  'Medium' as RegulatoryEnvironment,
  daysVacant:             90,
  hasInterim:             false,
  gapSeverity:            'Medium' as GapSeverity,
  breachOccurred:         false,
  vacancyType:            'succession' as VacancyType,
  maturity:               'High' as SecurityMaturity,
};

// ——— Slider Ranges ————————————————————————————————————————————
export const SLIDER_RANGES = {
  revenueMillions: { min: 1,  max: 50_000, step: 1   },
  employees:       { min: 10, max: 500_000, step: 10  },
  teamSize:        { min: 1,  max: 200,     step: 1   },
  daysVacant:      { min: 1,  max: 730,     step: 1   },
} as const;

// ——— Simulation Constants —————————————————————————————————————
export const N_ITERATIONS = 5_000;
export const BREACH_FINE_PROBABILITY = 0.32; // IBM 2025: 32% of breaches incur reg fines

// ——— UI Copy —————————————————————————————————————————————————
export const GAP_SEVERITY_HELPER =
  'Low = Strong interim + mature team  ·  Medium = Some coverage + average team  ·  High = No interim + immature team';

export const INDUSTRIES: Industry[] = [
  'Healthcare', 'Fintech', 'Financial Services', 'Healthtech',
  'Technology', 'Enterprise SaaS', 'Cloud Security', 'Cloud Infrastructure',
  'Retail', 'Manufacturing', 'Energy & Utilities', 'Education',
];

export const ROLES: SecurityRole[] = [
  'CISO', 'Deputy CISO', 'Head of Product Security', 'Head of GRC',
  'Head of IAM', 'Head of Security Operations', 'Head of Cloud Security',
];
