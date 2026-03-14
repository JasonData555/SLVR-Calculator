'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import HeroMetricStrip from './blocks/HeroMetricStrip';
import ScenarioCards from './blocks/ScenarioCards';
import MonteCarloCallout from './blocks/MonteCarloCallout';
import ComponentBreakdown from './blocks/ComponentBreakdown';
import SearchROICard from './blocks/SearchROICard';
import BreachWarning from './blocks/BreachWarning';
import CTASection from './blocks/CTASection';
import PrintReport from './PrintReport';
import type { SimulationOutput, SimulationInputs } from '@/lib/types';

import ScenarioRiskSummary from './blocks/ScenarioRiskSummary';

// Dynamic import for Recharts (no SSR)
const CumulativeCostChart = dynamic(() => import('./blocks/CumulativeCostChart'), { ssr: false });

interface ResultsPanelProps {
  result: SimulationOutput | null;
  isRunning: boolean;
  inputs: SimulationInputs;
}

/** White card container for result blocks */
function DataCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{ background: '#FFFFFF', border: '1px solid #DDE3EC', borderRadius: '6px', padding: '20px 22px' }}
    >
      {children}
    </div>
  );
}

/** Institutional section label with flanking rules */
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="slvr-section-divider">
      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7A8FA6', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </div>
  );
}

export default function ResultsPanel({ result, isRunning, inputs }: ResultsPanelProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `SLVR Risk Report — ${inputs.role} — ${inputs.industry}`,
  });

  return (
    <div style={{ padding: '28px 32px' }} className="space-y-5">

      {/* ── Status bar — slim 36px institutional bar ── */}
      <div style={{
        height: '36px',
        background: '#FFFFFF',
        borderBottom: '1px solid #DDE3EC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '4px',
        marginLeft: '-32px',
        marginRight: '-32px',
        marginTop: '-28px',
        paddingLeft: '32px',
        paddingRight: '32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              flexShrink: 0,
              background: isRunning ? '#B45309' : result ? '#15803D' : '#DDE3EC',
              animation: isRunning ? 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' : 'none',
            }}
          />
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: '#3D5068' }}>
            {isRunning
              ? 'Running simulation...'
              : result
                ? '5,000 simulations complete'
                : 'Initializing...'}
          </p>
        </div>

        {/* Risk Report button */}
        <button
          onClick={() => handlePrint()}
          disabled={!result || isRunning}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '3px',
            background: !result || isRunning ? '#EBF1F8' : '#5B7C99',
            color: !result || isRunning ? '#7A8FA6' : '#FFFFFF',
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.06em',
            border: 'none',
            cursor: !result || isRunning ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => {
            if (result && !isRunning) (e.currentTarget as HTMLButtonElement).style.background = '#4A6B88';
          }}
          onMouseLeave={(e) => {
            if (result && !isRunning) (e.currentTarget as HTMLButtonElement).style.background = '#5B7C99';
          }}
        >
          {/* Download icon */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Risk Report
        </button>
      </div>

      {/* ════════════════════════════════════════════════
          SECTION 1 — EXECUTIVE RISK SUMMARY
      ════════════════════════════════════════════════ */}
      <SectionDivider label="Executive Risk Summary" />

      {/* Hero metric — P50 daily cost, risk level, total exposure */}
      <HeroMetricStrip result={result} isRunning={isRunning} daysVacant={inputs.daysVacant} />

      {/* Scenario comparison cards */}
      <div>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7A8FA6', marginBottom: '12px' }}>
          Scenario Comparison · No Breach vs. Breach During Vacancy
        </p>
        <ScenarioCards
          result={result}
          isRunning={isRunning}
          daysVacant={inputs.daysVacant}
        />
      </div>

      {/* ════════════════════════════════════════════════
          SECTION 2 — RISK DECOMPOSITION
      ════════════════════════════════════════════════ */}
      <SectionDivider label="Risk Decomposition" />

      {/* Monte Carlo context callout */}
      <MonteCarloCallout result={result} />

      {/* Component breakdown */}
      <DataCard>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7A8FA6', marginBottom: '16px' }}>
          Cost Component Breakdown · Daily Mean (No-Breach Scenario)
        </p>
        <ComponentBreakdown result={result} role={inputs.role} />
      </DataCard>

      {/* Cumulative cost over time */}
      {result ? (
        <DataCard>
          <CumulativeCostChart
            data={result.noBreach.cumulativeByDay}
            daysVacant={inputs.daysVacant}
          />
        </DataCard>
      ) : (
        <DataCard>
          <div style={{ height: '192px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%',
                border: '2px solid #0F1729', borderTopColor: 'transparent',
                margin: '0 auto 12px',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: '#7A8FA6' }}>
                Building cumulative chart...
              </p>
            </div>
          </div>
        </DataCard>
      )}

      {/* Scenario Risk Summary */}
      {result && (
        <DataCard>
          <ScenarioRiskSummary
            p10Total={result.noBreach.p10Total}
            p50Total={result.noBreach.p50Total}
            p90Total={result.noBreach.p90Total}
          />
        </DataCard>
      )}

      {/* ════════════════════════════════════════════════
          SECTION 3 — ACCELERATE THE SEARCH
      ════════════════════════════════════════════════ */}
      <SectionDivider label="Accelerate the Search" />

      <SearchROICard result={result} />

      <BreachWarning visible={inputs.breachOccurred} />

      <CTASection />

      {/* Hidden print component */}
      <div className="hidden print:block">
        <PrintReport ref={printRef} result={result} inputs={inputs} />
      </div>
    </div>
  );
}
