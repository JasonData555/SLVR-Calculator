'use client';

import type { SimulationOutput } from '@/lib/types';
import { fmt, fmtCompact } from '@/lib/formatters';

interface ScenarioCardsProps {
  result: SimulationOutput | null;
  isRunning: boolean;
  daysVacant: number;
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton-dark rounded animate-pulse ${className}`} />;
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
      className={`rounded-lg border p-5 flex flex-col gap-4 transition-all duration-300
        ${isBreach
          ? 'bg-red-950/20 border-red-800/40'
          : 'bg-[#162040] border-[#1E3A5F]'}`}
    >
      <div>
        <p className="text-label mb-0.5">{title}</p>
        {subtitle && (
          <p className={`text-[11px] font-medium ${isBreach ? 'text-red-400' : 'text-[#6B7FA3]'}`}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Daily cost */}
      <div>
        <p className="text-[10px] text-[#6B7FA3] mb-1 uppercase tracking-wide">Daily Exposure (P50)</p>
        <p className={`text-data font-semibold text-xl tracking-tight transition-all duration-300
          ${isBreach ? 'text-red-400' : 'text-[#F0C674]'}`}>
          {fmt(p50Daily)}
        </p>
        <p className="text-data-sm text-[#6B7FA3] mt-1">
          {fmt(p10Daily)}&thinsp;–&thinsp;{fmt(p90Daily)} per day
        </p>
      </div>

      {/* Total cost */}
      <div className={`pt-3 border-t ${isBreach ? 'border-red-900/40' : 'border-[#1E3A5F]'}`}>
        <p className="text-[10px] text-[#6B7FA3] mb-1 uppercase tracking-wide">Total Exposure (P50)</p>
        <p className={`text-data font-semibold text-lg transition-all duration-300
          ${isBreach ? 'text-red-400' : 'text-[#E8EDF5]'}`}>
          {fmt(p50Total)}
        </p>
        <p className="text-data-sm text-[#6B7FA3] mt-1">
          {fmtCompact(p10Total)}&thinsp;–&thinsp;{fmtCompact(p90Total)} range
        </p>
        {deltaLabel && (
          <p className="text-[11px] font-semibold text-red-400 mt-2">{deltaLabel}</p>
        )}
      </div>

      <p className="text-[10px] text-[#6B7FA3]/50 mt-auto font-mono">
        5,000 simulated outcomes
      </p>
    </div>
  );
}

export default function ScenarioCards({ result, isRunning, daysVacant }: ScenarioCardsProps) {
  if (isRunning || !result) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-[#1E3A5F] bg-[#162040] p-5 space-y-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-3 w-44" />
          <div className="pt-3 border-t border-[#1E3A5F] space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="rounded-lg border border-red-800/30 bg-red-950/20 p-5 space-y-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-3 w-44" />
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
