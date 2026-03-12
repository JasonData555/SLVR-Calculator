'use client';

import type { SimulationOutput } from '@/lib/types';
import { fmt, fmtCompact } from '@/lib/formatters';

interface ScenarioCardsProps {
  result: SimulationOutput | null;
  isRunning: boolean;
  daysVacant: number;
}

function Skeleton({ style }: { style?: React.CSSProperties }) {
  return <div className="skeleton-dark rounded animate-pulse" style={style} />;
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
      style={{
        background: isBreach ? '#FEF9F9' : '#FFFFFF',
        border: isBreach ? '1px solid #FECACA' : '1px solid #DDE3EC',
        borderTop: isBreach ? '3px solid #B91C1C' : '3px solid #0F1729',
        borderRadius: '6px',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div>
        <p style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: isBreach ? '#B91C1C' : '#3D5068',
        }}>
          {title}
        </p>
        {subtitle && (
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', fontStyle: 'italic', color: '#B91C1C', marginTop: '2px' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Daily cost */}
      <div>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#7A8FA6', marginBottom: '4px' }}>
          Daily Exposure (P50)
        </p>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '26px', fontWeight: 500, color: isBreach ? '#B91C1C' : '#0F1729', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
          {fmt(p50Daily)}
        </p>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: '#3D5068', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
          {fmt(p10Daily)}&thinsp;–&thinsp;{fmt(p90Daily)} per day
        </p>
      </div>

      {/* Total cost */}
      <div style={{ paddingTop: '14px', borderTop: isBreach ? '1px solid #FECACA' : '1px solid #DDE3EC' }}>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#7A8FA6', marginBottom: '4px' }}>
          Total Exposure (P50)
        </p>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '20px', fontWeight: 500, color: isBreach ? '#B91C1C' : '#0F1729', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
          {fmt(p50Total)}
        </p>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: '#3D5068', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
          {fmtCompact(p10Total)}&thinsp;–&thinsp;{fmtCompact(p90Total)} range
        </p>
        {deltaLabel && (
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', fontWeight: 500, color: '#B91C1C', marginTop: '8px' }}>
            {deltaLabel}
          </p>
        )}
      </div>

      <p style={{
        fontFamily: 'var(--font-dm-sans)',
        fontSize: '10px',
        color: '#7A8FA6',
        marginTop: 'auto',
        paddingTop: '10px',
        borderTop: isBreach ? '1px solid #FECACA' : '1px solid #DDE3EC',
      }}>
        5,000 simulated outcomes
      </p>
    </div>
  );
}

export default function ScenarioCards({ result, isRunning, daysVacant }: ScenarioCardsProps) {
  if (isRunning || !result) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div style={{ borderRadius: '6px', border: '1px solid #DDE3EC', borderTop: '3px solid #0F1729', background: '#FFFFFF', padding: '20px 22px' }} className="space-y-4">
          <Skeleton style={{ height: '10px', width: '120px' }} />
          <Skeleton style={{ height: '28px', width: '150px' }} />
          <Skeleton style={{ height: '10px', width: '160px' }} />
          <div style={{ paddingTop: '14px', borderTop: '1px solid #DDE3EC' }} className="space-y-2">
            <Skeleton style={{ height: '20px', width: '130px' }} />
            <Skeleton style={{ height: '10px', width: '140px' }} />
          </div>
        </div>
        <div style={{ borderRadius: '6px', border: '1px solid #FECACA', borderTop: '3px solid #B91C1C', background: '#FEF9F9', padding: '20px 22px' }} className="space-y-4">
          <Skeleton style={{ height: '10px', width: '120px' }} />
          <Skeleton style={{ height: '28px', width: '150px' }} />
          <Skeleton style={{ height: '10px', width: '160px' }} />
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
