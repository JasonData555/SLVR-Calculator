/**
 * SLVR Calculator — Monte Carlo Simulation Web Worker
 *
 * Runs 5,000 iterations × 2 scenarios off the main thread.
 * Implements Gaussian copula with Cholesky decomposition for
 * correlated sampling of breach probability, breach cost, and
 * regulatory penalties.
 *
 * Correlation structure (from spec):
 *   Breach Prob ↔ Breach Cost:        r = 0.35
 *   Breach Cost ↔ Regulatory Penalty: r = 0.42
 *   Company Size ↔ Breach Cost:       r = 0.68 (applied deterministically via companySizeFactor)
 */

// ============================================================
// CONSTANTS (mirrored from lib/constants.ts — worker can't import TS)
// ============================================================

const N_ITERATIONS = 5000;
const BREACH_FINE_PROBABILITY = 0.32;
const SEARCH_FEE = 75000;
const SEARCH_TIMELINES = { industry: 127, general: 94, hitch: 62 };

const INDUSTRY_DATA = {
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

const BREACH_PROB_PARAMS = {
  Healthcare:             { small:{alpha:1.00,beta:164.00}, medium:{alpha:2.51,beta:162.49}, large:{alpha:6.27,beta:158.73}, enterprise:{alpha:10.03,beta:154.97} },
  Fintech:                { small:{alpha:0.81,beta:164.19}, medium:{alpha:2.03,beta:162.97}, large:{alpha:5.07,beta:159.93}, enterprise:{alpha:8.12,beta:156.88} },
  'Financial Services':   { small:{alpha:0.73,beta:164.27}, medium:{alpha:1.83,beta:163.17}, large:{alpha:4.58,beta:160.42}, enterprise:{alpha:7.33,beta:157.67} },
  Healthtech:             { small:{alpha:0.96,beta:164.04}, medium:{alpha:2.40,beta:162.60}, large:{alpha:5.99,beta:159.01}, enterprise:{alpha:9.58,beta:155.42} },
  Technology:             { small:{alpha:0.59,beta:164.41}, medium:{alpha:1.46,beta:163.54}, large:{alpha:3.66,beta:161.34}, enterprise:{alpha:5.86,beta:159.14} },
  'Enterprise SaaS':      { small:{alpha:0.65,beta:164.35}, medium:{alpha:1.63,beta:163.37}, large:{alpha:4.09,beta:160.91}, enterprise:{alpha:6.54,beta:158.46} },
  'Cloud Security':       { small:{alpha:0.54,beta:164.46}, medium:{alpha:1.35,beta:163.65}, large:{alpha:3.38,beta:161.62}, enterprise:{alpha:5.41,beta:159.59} },
  'Cloud Infrastructure': { small:{alpha:0.61,beta:164.39}, medium:{alpha:1.52,beta:163.48}, large:{alpha:3.80,beta:161.20}, enterprise:{alpha:6.09,beta:158.91} },
  Retail:                 { small:{alpha:0.50,beta:164.50}, medium:{alpha:1.24,beta:163.76}, large:{alpha:3.10,beta:161.90}, enterprise:{alpha:4.96,beta:160.04} },
  Manufacturing:          { small:{alpha:0.41,beta:164.59}, medium:{alpha:1.01,beta:163.99}, large:{alpha:2.54,beta:162.46}, enterprise:{alpha:4.06,beta:160.94} },
  'Energy & Utilities':   { small:{alpha:0.47,beta:164.53}, medium:{alpha:1.18,beta:163.82}, large:{alpha:2.96,beta:162.04}, enterprise:{alpha:4.73,beta:160.27} },
  Education:              { small:{alpha:0.42,beta:164.58}, medium:{alpha:1.04,beta:163.96}, large:{alpha:2.61,beta:162.39}, enterprise:{alpha:4.17,beta:160.83} },
};

const LOGNORMAL_PARAMS = {
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

const REGULATORY_PENALTY_PARAMS = {
  Healthcare:             { min: 25000,   mode: 250000,  max: 2500000  },
  Fintech:                { min: 50000,   mode: 500000,  max: 10000000 },
  'Financial Services':   { min: 50000,   mode: 500000,  max: 10000000 },
  Healthtech:             { min: 25000,   mode: 300000,  max: 3000000  },
  Technology:             { min: 10000,   mode: 100000,  max: 1000000  },
  'Enterprise SaaS':      { min: 10000,   mode: 100000,  max: 1000000  },
  'Cloud Security':       { min: 10000,   mode: 150000,  max: 2000000  },
  'Cloud Infrastructure': { min: 10000,   mode: 150000,  max: 2000000  },
  Retail:                 { min: 10000,   mode: 75000,   max: 500000   },
  Manufacturing:          { min: 5000,    mode: 50000,   max: 500000   },
  'Energy & Utilities':   { min: 25000,   mode: 200000,  max: 5000000  },
  Education:              { min: 5000,    mode: 25000,   max: 250000   },
};

const ROLE_RISK_WEIGHTS = {
  'CISO':                        { breach: 1.00, regulatory: 1.00, operational: 1.00 },
  'Deputy CISO':                 { breach: 0.75, regulatory: 0.80, operational: 0.85 },
  'Head of Product Security':    { breach: 0.65, regulatory: 0.55, operational: 0.90 },
  'Head of GRC':                 { breach: 0.40, regulatory: 1.20, operational: 0.60 },
  'Head of IAM':                 { breach: 0.70, regulatory: 0.85, operational: 0.80 },
  'Head of Security Operations': { breach: 0.85, regulatory: 0.60, operational: 0.95 },
  'Head of Cloud Security':      { breach: 0.75, regulatory: 0.70, operational: 0.88 },
};

const EFFICIENCY_LOSS = { Low: 0.15, Medium: 0.35, High: 0.65 };
const COMPLIANCE_GAP_FACTOR = { Low: 0.5, Medium: 1.0, High: 2.0, Critical: 4.0 };

// Correlation matrix: [breachProb, breachCost, regulatoryPenalty]
const CORR = [
  [1.0,  0.35, 0.0 ],
  [0.35, 1.0,  0.42],
  [0.0,  0.42, 1.0 ],
];

// Control Inheritance: decay constants per security maturity level
const CONTROL_INHERITANCE = {
  Advanced: { initialDiscount: 0.35, lambda: 0.008 },
  High:     { initialDiscount: 0.25, lambda: 0.012 },
  Medium:   { initialDiscount: 0.15, lambda: 0.018 },
  Low:      { initialDiscount: 0.05, lambda: 0.025 },
};
const MEANINGFUL_PROTECTION_THRESHOLD = 0.10;

// ============================================================
// MATH UTILITIES
// ============================================================

/**
 * Polar Box-Muller: returns one standard normal sample.
 * More numerically stable than trig version.
 */
function normalSample() {
  let u, v, s;
  do {
    u = Math.random() * 2 - 1;
    v = Math.random() * 2 - 1;
    s = u * u + v * v;
  } while (s >= 1 || s === 0);
  return u * Math.sqrt(-2.0 * Math.log(s) / s);
}

/**
 * Marsaglia-Tsang method for Gamma(shape, 1) sampling.
 * Efficient for shape >= 1; handles shape < 1 via Ahrens-Dieter trick.
 */
function sampleGamma(shape) {
  if (shape < 1.0) {
    return sampleGamma(1.0 + shape) * Math.pow(Math.random(), 1.0 / shape);
  }
  const d = shape - 1.0 / 3.0;
  const c = 1.0 / Math.sqrt(9.0 * d);
  for (;;) {
    let x, v;
    do {
      x = normalSample();
      v = 1.0 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = Math.random();
    if (u < 1.0 - 0.0331 * x * x * x * x) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1.0 - v + Math.log(v))) return d * v;
  }
}

/**
 * Beta(alpha, beta) via Gamma ratio: X/(X+Y) where X~Gamma(alpha), Y~Gamma(beta).
 */
function sampleBeta(alpha, beta) {
  const x = sampleGamma(alpha);
  const y = sampleGamma(beta);
  return x / (x + y);
}

/**
 * Error function approximation (Abramowitz & Stegun 7.1.26).
 * Max error: 1.5 × 10^-7.
 */
function erf(x) {
  const t = 1.0 / (1.0 + 0.3275911 * Math.abs(x));
  const poly = t * (0.254829592 +
    t * (-0.284496736 +
    t * (1.421413741 +
    t * (-1.453152027 +
    t * 1.061405429))));
  const result = 1.0 - poly * Math.exp(-x * x);
  return x >= 0 ? result : -result;
}

/** Standard normal CDF via erf approximation. */
function normalCDF(z) {
  return 0.5 * (1.0 + erf(z / Math.SQRT2));
}

/**
 * Triangular distribution inverse CDF.
 * fc = (mode - min) / (max - min)
 */
function sampleTriangularFromU(u, min, mode, max) {
  const fc = (mode - min) / (max - min);
  if (u < fc) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  } else {
    return max - Math.sqrt((1.0 - u) * (max - min) * (max - mode));
  }
}

