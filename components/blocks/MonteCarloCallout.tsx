'use client';

import type { SimulationOutput } from '@/lib/types';
import { fmt } from '@/lib/formatters';

interface MonteCarloCalloutProps {
  result: SimulationOutput | null;
}

export default function MonteCarloCallout({ result }: MonteCarloCalloutProps) {
  if (!result) {
    return (
      <div className="skeleton-dark rounded animate-pulse" style={{ height: '36px' }} />
    );
  }

  const { deterministicEstimate, noBreach, monteCarloUplift } = result;
  const uplift = monteCarloUplift.toFixed(1);
  const sign = monteCarloUplift >= 0 ? '+' : '';

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #DDE3EC',
      borderRadius: '6px',
      padding: '10px 20px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '0',
    }}>
      {/* Deterministic */}
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', color: '#7A8FA6' }}>Deterministic:</span>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '13px', fontWeight: 500, color: '#0F1729' }}>
          {fmt(deterministicEstimate)}
        </span>
      </span>

      {/* Vertical rule */}
      <span style={{ display: 'inline-block', width: '1px', height: '20px', background: '#DDE3EC', margin: '0 20px', flexShrink: 0 }} />

      {/* MC Mean */}
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', color: '#7A8FA6' }}>MC Mean:</span>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '13px', fontWeight: 500, color: '#0F1729' }}>
          {fmt(noBreach.meanTotal)}
        </span>
      </span>

      {/* Vertical rule */}
      <span className="hidden sm:inline-block" style={{ width: '1px', height: '20px', background: '#DDE3EC', margin: '0 20px', flexShrink: 0 }} />

      {/* Uplift */}
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', color: '#7A8FA6' }}>Simulation captures</span>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '13px', fontWeight: 500, color: '#1D4ED8' }}>
          {sign}{uplift}%
        </span>
        <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', color: '#7A8FA6' }}>
          above deterministic via correlation &amp; tail effects
        </span>
      </span>
    </div>
  );
}
