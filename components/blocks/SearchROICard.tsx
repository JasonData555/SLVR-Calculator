'use client';

import type { SimulationOutput } from '@/lib/types';
import { fmt } from '@/lib/formatters';

interface SearchROICardProps {
  result: SimulationOutput | null;
}

function MetricRow({
  label, value, highlight = false, isHitch = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  isHitch?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-2.5 border-b border-[#1E3A5F]/50 last:border-0
      ${isHitch ? 'bg-[#2DD4BF]/5 -mx-4 px-4 rounded' : ''}`}>
      <p className={`text-sm ${highlight ? 'text-[#E8EDF5] font-medium' : isHitch ? 'text-[#2DD4BF]' : 'text-[#6B7FA3]'}`}>
        {label}
      </p>
      <p className={`font-mono text-sm font-semibold tabular-nums ${
        highlight ? 'text-[#2DD4BF]' : isHitch ? 'text-[#2DD4BF]' : 'text-[#E8EDF5]'
      }`}>
        {highlight ? `−${fmt(value)}` : fmt(value)}
      </p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="bg-[#0D1929] border border-[#1E3A5F] rounded-lg p-6 space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex justify-between">
          <div className="h-4 w-48 skeleton-dark rounded animate-pulse" />
          <div className="h-4 w-24 skeleton-dark rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function SearchROICard({ result }: SearchROICardProps) {
  if (!result) return <Skeleton />;

  const { searchROI } = result;

  return (
    <div className="bg-[#0D1929] border border-[#1E3A5F] rounded-lg p-6">
      <div className="mb-5">
        <h3 className="text-[#E8EDF5] font-semibold text-base">The Cost of Every Extra Day</h3>
        <p className="text-[#6B7FA3] text-xs mt-0.5">
          Risk exposure by search duration · P50 daily vacancy cost
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
          isHitch
        />
        <MetricRow
          label="Estimated risk reduction"
          value={searchROI.netRiskReduction}
          highlight
        />
      </div>

      <div className="mt-5 pt-4 border-t border-[#1E3A5F]/50">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
          <p className="text-xs font-semibold text-[#2DD4BF]">
            Search ROI vs. $75K placement fee: {searchROI.roiRatio}
          </p>
        </div>
        <p className="text-[10px] text-[#6B7FA3]/60 leading-relaxed font-mono">
          Hitch Partners placement timeline reflects verified internal search performance data.
          Industry benchmarks per IANS Research / Artico Search CISO Hiring Study.
          Placement success rate: 91% vs. 73% industry average.
        </p>
      </div>
    </div>
  );
}
