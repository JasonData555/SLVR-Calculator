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
          <div className="w-40 h-4 bg-slate-200 rounded animate-pulse" />
          <div className="flex-1 h-3 bg-slate-200 rounded animate-pulse" />
          <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

const COMPONENT_COLORS = {
  breach:      'bg-blue-500',
  regulatory:  'bg-amber-500',
  operational: 'bg-slate-400',
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
  color: string;
}

function Row({ label, value, pct, color }: RowProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-48 shrink-0">
        <p className="text-sm text-slate-700 leading-snug">{label}</p>
      </div>
      <div className="flex-1">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>
      </div>
      <div className="w-32 text-right shrink-0">
        <span className="font-mono text-sm font-semibold text-slate-800">
          {fmt(value)}
        </span>
        <span className="text-xs text-slate-400 ml-1.5">{pct.toFixed(0)}%</span>
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
      <div className="divide-y divide-slate-50">
        {rows.map(({ key, value, pct }) => (
          <Row
            key={key}
            label={COMPONENT_LABELS[key](role)}
            value={value}
            pct={pct}
            color={COMPONENT_COLORS[key as keyof typeof COMPONENT_COLORS]}
          />
        ))}
      </div>
      <p className="text-xs text-slate-400 mt-2">Mean daily cost per component · No-breach scenario</p>
    </div>
  );
}
