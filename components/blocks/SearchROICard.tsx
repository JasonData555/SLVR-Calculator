'use client';

import type { SimulationOutput } from '@/lib/types';
import { fmt } from '@/lib/formatters';

interface SearchROICardProps {
  result: SimulationOutput | null;
}

function MetricRow({
  label, value, highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-700/30 last:border-0">
      <p className={`text-sm ${highlight ? 'text-white font-medium' : 'text-slate-300'}`}>
        {label}
      </p>
      <p className={`font-mono text-sm font-semibold ${highlight ? 'text-green-400' : 'text-white'}`}>
        {highlight ? `−${fmt(value)}` : fmt(value)}
      </p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="bg-slate-800 rounded-xl p-6 space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex justify-between">
          <div className="h-4 w-48 bg-slate-700 rounded animate-pulse" />
          <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function SearchROICard({ result }: SearchROICardProps) {
  if (!result) return <Skeleton />;

  const { searchROI } = result;

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-white font-semibold text-base">The Cost of a Longer Search</h3>
        <p className="text-slate-400 text-xs mt-0.5">
          Risk exposure by search duration · Based on P50 daily vacancy cost
        </p>
      </div>

      <div>
        <MetricRow
          label="Industry typical search (~127 days)"
          value={searchROI.industryExposure}
        />
        <MetricRow
          label="General search firms (~94 days)"
          value={searchROI.generalExposure}
        />
        <MetricRow
          label="Hitch Partners (~62 days)"
          value={searchROI.hitchExposure}
        />
        <MetricRow
          label="Estimated risk reduction"
          value={searchROI.netRiskReduction}
          highlight
        />
      </div>

      <div className="mt-5 pt-4 border-t border-slate-700/50">
        <p className="text-xs font-semibold text-green-400 mb-1">
          Search ROI vs. $75K placement fee: {searchROI.roiRatio}
        </p>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          Hitch Partners placement timeline reflects verified internal search performance data.
          Industry benchmarks per IANS Research / Artico Search CISO Hiring Study.
          Placement success rate: 91% vs. 73% industry average.
          All duration figures use &ldquo;typically ~X days&rdquo; framing, not hard averages.
        </p>
      </div>
    </div>
  );
}
