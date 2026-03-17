// ============================================================
// SLVR Calculator — Shared TypeScript Types
// ============================================================

export type Industry =
  | 'Healthcare'
  | 'Fintech'
  | 'Financial Services'
  | 'Healthtech'
  | 'Technology'
  | 'Enterprise SaaS'
  | 'Cloud Security'
  | 'Cloud Infrastructure'
  | 'Retail'
  | 'Manufacturing'
  | 'Energy & Utilities'
  | 'Education';

export type SecurityRole =
  | 'CISO'
  | 'Deputy CISO'
  | 'Head of Product Security'
  | 'Head of GRC'
  | 'Head of IAM'
  | 'Head of Security Operations'
  | 'Head of Cloud Security';

export type RiskLevel = 'Low' | 'Medium' | 'High';
export type GapSeverity = 'Low' | 'Medium' | 'High';
export type RegulatoryEnvironment = 'Low' | 'Medium' | 'High' | 'Critical';
export type CompanySizeTier = 'small' | 'medium' | 'large' | 'enterprise';
export type VacancyType = 'succession' | 'organizational';
export type SecurityMaturity = 'Advanced' | 'High' | 'Medium' | 'Low';

// ——— Simulation Inputs ———————————————————————————————————————
export interface SimulationInputs {
  industry: Industry;
  role: SecurityRole;
  revenueMillions: number;     // $1M – $50,000M
  employees: number;           // 10 – 500,000 (used for context / PDF)
  teamSize: number;            // 1 – 200
  regulatoryEnvironment: RegulatoryEnvironment;
  daysVacant: number;          // 1 – 730
  hasInterim: boolean;
  gapSeverity: GapSeverity;
  breachOccurred: boolean;
  vacancyType: VacancyType;    // succession = inherited program; organizational = no prior program
  maturity: SecurityMaturity | null; // null when vacancyType = 'organizational'
}

// ——— Worker I/O —————————————————————————————————————————————
export interface WorkerParams extends SimulationInputs {
  // SimulationInputs passed directly to the worker
}

export interface CumulativeDataPoint {
  day: number;
  p10: number;
  p50: number;
  p90: number;
}

export interface ScenarioResult {
  p10Daily: number;
  p50Daily: number;
  p90Daily: number;
  p10Total: number;
  p50Total: number;
  p90Total: number;
  meanDaily: number;
  meanTotal: number;
  cumulativeByDay: CumulativeDataPoint[];
  iterations: number[];        // all 5,000 total CoV values for histogram
}

export interface SearchROI {
  industryExposure: number;    // p50Daily × 127
  generalExposure: number;     // p50Daily × 94
  hitchExposure: number;       // p50Daily × 62
  netRiskReduction: number;    // industryExposure − hitchExposure
  roiRatio: string;            // e.g. "9:1" vs $75K search fee
}

export interface ComponentBreakdown {
  breach: number;
  regulatory: number;
  operational: number;
}

export interface ControlInheritanceOutput {
  vacancyType: VacancyType;
  maturity: SecurityMaturity | null;
  initialDiscount: number;
  cliffDay: number | null;
  discountAtDay1: number;
  discountAtDay30: number;
  discountAtDay60: number;
  discountAtDay90: number;
  dailySavingAtDay1: number;
  dailySavingAtDay30: number;
  dailySavingAtDay60: number;
  dailySavingAtDay90: number;
  isActive: boolean;
}

export interface SimulationOutput {
  noBreach: ScenarioResult;
  withBreach: ScenarioResult;
  deterministicEstimate: number;
  monteCarloUplift: number;    // % by which P50 exceeds deterministic
  riskLevel: RiskLevel;
  searchROI: SearchROI;
  componentBreakdown: ComponentBreakdown;  // P50 daily per component (no-breach)
  controlInheritance: ControlInheritanceOutput;
  cumulativeByDayBaseline: CumulativeDataPoint[]; // organizational baseline for chart
}
