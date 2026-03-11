'use client';

import React, { forwardRef } from 'react';
import type { SimulationOutput, SimulationInputs } from '@/lib/types';
import { fmt } from '@/lib/formatters';

interface PrintReportProps {
  result: SimulationOutput | null;
  inputs: SimulationInputs;
}

const PrintReport = forwardRef<HTMLDivElement, PrintReportProps>(
  ({ result, inputs }, ref) => {
    if (!result) return null;

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    const { noBreach, withBreach, riskLevel, componentBreakdown, searchROI, deterministicEstimate, monteCarloUplift } = result;

    const riskClass = {
      Low: 'print-risk-low',
      Medium: 'print-risk-medium',
      High: 'print-risk-high',
    }[riskLevel];

    const cbTotal = componentBreakdown.breach + componentBreakdown.regulatory + componentBreakdown.operational;
    const pct = (v: number) => cbTotal > 0 ? `${((v / cbTotal) * 100).toFixed(0)}%` : '0%';

    return (
      <div ref={ref} className="print-report" style={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
        {/* Header */}
        <div className="print-header">
          <div>
            <h1>Security Leader Vacancy Risk Report</h1>
            {/* [PLACEHOLDER]: Replace text below with <img> logo before launch */}
            <p style={{ fontSize: '9pt', color: '#64748b', marginTop: '2pt' }}>
              Hitch Partners | Cybersecurity Executive Search
            </p>
          </div>
          <div className="print-header-right">
            <p>Generated: {today}</p>
            <p style={{ marginTop: '2pt' }}>Powered by Hitch Partners VRQM Methodology</p>
          </div>
        </div>

        {/* Organization Profile */}
        <h2>Organization Profile</h2>
        <div className="print-grid-2">
          <div>
            <table className="print-table" style={{ marginBottom: 0 }}>
              <tbody>
                {[
                  ['Industry', inputs.industry],
                  ['Security Leader Title', inputs.role],
                  ['Annual Revenue', `$${inputs.revenueMillions.toLocaleString()}M`],
                  ['Employee Count', inputs.employees.toLocaleString()],
                  ['Security Team Size', inputs.teamSize.toString()],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td style={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#64748b' }}>{label}</td>
                    <td style={{ textAlign: 'right', color: '#0f172a' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <table className="print-table" style={{ marginBottom: 0 }}>
              <tbody>
                {[
                  ['Regulatory Environment', inputs.regulatoryEnvironment],
                  ['Days Vacant', `${inputs.daysVacant} days`],
                  ['Has Interim Leadership', inputs.hasInterim ? 'Yes' : 'No'],
                  ['Leadership Gap Severity', inputs.gapSeverity],
                  ['Breach Occurred', inputs.breachOccurred ? 'Yes' : 'No'],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td style={{ fontFamily: 'DM Sans, Arial, sans-serif', color: '#64748b' }}>{label}</td>
                    <td style={{ textAlign: 'right', color: '#0f172a' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Level */}
        <div className={`print-risk-badge ${riskClass}`}>
          {inputs.role} Vacancy Risk: {riskLevel}
        </div>

        {/* Scenario Results */}
        <h2>Simulation Results (5,000 Iterations)</h2>
        <div className="print-grid-2">
          {/* No Breach */}
          <div className="print-scenario-card">
            <p className="print-scenario-title">No Breach Scenario</p>
            <table className="print-table" style={{ marginBottom: 0 }}>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th style={{ textAlign: 'right' }}>P10</th>
                  <th style={{ textAlign: 'right' }}>P50</th>
                  <th style={{ textAlign: 'right' }}>P90</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Daily Cost</td>
                  <td style={{ textAlign: 'right' }}>{fmt(noBreach.p10Daily)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>{fmt(noBreach.p50Daily)}</td>
                  <td style={{ textAlign: 'right' }}>{fmt(noBreach.p90Daily)}</td>
                </tr>
                <tr>
                  <td>Total Cost</td>
                  <td style={{ textAlign: 'right' }}>{fmt(noBreach.p10Total)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>{fmt(noBreach.p50Total)}</td>
                  <td style={{ textAlign: 'right' }}>{fmt(noBreach.p90Total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* With Breach */}
          <div className="print-scenario-card breach">
            <p className="print-scenario-title">Breach During Vacancy</p>
            <table className="print-table" style={{ marginBottom: 0 }}>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th style={{ textAlign: 'right' }}>P10</th>
                  <th style={{ textAlign: 'right' }}>P50</th>
                  <th style={{ textAlign: 'right' }}>P90</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Daily Cost</td>
                  <td style={{ textAlign: 'right' }}>{fmt(withBreach.p10Daily)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>{fmt(withBreach.p50Daily)}</td>
                  <td style={{ textAlign: 'right' }}>{fmt(withBreach.p90Daily)}</td>
                </tr>
                <tr>
                  <td>Total Cost</td>
                  <td style={{ textAlign: 'right' }}>{fmt(withBreach.p10Total)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>{fmt(withBreach.p50Total)}</td>
                  <td style={{ textAlign: 'right' }}>{fmt(withBreach.p90Total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p style={{ fontSize: '8pt', color: '#64748b', marginBottom: '10pt' }}>
          Deterministic estimate: {fmt(deterministicEstimate)} · Simulation P50: {fmt(noBreach.p50Total)} ·
          Monte Carlo reveals {monteCarloUplift.toFixed(1)}% additional tail risk exposure.
        </p>

        {/* Component Breakdown */}
        <h2>Cost Component Breakdown (P50 Daily)</h2>
        <table className="print-table">
          <thead>
            <tr>
              <th>Component</th>
              <th style={{ textAlign: 'right' }}>Daily P50</th>
              <th style={{ textAlign: 'right' }}>% of Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Breach Risk</td>
              <td style={{ textAlign: 'right' }}>{fmt(componentBreakdown.breach)}</td>
              <td style={{ textAlign: 'right' }}>{pct(componentBreakdown.breach)}</td>
            </tr>
            <tr>
              <td>Regulatory & Compliance</td>
              <td style={{ textAlign: 'right' }}>{fmt(componentBreakdown.regulatory)}</td>
              <td style={{ textAlign: 'right' }}>{pct(componentBreakdown.regulatory)}</td>
            </tr>
            <tr>
              <td>Operational Impact</td>
              <td style={{ textAlign: 'right' }}>{fmt(componentBreakdown.operational)}</td>
              <td style={{ textAlign: 'right' }}>{pct(componentBreakdown.operational)}</td>
            </tr>
          </tbody>
        </table>

        {/* Search ROI */}
        <h2>Search ROI Comparison</h2>
        <table className="print-table">
          <thead>
            <tr>
              <th>Search Approach</th>
              <th style={{ textAlign: 'right' }}>Duration</th>
              <th style={{ textAlign: 'right' }}>Vacancy Risk Exposure</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Industry Typical</td>
              <td style={{ textAlign: 'right' }}>~127 days</td>
              <td style={{ textAlign: 'right' }}>{fmt(searchROI.industryExposure)}</td>
            </tr>
            <tr>
              <td>General Search Firms</td>
              <td style={{ textAlign: 'right' }}>~94 days</td>
              <td style={{ textAlign: 'right' }}>{fmt(searchROI.generalExposure)}</td>
            </tr>
            <tr>
              <td>Hitch Partners</td>
              <td style={{ textAlign: 'right' }}>~62 days</td>
              <td style={{ textAlign: 'right' }}>{fmt(searchROI.hitchExposure)}</td>
            </tr>
            <tr style={{ fontWeight: 700 }}>
              <td>Estimated Risk Reduction</td>
              <td style={{ textAlign: 'right' }}>−65 days</td>
              <td style={{ textAlign: 'right', color: '#16a34a' }}>−{fmt(searchROI.netRiskReduction)}</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: '8pt', color: '#64748b', marginBottom: '10pt' }}>
          Search ROI vs. $75K placement fee: {searchROI.roiRatio} · Placement success rate: 91% vs. 73% industry average.
        </p>

        {/* Footer */}
        <div className="print-footer">
          <h3>Methodology</h3>
          <p className="print-body">
            Cost projections are risk-weighted estimates based on industry benchmarks, regulatory data,
            and statistical modeling. These represent potential financial impacts derived from empirical
            data across 600+ global organizations. Calculations utilize Hitch Partners&rsquo; proprietary CVR
            (CISO Vacancy Risk) methodology to model exponential risk acceleration during leadership gaps.
            Individual organizational outcomes will vary based on specific risk factors and security posture.
          </p>

          <h3 style={{ marginTop: '8pt' }}>Data Sources</h3>
          <p className="print-body">
            Industry breach data sourced from IBM Cost of Data Breach Report 2025, Cyentia Information Risk
            Insights Study (IRIS 2025) statistical analysis, and established cybersecurity industry standards.
            Hitch Partners applied risk-weighted industry averages segmented by sector and company size to
            reflect your organization&rsquo;s specific risk profile. Security leader time-to-fill benchmarks sourced
            from IANS Research / Artico Search CISO Hiring Study. Hitch Partners placement timeline reflects
            verified internal search performance data.
          </p>

          <p className="print-disclaimer" style={{ marginTop: '8pt' }}>
            Disclaimer: These projections represent statistical estimates based on industry data, not guarantees
            of individual outcomes. Organizations should conduct their own risk assessment in consultation with
            qualified cybersecurity and legal professionals.
          </p>
        </div>
      </div>
    );
  }
);

PrintReport.displayName = 'PrintReport';
export default PrintReport;
