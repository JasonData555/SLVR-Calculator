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
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #DDE3EC',
      background: isHitch ? '#F0FDF4' : 'transparent',
      margin: isHitch ? '0 -22px' : '0',
      padding: isHitch ? '10px 22px' : '10px 0',
    }}>
      <p style={{
        fontFamily: 'var(--font-dm-sans)',
        fontSize: '12px',
        color: isHitch ? '#15803D' : highlight ? '#1A2332' : '#3D5068',
        fontWeight: isHitch || highlight ? 500 : 400,
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'var(--font-dm-mono)',
        fontSize: '13px',
        fontWeight: 500,
        color: isHitch ? '#15803D' : highlight ? '#1D4ED8' : '#0F1729',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {highlight ? `−${fmt(value)}` : fmt(value)}
      </p>
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #DDE3EC', borderRadius: '6px', padding: '20px 22px' }} className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex justify-between">
          <div style={{ height: '14px', width: '192px' }} className="skeleton-dark rounded animate-pulse" />
          <div style={{ height: '14px', width: '96px' }} className="skeleton-dark rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function SearchROICard({ result }: SearchROICardProps) {
  if (!result) return <Skeleton />;

  const { searchROI } = result;

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #DDE3EC', borderRadius: '6px', padding: '20px 22px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 500, color: '#1A2332' }}>
          The Cost of Every Extra Day
        </h3>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: '#7A8FA6', marginTop: '2px' }}>
          Risk exposure by search duration · P50 daily vacancy cost
        </p>
      </div>

      <div>
        <MetricRow label="Industry typical search (~127 days)" value={searchROI.industryExposure} />
        <MetricRow label="General search firms (~94 days)" value={searchROI.generalExposure} />
        <MetricRow label="Hitch Partners (~62 days)" value={searchROI.hitchExposure} isHitch />
        <MetricRow label="Estimated risk reduction" value={searchROI.netRiskReduction} highlight />
      </div>
    </div>
  );
}