/**
 * Cholesky decomposition of a symmetric positive-definite matrix.
 * Returns lower-triangular L such that L × Lᵀ = A.
 */
function choleskyDecompose(A) {
  const n = A.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;
      for (let k = 0; k < j; k++) sum += L[i][k] * L[j][k];
      if (i === j) {
        L[i][j] = Math.sqrt(A[i][i] - sum);
      } else {
        L[i][j] = (A[i][j] - sum) / L[j][j];
      }
    }
  }
  return L;
}

// ============================================================
// DERIVED FACTORS (deterministic — same spec formulas)
// ============================================================

/**
 * Returns the control inheritance discount at a given day.
 * Exponential decay: initialDiscount × e^(-lambda × daysVacant)
 * Returns 0 for organizational vacancies (no inherited program).
 */
function getControlInheritanceDiscount(vacancyType, maturity, daysVacant) {
  if (vacancyType === 'organizational' || !maturity) return 0;
  const params = CONTROL_INHERITANCE[maturity];
  if (!params) return 0;
  return params.initialDiscount * Math.exp(-params.lambda * daysVacant);
}

function vacancyRiskMultiplier(daysVacant, hasInterim, vacancyType, maturity) {
  const controlDiscount = getControlInheritanceDiscount(vacancyType, maturity, daysVacant);
  return (1.0 - controlDiscount)
    + 0.20 * Math.log(1.0 + daysVacant / 30.0)
    - (hasInterim ? 0.40 : 0.0);
}

