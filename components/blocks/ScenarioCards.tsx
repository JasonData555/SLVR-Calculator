'use client';

import type { SimulationOutput } from '@/lib/types';
import { fmt, fmtCompact } from '@/lib/formatters';

interface ScenarioCardsProps {
  result: SimulationOutput | null;
  isRunning: boolean;
  daysVacant: number;
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-slate-200 rounded animate-pulse ${className}`} />;
}

interface CardProps {
  title: string;
  subtitle?: string;
  isBreach?: boolean;
  p50Daily: number;
  p10Daily: number;
  p90Daily: number;
  p50Total: number;
  p10Total: number;
  p90Total: number;
  deltaLabel?: string;
}

function ScenarioCard({
  title, subtitle, isBreach = false,
  p50Daily, p10Daily, p90Daily,
  p50Total, p10Total, p90Total,
  deltaLabel,
}: CardProps) {
  return (
    <div
      className={`rounded-xl border p-5 flex flex-col gap-4 transition-all duration-300
        ${isBreach
          ? 'bg-red-50 border-red-200'
          : 'bg-white border-slate-200 shadow-sm'}`}
    >
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-0.5">
          {title}
        </p>
        {subtitle && (
          <p className={`text-xs font-medium ${isBreach ? 'text-red-600' : 'text-slate-400'}`}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Daily cost */}
      <div>
        <p className="text-xs text-slate-400 mb-1">Daily Exposure (P50)</p>
        <p className={`font-mono text-3xl font-bold tracking-tight transition-all duration-300
          ${isBreach ? 'text-red-700' : 'text-slate-900'}`}>
          {fmt(p50Daily)}
        </p>
        <p className="font-mono text-xs text-slate-400 mt-1">
          Typically {fmt(p10Daily)} – {fmt(p90Daily)} per day
        </p>
      </div>

      {/* Total cost */}
      <div className={`pt-3 border-t ${isBreach ? 'border-red-100' : 'border-slate-100'}`}>
        <p className="text-xs text-slate-400 mb-1">Total Exposure (P50)</p>
        <p className={`font-mono text-xl font-semibold transition-all duration-300
          ${isBreach ? 'text-red-700' : 'text-slate-800'}`}>
          {fmt(p50Total)}
        </p>
        <p className="font-mono text-xs text-slate-400 mt-1">
          Typically {fmtCompact(p10Total)} – {fmtCompact(p90Total)} total
        </p>
        {deltaLabel && (
          <p className="text-xs font-semibold text-red-600 mt-2">{deltaLabel}</p>
        )}
      </div>

      <p className="text-[10px] text-slate-400 mt-auto">
        Based on 5,000 simulated outcomes
      </p>
    </div>
  );
}

export default function ScenarioCards({ result, isRunning, daysVacant }: ScenarioCardsProps) {
  if (isRunning || !result) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 p-5 space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-3 w-48" />
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-3 w-44" />
          </div>
        </div>
        <div className="rounded-xl border border-red-100 bg-red-50 p-5 space-y-4">
          <Skeleton className="h-4 w-32 bg-red-200" />
          <Skeleton className="h-10 w-40 bg-red-200" />
          <Skeleton className="h-3 w-48 bg-red-200" />
        </div>
      </div>
    );
  }

  const { noBreach, withBreach } = result;
  const delta = withBreach.p50Total - noBreach.p50Total;

  return (
    <div className="grid grid-cols-2 gap-4">
      <ScenarioCard
        title="No Breach Scenario"
        p50Daily={noBreach.p50Daily}
        p10Daily={noBreach.p10Daily}
        p90Daily={noBreach.p90Daily}
        p50Total={noBreach.p50Total}
        p10Total={noBreach.p10Total}
        p90Total={noBreach.p90Total}
      />
      <ScenarioCard
        title="Breach During Vacancy"
        subtitle="Elevated Exposure"
        isBreach
        p50Daily={withBreach.p50Daily}
        p10Daily={withBreach.p10Daily}
        p90Daily={withBreach.p90Daily}
        p50Total={withBreach.p50Total}
        p10Total={withBreach.p10Total}
        p90Total={withBreach.p90Total}
        deltaLabel={`+${fmt(delta)} vs. no-breach scenario`}
      />
    </div>
  );
}
