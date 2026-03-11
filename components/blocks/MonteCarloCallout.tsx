'use client';

import type { SimulationOutput } from '@/lib/types';
import { fmt } from '@/lib/formatters';

interface MonteCarloCalloutProps {
  result: SimulationOutput | null;
}

export default function MonteCarloCallout({ result }: MonteCarloCalloutProps) {
  if (!result) {
    return <div className="h-12 bg-slate-100 rounded animate-pulse" />;
  }

  const { deterministicEstimate, noBreach, monteCarloUplift } = result;
  const uplift = monteCarloUplift.toFixed(1);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
      <span className="text-slate-500">
        Deterministic estimate:{' '}
        <span className="font-mono font-semibold text-slate-700">{fmt(deterministicEstimate)}</span>
      </span>
      <span className="text-slate-400 hidden sm:inline">·</span>
      <span className="text-slate-500">
        Simulation mean:{' '}
        <span className="font-mono font-semibold text-slate-700">{fmt(noBreach.meanTotal)}</span>
      </span>
      <span className="text-slate-400 hidden sm:inline">·</span>
      <span className="text-slate-500">
        Simulation captures{' '}
        <span className="font-semibold text-amber-700">{monteCarloUplift >= 0 ? '+' : ''}{uplift}%</span>{' '}
        beyond the deterministic estimate, driven by size-tier risk and correlation effects.
      </span>
      <span className="block w-full text-xs text-slate-400 mt-0.5">
        Consistent with VRQM methodology findings across 600+ organizations.
      </span>
    </div>
  );
}