function companySizeFactor(revenueMillions) {
  if (revenueMillions <= 0) return 1.0;
  return Math.min(2.0, Math.log(revenueMillions / 100.0) / 2.0 + 1.0);
}

function dailySecurityBudget(revenueMillions) {
  return (revenueMillions * 1e6 * 0.04 * 0.10) / 365.0;
}

function teamSizeMultiplier(teamSize) {
  return Math.min(2.0, 1.0 + (teamSize - 5) * 0.1);
}

function getCompanySizeTier(revenueMillions) {
  if (revenueMillions < 100)   return 'small';
  if (revenueMillions < 1000)  return 'medium';
  if (revenueMillions < 10000) return 'large';
  return 'enterprise';
}

// ============================================================
// STATISTICS
// ============================================================

function percentile(arr, p) {
  const sorted = Float64Array.from(arr).sort();
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

function mean(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i];
  return sum / arr.length;
}

// ============================================================
// DETERMINISTIC ESTIMATE (point estimate, no sampling)
// ============================================================

function computeDeterministic(params) {
  const { industry, role, revenueMillions, teamSize, daysVacant,
          hasInterim, gapSeverity, regulatoryEnvironment,
          vacancyType, maturity } = params;

  const ind      = INDUSTRY_DATA[industry];
  const rw       = ROLE_RISK_WEIGHTS[role];
  const vrm      = vacancyRiskMultiplier(daysVacant, hasInterim, vacancyType, maturity);
  const csf      = companySizeFactor(revenueMillions);
  const dBudg    = dailySecurityBudget(revenueMillions);
  const tMult    = teamSizeMultiplier(teamSize);
  const cgf      = COMPLIANCE_GAP_FACTOR[regulatoryEnvironment];
  const effL     = EFFICIENCY_LOSS[gapSeverity];
  const regP     = REGULATORY_PENALTY_PARAMS[industry];
  const sizeTier = getCompanySizeTier(revenueMillions);
  const betaP    = BREACH_PROB_PARAMS[industry][sizeTier];

  // Breach: use Beta distribution mean (same base as MC) × lognormal mean
  // This aligns the deterministic baseline with the Monte Carlo model so that
  // the "uplift" reflects only correlation/tail premiums, not baseline differences.
  const dailyBaseProb = betaP.alpha / (betaP.alpha + betaP.beta);
  // Lognormal mean = exp(mu + sigma²/2)
  const lnP = LOGNORMAL_PARAMS[industry];
  const meanBreachCost = Math.exp(lnP.mu + 0.5 * lnP.sigma * lnP.sigma) * csf;
  const daily_breach = dailyBaseProb * vrm * meanBreachCost
    * ind.sectorRiskWeight * rw.breach;

  // Regulatory: expected penalty (mean of triangular × 32% fine probability)
  const meanPenalty = (regP.min + regP.mode + regP.max) / 3.0;
  const daily_regulatory = (BREACH_FINE_PROBABILITY * meanPenalty * cgf * csf / 365.0) * rw.regulatory;

  // Operational
  const daily_operational = dBudg * effL * tMult * rw.operational;

  return (daily_breach + daily_regulatory + daily_operational) * daysVacant;
}

