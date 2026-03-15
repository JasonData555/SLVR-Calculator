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
        <div key={i} className="flex items-center gap-4" style={{ padding: '14px 0', borderBottom: '1px solid #DDE3EC' }}>
          <div style={{ width: '160px', height: '12px' }} className="skeleton-dark rounded animate-pulse" />
          <div className="flex-1 skeleton-dark rounded animate-pulse" style={{ height: '4px' }} />
          <div style={{ width: '100px', height: '12px' }} className="skeleton-dark rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// Institutional bar colors per component
const COMPONENT_COLORS = {
  breach:      { bar: '#0F1729' },  // navy
  regulatory:  { bar: '#1D4ED8' },  // accent blue
  operational: { bar: '#15803D' },  // green
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

function fmtPct(pct: number): string {
  if (pct === 0) return '—';
  if (pct < 1)   return `${pct.toFixed(1)}%`;
  return `${Math.round(pct)}%`;
}

interface RowProps {
  label: string;
  value: number;
  pct: number;
  barColor: string;
  isLast: boolean;
}

function Row({ label, value, pct, barColor, isLast }: RowProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 0',
      borderBottom: isLast ? 'none' : '1px solid #DDE3EC',
    }}>
      <div style={{ width: '192px', flexShrink: 0 }}>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', fontWeight: 500, color: '#1A2332', lineHeight: 1.3 }}>
          {label}
        </p>
      </div>
      <div className="flex-1">
        <div style={{ height: '4px', background: '#EBF1F8', borderRadius: '2px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              borderRadius: '2px',
              background: barColor,
              width: `${Math.min(100, pct)}%`,
              minWidth: '6px',
              transition: 'width 0.7s ease',
            }}
          />
        </div>
      </div>
      <div style={{ width: '144px', textAlign: 'right', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '13px', fontWeight: 500, color: '#0F1729', fontVariantNumeric: 'tabular-nums' }}>
          {fmt(value)}
        </span>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: '#7A8FA6', marginLeft: '6px', fontVariantNumeric: 'tabular-nums' }}>
          {fmtPct(pct)}
        </span>
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
      {rows.map(({ key, value, pct }, idx) => (
        <Row
          key={key}
          label={COMPONENT_LABELS[key](role)}
          value={value}
          pct={pct}
          barColor={COMPONENT_COLORS[key as keyof typeof COMPONENT_COLORS].bar}
          isLast={idx === rows.length - 1}
        />
      ))}
    </div>
  );
}
