'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import RiskBadge from './blocks/RiskBadge';
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

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
      {children}
    </p>
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

      {/* Header row with status + PDF button */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-700">Risk Assessment Results</h2>
          {isRunning ? (
            <p className="text-xs text-slate-400 mt-0.5 animate-pulse">
              Running 5,000 simulations...
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-0.5">
              {result ? '5,000 simulations complete' : 'Initializing...'}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePrint()}
          disabled={!result || isRunning}
          className="text-xs shrink-0"
        >
          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Risk Report
        </Button>
      </div>

      {/* Block 1: Risk Badge */}
      <RiskBadge
        riskLevel={result?.riskLevel ?? null}
        role={inputs.role}
      />

      {/* Block 2: Scenario Cards */}
      <div>
        <SectionTitle>Scenario Comparison</SectionTitle>
        <ScenarioCards
          result={result}
          isRunning={isRunning}
          daysVacant={inputs.daysVacant}
        />
      </div>

      {/* Block 3: Monte Carlo Callout */}
      <MonteCarloCallout result={result} />

      {/* Block 4: Component Breakdown */}
      <SectionCard>
        <SectionTitle>Cost Component Breakdown</SectionTitle>
        <ComponentBreakdown result={result} role={inputs.role} />
      </SectionCard>

      {/* Block 5: Cumulative Cost Chart */}
      {result && (
        <SectionCard>
          <CumulativeCostChart
            data={result.noBreach.cumulativeByDay}
            daysVacant={inputs.daysVacant}
          />
        </SectionCard>
      )}
      {!result && (
        <SectionCard>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-400">Building cumulative chart...</p>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Block 6: Simulation Distribution Histogram */}
      {result && (
        <SectionCard>
          <HistogramChart
            noBreachIterations={result.noBreach.iterations}
            breachIterations={result.withBreach.iterations}
          />
        </SectionCard>
      )}

      {/* Block 7: Search ROI */}
      <div>
        <SectionTitle>Specialized Search ROI</SectionTitle>
        <SearchROICard result={result} />
      </div>

      {/* Block 8: Breach Warning (conditional) */}
      <BreachWarning visible={inputs.breachOccurred} />

      {/* Block 9: CTA */}
      <CTASection />

      {/* Hidden print component */}
      <div className="hidden print:block">
        <PrintReport ref={printRef} result={result} inputs={inputs} />
      </div>
    </div>
  );
}