// ============================================================
// PER-ITERATION MONTE CARLO
// ============================================================

/**
 * Gaussian copula sampling:
 * 1. Draw 3 independent N(0,1).
 * 2. Correlate via Cholesky: z_corr = L × z_ind.
 * 3. Map to target distributions using normal CDF + inverse CDF.
 *
 * Breach prob: Wilson-Hilferty Gamma approximation via correlated z_corr[0].
 *   betainv(Φ(z), α, β) ≈ gammaInvWH(z, α) / β  [accurate for α << β]
 * Breach cost: exact lognormal via z_corr[1].
 * Regulatory:  exact triangular CDF inversion via Φ(z_corr[2]).
 */
function runIteration(L, betaP, lnP, regP, rw, vrm, csf, dBudg, tMult, cgf, effL, daysVacant, withBreach, sectorRiskWeight) {
  // Step 1: independent N(0,1)
  const z0 = normalSample();
  const z1 = normalSample();
  const z2 = normalSample();

  // Step 2: correlated normals via lower-triangular Cholesky multiply
  const c0 = L[0][0] * z0;
  const c1 = L[1][0] * z0 + L[1][1] * z1;
  const c2 = L[2][0] * z0 + L[2][1] * z1 + L[2][2] * z2;

  // Step 3a: Breach probability via Wilson-Hilferty Gamma approximation
  // gammainv(u, α) ≈ α * (1 - 1/(9α) + z/√(9α))³  [W-H cube-root]
  // betainv(u, α, β) ≈ gammainv(u, α) / (α + β)  [valid for α << β]
  const alpha = betaP.alpha;
  const beta  = betaP.beta;
  const k     = 1.0 / (9.0 * alpha);
  const wh    = alpha * Math.pow(Math.max(0, 1.0 - k + c0 * Math.sqrt(k)), 3.0);
  const sampledBreachProb = Math.max(1e-10, Math.min(1.0 - 1e-10, wh / (alpha + beta)));

  // Step 3b: Breach cost — exact lognormal via correlated normal c1
  const sampledBreachCost = Math.exp(lnP.mu + lnP.sigma * c1) * csf;

  // Step 3c: Regulatory penalty — triangular CDF inversion via Φ(c2)
  const u2 = normalCDF(c2);
  const hasFinePenalty = Math.random() < BREACH_FINE_PROBABILITY;
  const sampledPenalty = hasFinePenalty
    ? sampleTriangularFromU(u2, regP.min, regP.mode, regP.max)
    : 0;

  // Step 4: per-component daily costs
  const daily_breach     = sampledBreachProb * vrm * sampledBreachCost * sectorRiskWeight * rw.breach;
  const daily_regulatory = (sampledPenalty * cgf * csf / 365.0) * rw.regulatory;
  const daily_operational = dBudg * effL * tMult * rw.operational;

  const daily_cov = daily_breach + daily_regulatory + daily_operational;
  let total_cov = daily_cov * daysVacant;

  // Step 5: breach scenario — add one-time lognormal breach cost draw
  if (withBreach) {
    total_cov += Math.exp(lnP.mu + lnP.sigma * normalSample()) * csf;
  }

  return { total_cov, daily_breach, daily_regulatory, daily_operational };
}

// ============================================================
// MAIN WORKER
// ============================================================

