'use client';

import type { SimulationOutput } from '@/lib/types';
import { fmt } from '@/lib/formatters';

interface MonteCarloCalloutProps {
  result: SimulationOutput | null;
}

export default function MonteCarloCallout({ result }: MonteCarloCalloutProps) {
  if (!result) {
    return <div className="h-9 skeleton-dark rounded animate-pulse" />;
  }

  const { deterministicEstimate, noBreach, monteCarloUplift } = result;
  const uplift = monteCarloUplift.toFixed(1);
  const sign = monteCarloUplift >= 0 ? '+' : '';

  return (
    <div className="border border-[#1E3A5F] rounded-lg px-4 py-2.5 flex flex-wrap items-center
      gap-x-5 gap-y-1 text-xs bg-[#0D1929]">
      <span className="text-[#6B7FA3]">
        Deterministic:{' '}
        <span className="font-mono font-semibold text-[#E8EDF5]">{fmt(deterministicEstimate)}</span>
      </span>
      <span className="text-[#1E3A5F] hidden sm:inline">·</span>
      <span className="text-[#6B7FA3]">
        MC Mean:{' '}
        <span className="font-mono font-semibold text-[#E8EDF5]">{fmt(noBreach.meanTotal)}</span>
      </span>
      <span className="text-[#1E3A5F] hidden sm:inline">·</span>
      <span className="text-[#6B7FA3]">
        Simulation captures{' '}
        <span className="font-mono font-semibold text-[#C4A55A]">{sign}{uplift}%</span>
        {' '}above deterministic via correlation &amp; tail effects
      </span>
    </div>
  );
}
