'use client';

import type { SimulationOutput, SecurityRole } from '@/lib/types';
import { fmt } from '@/lib/formatters';

interface ComponentBreakdownProps {
  result: SimulationOutput | null;
  role: SecurityRole;
}

function Skeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-40 h-3 skeleton-dark rounded animate-pulse" />
          <div className="flex-1 h-2 skeleton-dark rounded animate-pulse" />
          <div className="w-24 h-3 skeleton-dark rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

const COMPONENT_COLORS = {
  breach:      { bar: 'bg-[#C4A55A]',   text: 'text-[#F0C674]' },
  regulatory:  { bar: 'bg-[#2DD4BF]',   text: 'text-[#2DD4BF]' },
  operational: { bar: 'bg-[#6B7FA3]',   text: 'text-[#6B7FA3]' },
};

const COMPONENT_LABELS: Record<string, (role: SecurityRole) => string> = {
  breach:      () => 'Breach Risk',
  regulatory:  (role) => role === 'Head of GRC'
    ? 'Regulatory & Compliance (GRC-weighted)'
    : 'Regulatory & Compliance',
  operational: (role) => role === 'Head of Security Operations'
    ? 'Operational Impact (SecOps-weighted)'
    : 'Operational Impact',
};

interface RowProps {
  label: string;
  value: number;
  pct: number;
  colors: { bar: string; text: string };
}

function Row({ label, value, pct, colors }: RowProps) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[#1E3A5F]/40 last:border-0">
      <div className="w-48 shrink-0">
        <p className="text-sm text-[#E8EDF5]/80 leading-snug">{label}</p>
      </div>
      <div className="flex-1">
        <div className="h-1.5 bg-[#0A1628] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>
      </div>
      <div className="w-36 text-right shrink-0">
        <span className={`font-mono text-sm font-semibold ${colors.text}`}>
          {fmt(value)}
        </span>
        <span className="text-[10px] text-[#6B7FA3] ml-1.5 font-mono">{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
}

export default function ComponentBreakdown({ result, role }: ComponentBreakdownProps) {
  if (!result) return <Skeleton />;

  const { breach, regulatory, operational } = result.componentBreakdown;
  const total = breach + regulatory + operational;

  const rows = [
    { key: 'breach',      value: breach,      pct: total > 0 ? (breach / total) * 100 : 0      },
    { key: 'regulatory',  value: regulatory,  pct: total > 0 ? (regulatory / total) * 100 : 0  },
    { key: 'operational', value: operational, pct: total > 0 ? (operational / total) * 100 : 0 },
  ];

  return (
    <div>
      <div className="divide-y-0">
        {rows.map(({ key, value, pct }) => (
          <Row
            key={key}
            label={COMPONENT_LABELS[key](role)}
            value={value}
            pct={pct}
            colors={COMPONENT_COLORS[key as keyof typeof COMPONENT_COLORS]}
          />
        ))}
      </div>
    </div>
  );
}
