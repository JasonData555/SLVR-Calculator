'use client';

import { fmt } from '@/lib/formatters';

interface ScenarioRiskSummaryProps {
  p10Total: number;
  p50Total: number;
  p90Total: number;
}

export default function ScenarioRiskSummary({ p10Total, p50Total, p90Total }: ScenarioRiskSummaryProps) {
  const sansFont = 'var(--font-dm-sans)';
  const monoFont = 'var(--font-dm-mono)';

  // P50 marker position as % along the P10–P90 range
  const range = p90Total - p10Total;
  const p50Pct = range > 0 ? ((p50Total - p10Total) / range) * 100 : 50;

  const cardBase: React.CSSProperties = {
    padding: '20px 24px',
  };

  return (
    <div>
      {/* Panel heading */}
      <p style={{
        fontFamily: sansFont,
        fontSize: '9px',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#7A8FA6',
        marginBottom: '16px',
      }}>
        Scenario Risk Summary · 5,000 Simulated Outcomes
      </p>

      {/* Three stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        border: '1px solid #DDE3EC',
        borderRadius: '6px',
        overflow: 'hidden',
      }}>
        {/* LEFT — Best Case / P10 */}
        <div style={{ ...cardBase }}>
          <p style={{ fontFamily: sansFont, fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#15803D' }}>
            Best Case
          </p>
          <p style={{ fontFamily: sansFont, fontSize: '9px', color: '#7A8FA6', marginTop: '2px' }}>
            P10 Outcome
          </p>
          <p style={{ fontFamily: monoFont, fontSize: '28px', fontWeight: 500, color: '#15803D', marginTop: '8px', lineHeight: 1.1 }}>
            {fmt(p10Total)}
          </p>
          <p style={{ fontFamily: sansFont, fontSize: '10px', fontStyle: 'italic', color: '#7A8FA6', marginTop: '8px', lineHeight: 1.5 }}>
            9 in 10 simulated outcomes exceed this figure
          </p>
        </div>

        {/* CENTER — Most Likely / P50 */}
        <div style={{ ...cardBase, background: '#F5F8FC', borderLeft: '1px solid #DDE3EC', borderRight: '1px solid #DDE3EC' }}>
          <p style={{ fontFamily: sansFont, fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#0F1729' }}>
            Most Likely
          </p>
          <p style={{ fontFamily: sansFont, fontSize: '9px', color: '#7A8FA6', marginTop: '2px' }}>
            P50 Median
          </p>
          <p style={{ fontFamily: monoFont, fontSize: '28px', fontWeight: 500, color: '#0F1729', marginTop: '8px', lineHeight: 1.1 }}>
            {fmt(p50Total)}
          </p>
          <p style={{ fontFamily: sansFont, fontSize: '10px', fontStyle: 'italic', color: '#7A8FA6', marginTop: '8px', lineHeight: 1.5 }}>
            Median outcome across all 5,000 simulations
          </p>
        </div>

        {/* RIGHT — Worst Case / P90 */}
        <div style={{ ...cardBase }}>
          <p style={{ fontFamily: sansFont, fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#B91C1C' }}>
            Worst Case
          </p>
          <p style={{ fontFamily: sansFont, fontSize: '9px', color: '#7A8FA6', marginTop: '2px' }}>
            P90 Outcome
          </p>
          <p style={{ fontFamily: monoFont, fontSize: '28px', fontWeight: 500, color: '#B91C1C', marginTop: '8px', lineHeight: 1.1 }}>
            {fmt(p90Total)}
          </p>
          <p style={{ fontFamily: sansFont, fontSize: '10px', fontStyle: 'italic', color: '#7A8FA6', marginTop: '8px', lineHeight: 1.5 }}>
            1 in 10 simulated outcomes exceed this figure
          </p>
        </div>
      </div>

      {/* Range bar */}
      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #DDE3EC' }}>
        <p style={{ fontFamily: sansFont, fontSize: '9px', color: '#7A8FA6', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: '8px' }}>
          90-Day Total Exposure Range
        </p>

        {/* Bar container with P50 marker */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          {/* P50 label above the marker */}
          <div style={{
            position: 'absolute',
            left: `${p50Pct}%`,
            transform: 'translateX(-50%)',
            bottom: '14px',
            fontFamily: monoFont,
            fontSize: '10px',
            color: '#0F1729',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}>
            {fmt(p50Total)}
          </div>

          {/* Gradient bar */}
          <div style={{
            height: '6px',
            borderRadius: '3px',
            background: 'linear-gradient(to right, #15803D, #0F1729, #B91C1C)',
          }} />

          {/* P50 marker diamond */}
          <div style={{
            position: 'absolute',
            left: `${p50Pct}%`,
            top: '50%',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            width: '10px',
            height: '10px',
            background: '#0F1729',
            border: '2px solid #FFFFFF',
          }} />
        </div>

        {/* Below bar labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ fontFamily: monoFont, fontSize: '10px', color: '#15803D' }}>{fmt(p10Total)}</span>
          <span style={{ fontFamily: sansFont, fontSize: '9px', color: '#7A8FA6' }}>No-breach scenario</span>
          <span style={{ fontFamily: monoFont, fontSize: '10px', color: '#B91C1C' }}>{fmt(p90Total)}</span>
        </div>
      </div>
    </div>
  );
}