self.onmessage = function (e) {
  const params = e.data;
  const {
    industry, role, revenueMillions, teamSize,
    daysVacant, hasInterim, gapSeverity, regulatoryEnvironment,
    vacancyType, maturity,
  } = params;

  // Pre-compute deterministic factors (once)
  const L                = choleskyDecompose(CORR);
  const sizeTier         = getCompanySizeTier(revenueMillions);
  const betaP            = BREACH_PROB_PARAMS[industry][sizeTier];
  const lnP              = LOGNORMAL_PARAMS[industry];
  const regP             = REGULATORY_PENALTY_PARAMS[industry];
  const rw               = ROLE_RISK_WEIGHTS[role];
  const vrm              = vacancyRiskMultiplier(daysVacant, hasInterim, vacancyType, maturity);
  const csf              = companySizeFactor(revenueMillions);
  const dBudg            = dailySecurityBudget(revenueMillions);
  const tMult            = teamSizeMultiplier(teamSize);
  const cgf              = COMPLIANCE_GAP_FACTOR[regulatoryEnvironment];
  const effL             = EFFICIENCY_LOSS[gapSeverity];
  const sectorRiskWeight = INDUSTRY_DATA[industry].sectorRiskWeight;

  // Run 5,000 no-breach iterations
  const nbTotals     = new Array(N_ITERATIONS);
  const nbDailyCoVs  = new Array(N_ITERATIONS);
  const nbBreachComp = new Array(N_ITERATIONS);
  const nbRegComp    = new Array(N_ITERATIONS);
  const nbOpComp     = new Array(N_ITERATIONS);

  for (let i = 0; i < N_ITERATIONS; i++) {
    const r = runIteration(L, betaP, lnP, regP, rw, vrm, csf, dBudg, tMult, cgf, effL, daysVacant, false, sectorRiskWeight);
    nbTotals[i]     = r.total_cov;
    nbDailyCoVs[i]  = r.daily_breach + r.daily_regulatory + r.daily_operational;
    nbBreachComp[i] = r.daily_breach;
    nbRegComp[i]    = r.daily_regulatory;
    nbOpComp[i]     = r.daily_operational;
  }

  // Run 5,000 with-breach iterations
  const wbTotals = new Array(N_ITERATIONS);
  for (let i = 0; i < N_ITERATIONS; i++) {
    const r = runIteration(L, betaP, lnP, regP, rw, vrm, csf, dBudg, tMult, cgf, effL, daysVacant, true, sectorRiskWeight);
    wbTotals[i] = r.total_cov;
  }

  // Compute no-breach statistics
  const p10Daily = percentile(nbDailyCoVs, 10);
  const p50Daily = percentile(nbDailyCoVs, 50);
  const p90Daily = percentile(nbDailyCoVs, 90);
  const p10Total = percentile(nbTotals, 10);
  const p50Total = percentile(nbTotals, 50);
  const p90Total = percentile(nbTotals, 90);
  const meanDailyNB = mean(nbDailyCoVs);
  const meanTotalNB = mean(nbTotals);

  // Build cumulativeByDay: scale by VRM ratio at each day
  // Efficient: reuse P50 daily distribution, scale by VRM(d)/VRM(full)
  const vrmFull = vrm;
  const maxChartPoints = Math.min(daysVacant, 365);
  const step = daysVacant / maxChartPoints;
  const cumulativeByDay = [];
  for (let i = 1; i <= maxChartPoints; i++) {
    const d = Math.round(i * step);
    const vrmD = vacancyRiskMultiplier(d, hasInterim, vacancyType, maturity);
    const scale = vrmD / vrmFull;
    cumulativeByDay.push({
      day: d,
      p10: p10Daily * scale * d,
      p50: p50Daily * scale * d,
      p90: p90Daily * scale * d,
    });
  }

  // Build cumulativeByDayBaseline: organizational VRM (no control inheritance discount)
  // Used as the "without inherited controls" comparison line in the chart.
  const cumulativeByDayBaseline = [];
  for (let i = 1; i <= maxChartPoints; i++) {
    const d = Math.round(i * step);
    const vrmOrgD = vacancyRiskMultiplier(d, hasInterim, 'organizational', null);
    cumulativeByDayBaseline.push({
      day: d,
      p10: p10Daily * (vrmOrgD / vrmFull) * d,
      p50: p50Daily * (vrmOrgD / vrmFull) * d,
      p90: p90Daily * (vrmOrgD / vrmFull) * d,
    });
  }

  // With-breach statistics
  const wbP10Daily = percentile(wbTotals.map(t => t / daysVacant), 10);
  const wbP50Daily = percentile(wbTotals.map(t => t / daysVacant), 50);
  const wbP90Daily = percentile(wbTotals.map(t => t / daysVacant), 90);
  const wbP10Total = percentile(wbTotals, 10);
  const wbP50Total = percentile(wbTotals, 50);
  const wbP90Total = percentile(wbTotals, 90);
  const meanDailyWB = mean(wbTotals.map(t => t / daysVacant));
  const meanTotalWB = mean(wbTotals);

  // Deterministic estimate
  const deterministicEstimate = computeDeterministic(params);

  // Monte Carlo uplift: how much simulation mean exceeds deterministic (%)
  // Using mean (expected value) on both sides for an apples-to-apples comparison.
  // Positive uplift reflects correlation premium and size-tier risk differentiation.
  const monteCarloUplift = deterministicEstimate > 0
    ? ((meanTotalNB - deterministicEstimate) / deterministicEstimate) * 100
    : 0;

  // Risk level (based on no-breach P50 daily)
  let riskLevel;
  if (p50Daily < 15000) riskLevel = 'Low';
  else if (p50Daily < 30000) riskLevel = 'Medium';
  else riskLevel = 'High';

  // Search ROI
  const industryExposure = p50Daily * SEARCH_TIMELINES.industry;
  const generalExposure  = p50Daily * SEARCH_TIMELINES.general;
  const hitchExposure    = p50Daily * SEARCH_TIMELINES.hitch;
  const netRiskReduction = industryExposure - hitchExposure;
  const roiRatio = SEARCH_FEE > 0
    ? `${Math.max(1, Math.round(netRiskReduction / SEARCH_FEE))}:1`
    : 'N/A';

  // Component breakdown (mean daily, no-breach)
  // Using mean instead of P50 so regulatory (68% zero) shows non-zero expected value.
  const componentBreakdown = {
    breach:      mean(nbBreachComp),
    regulatory:  mean(nbRegComp),
    operational: mean(nbOpComp),
  };

  // Control Inheritance output
  const ciIsActive = vacancyType === 'succession' && !!maturity;
  const ciParams = ciIsActive ? CONTROL_INHERITANCE[maturity] : { initialDiscount: 0, lambda: 0 };

  function ciDiscount(d) {
    return getControlInheritanceDiscount(vacancyType, maturity, d);
  }
  // dailySaving: p50Daily × discount_at_day / vrmFull
  // (consistent with how cumulativeByDay uses VRM ratios)
  function ciSaving(d) {
    return p50Daily * ciDiscount(d) / (vrmFull || 1);
  }

  const ciCliffDay = ciIsActive
    ? Math.round(
        -Math.log(MEANINGFUL_PROTECTION_THRESHOLD / ciParams.initialDiscount)
        / ciParams.lambda
      )
    : null;

  const controlInheritance = {
    vacancyType,
    maturity: maturity || null,
    initialDiscount: ciParams.initialDiscount,
    cliffDay: ciCliffDay,
    discountAtDay1:  ciDiscount(1),
    discountAtDay30: ciDiscount(30),
    discountAtDay60: ciDiscount(60),
    discountAtDay90: ciDiscount(90),
    dailySavingAtDay1:  ciSaving(1),
    dailySavingAtDay30: ciSaving(30),
    dailySavingAtDay60: ciSaving(60),
    dailySavingAtDay90: ciSaving(90),
    isActive: ciIsActive,
  };

  self.postMessage({
    noBreach: {
      p10Daily, p50Daily, p90Daily,
      p10Total, p50Total, p90Total,
      meanDaily: meanDailyNB,
      meanTotal: meanTotalNB,
      cumulativeByDay,
      iterations: Array.from(nbTotals),
    },
    withBreach: {
      p10Daily: wbP10Daily, p50Daily: wbP50Daily, p90Daily: wbP90Daily,
      p10Total: wbP10Total, p50Total: wbP50Total, p90Total: wbP90Total,
      meanDaily: meanDailyWB,
      meanTotal: meanTotalWB,
      cumulativeByDay: [],   // not needed for chart
      iterations: Array.from(wbTotals),
    },
    deterministicEstimate,
    monteCarloUplift,
    riskLevel,
    searchROI: {
      industryExposure,
      generalExposure,
      hitchExposure,
      netRiskReduction,
      roiRatio,
    },
    componentBreakdown,
    controlInheritance,
    cumulativeByDayBaseline,
  });
};
