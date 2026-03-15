'use client';

import type { SimulationOutput, RiskLevel } from '@/lib/types';
import { fmt, fmtCompact } from '@/lib/formatters';

interface HeroMetricStripProps {
  result: SimulationOutput | null;
  isRunning: boolean;
  daysVacant: number;
}

const RISK_CONFIG: Record<RiskLevel, {
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
}> = {
  Low: {
    badgeBg:     '#F0FDF4',
    badgeText:   '#15803D',
    badgeBorder: '#BBF7D0',
    dotColor:    '#15803D',
  },
  Medium: {
    badgeBg:     '#FFFBEB',
    badgeText:   '#B45309',
    badgeBorder: '#FDE68A',
    dotColor:    '#B45309',
  },
  High: {
    badgeBg:     '#FEF2F2',
    badgeText:   '#B91C1C',
    badgeBorder: '#FECACA',
    dotColor:    '#B91C1C',
  },
};

export default function HeroMetricStrip({ result, isRunning, daysVacant }: HeroMetricStripProps) {
  if (isRunning || !result) {
    return (
      <div style={{ background: '#FFFFFF', border: '1px solid #DDE3EC', borderRadius: '6px', padding: '24px 28px' }}
        className="animate-pulse">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="skeleton-dark rounded mb-3" style={{ height: '10px', width: '180px' }} />
            <div className="skeleton-dark rounded mb-2" style={{ height: '52px', width: '220px' }} />
            <div className="skeleton-dark rounded" style={{ height: '10px', width: '200px' }} />
          </div>
          <div className="text-right">
            <div className="skeleton-dark rounded mb-3 ml-auto" style={{ height: '22px', width: '90px' }} />
            <div className="skeleton-dark rounded mb-1.5 ml-auto" style={{ height: '10px', width: '120px' }} />
            <div className="skeleton-dark rounded ml-auto" style={{ height: '22px', width: '80px' }} />
          </div>
        </div>
      </div>
    );
  }

  const { noBreach, riskLevel } = result;
  const cfg = RISK_CONFIG[riskLevel];

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #DDE3EC', borderRadius: '6px', padding: '24px 28px' }}>
      {/* Section label */}
      <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7A8FA6', marginBottom: '16px' }}>
        Executive Risk Summary
      </p>

      <div className="flex items-start justify-between gap-6">

        {/* Left: hero dollar figure — 60% */}
        <div style={{ flex: '0 0 60%' }}>
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7A8FA6', marginBottom: '6px' }}>
            Estimated Daily Exposure · P50 Median
          </p>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '48px', fontWeight: 500, lineHeight: 1, letterSpacing: '-0.01em', color: '#0F1729', fontVariantNumeric: 'tabular-nums' }}>
            {fmt(noBreach.p50Daily)}
          </p>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '12px', color: '#3D5068', marginTop: '8px', fontVariantNumeric: 'tabular-nums' }}>
            Likely range&nbsp;&nbsp;{fmt(noBreach.p10Daily)}&thinsp;–&thinsp;{fmt(noBreach.p90Daily)} per day
          </p>
        </div>

        {/* Right: risk badge + total exposure — 40% */}
        <div
          style={{
            flex: '0 0 40%',
            textAlign: 'right',
            borderLeft: '1px solid #DDE3EC',
            paddingLeft: '24px',
            paddingTop: '2px',
          }}
        >
          {/* Risk badge — no pulse animation */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: cfg.badgeBg,
              color: cfg.badgeText,
              border: `1px solid ${cfg.badgeBorder}`,
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dotColor, flexShrink: 0 }} />
            {riskLevel} Risk
          </span>

          <div style={{ marginTop: '16px' }}>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7A8FA6', marginBottom: '4px' }}>
              {daysVacant}-Day Total Exposure
            </p>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '28px', fontWeight: 500, color: '#0F1729', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
              {fmtCompact(noBreach.p50Total)}
            </p>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: '#3D5068', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
              {fmtCompact(noBreach.p10Total)}&thinsp;–&thinsp;{fmtCompact(noBreach.p90Total)} range
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
