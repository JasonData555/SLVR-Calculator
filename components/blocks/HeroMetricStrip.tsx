'use client';

import type { SimulationOutput, RiskLevel } from '@/lib/types';
import { fmt, fmtCompact } from '@/lib/formatters';

interface HeroMetricStripProps {
  result: SimulationOutput | null;
  isRunning: boolean;
  daysVacant: number;
}

const RISK_CHIP: Record<RiskLevel, { chip: string; number: string }> = {
  Low:    {
    chip:   'text-emerald-400 border-emerald-700/60 bg-emerald-900/20',
    number: 'text-emerald-300',
  },
  Medium: {
    chip:   'text-[#F0C674] border-[#C4A55A]/50 bg-[#C4A55A]/10',
    number: 'text-[#F0C674]',
  },
  High:   {
    chip:   'text-red-400 border-red-700/60 bg-red-900/20',
    number: 'text-red-400',
  },
};

export default function HeroMetricStrip({ result, isRunning, daysVacant }: HeroMetricStripProps) {
  if (isRunning || !result) {
    return (
      <div className="bg-[#0D1929] border border-[#1E3A5F] rounded-lg px-6 py-5 animate-pulse">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="h-3 w-44 skeleton-dark mb-3" />
            <div className="h-14 w-56 skeleton-dark mb-2" />
            <div className="h-3 w-48 skeleton-dark" />
          </div>
          <div className="text-right">
            <div className="h-6 w-24 skeleton-dark mb-3 ml-auto" />
            <div className="h-3 w-32 skeleton-dark mb-1.5 ml-auto" />
            <div className="h-6 w-20 skeleton-dark ml-auto" />
          </div>
        </div>
      </div>
    );
  }

  const { noBreach, riskLevel } = result;
  const colors = RISK_CHIP[riskLevel];

  return (
    <div className="bg-[#0D1929] border border-[#1E3A5F] rounded-lg px-6 py-5">
      <div className="flex items-start justify-between gap-6">

        {/* Left: hero dollar figure */}
        <div>
          <p className="text-label mb-2">
            Estimated Daily Exposure · P50 Median
          </p>
          <p className={`text-display ${colors.number}`}>
            {fmt(noBreach.p50Daily)}
          </p>
          <p className="font-mono text-[11px] text-[#6B7FA3] mt-2 tabular-nums">
            80% CI &nbsp;{fmt(noBreach.p10Daily)}&thinsp;–&thinsp;{fmt(noBreach.p90Daily)} per day
          </p>
        </div>

        {/* Right: risk chip + total exposure */}
        <div className="text-right shrink-0 pt-0.5">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded border text-[11px]
              font-semibold uppercase tracking-widest ${colors.chip}
              ${riskLevel === 'High' ? 'animate-pulse-subtle' : ''}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              riskLevel === 'Low' ? 'bg-emerald-400' :
              riskLevel === 'Medium' ? 'bg-[#F0C674]' : 'bg-red-400'
            }`} />
            {riskLevel} Risk
          </span>

          <div className="mt-4">
            <p className="text-label mb-1">{daysVacant}-Day Total Exposure</p>
            <p className={`font-mono text-2xl font-semibold tabular-nums ${colors.number}`}>
              {fmtCompact(noBreach.p50Total)}
            </p>
            <p className="font-mono text-[10px] text-[#6B7FA3] mt-0.5 tabular-nums">
              {fmtCompact(noBreach.p10Total)}&thinsp;–&thinsp;{fmtCompact(noBreach.p90Total)} range
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
