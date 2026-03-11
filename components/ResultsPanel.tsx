'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import HeroMetricStrip from './blocks/HeroMetricStrip';
import ScenarioCards from './blocks/ScenarioCards';
import MonteCarloCallout from './blocks/MonteCarloCallout';
import ComponentBreakdown from './blocks/ComponentBreakdown';
import SearchROICard from './blocks/SearchROICard';
import BreachWarning from './blocks/BreachWarning';
import CTASection from './blocks/CTASection';
import PrintReport from './PrintReport';
import type { SimulationOutput, SimulationInputs } from '@/lib/types';

// Dynamic import for Recharts (no SSR)
const CumulativeCostChart = dynamic(() => import('./blocks/CumulativeCostChart'), { ssr: false });
const HistogramChart = dynamic(() => import('./blocks/HistogramChart'), { ssr: false });

interface ResultsPanelProps {
  result: SimulationOutput | null;
  isRunning: boolean;
  inputs: SimulationInputs;
}

/** Dark card container for result blocks */
function DataCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#111E35] border border-[#1E3A5F] rounded-lg p-5 ${className}`}>
      {children}
    </div>
  );
}

/** Section label with flanking rules — McKinsey brief section markers */
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="slvr-section-divider">
      <span className="text-label whitespace-nowrap">{label}</span>
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
    <div className="p-6 space-y-5">

      {/* ── Status bar ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            isRunning ? 'bg-[#C4A55A] animate-pulse' : result ? 'bg-[#2DD4BF]' : 'bg-[#1E3A5F]'
          }`} />
          <p className="font-mono text-[11px] text-[#6B7FA3] uppercase tracking-widest">
            {isRunning
              ? 'Computing 5,000 scenarios...'
              : result
                ? '5,000 simulations complete'
                : 'Initializing...'}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePrint()}
          disabled={!result || isRunning}
          className="text-[11px] shrink-0 border-[#1E3A5F] text-[#6B7FA3] hover:text-[#E8EDF5]
            hover:border-[#C4A55A]/50 hover:bg-[#162040] transition-colors uppercase tracking-wide"
        >
          <svg className="w-3 h-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Risk Report
        </Button>
      </div>

      {/* ════════════════════════════════════════════════
          SECTION 1 — EXECUTIVE RISK SUMMARY
      ════════════════════════════════════════════════ */}
      <SectionDivider label="Executive Risk Summary" />

      {/* Hero metric — P50 daily cost, risk level, total exposure */}
      <HeroMetricStrip result={result} isRunning={isRunning} daysVacant={inputs.daysVacant} />

      {/* P10 / P50 / P90 scenario cards */}
      <div>
        <p className="text-label mb-3">Scenario Comparison · No Breach vs. Breach During Vacancy</p>
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

      {/* Monte Carlo context — compressed to a single callout line */}
      <MonteCarloCallout result={result} />

      {/* Component breakdown */}
      <DataCard>
        <p className="text-label mb-4">Cost Component Breakdown · Daily Mean (No-Breach Scenario)</p>
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
          <div className="h-48 flex items-center justify-center">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-[#C4A55A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-[11px] text-[#6B7FA3]">Building cumulative chart...</p>
            </div>
          </div>
        </DataCard>
      )}

      {/* Outcome distribution histogram */}
      {result && (
        <DataCard>
          <HistogramChart
            noBreachIterations={result.noBreach.iterations}
            breachIterations={result.withBreach.iterations}
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
