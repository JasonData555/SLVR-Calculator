'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { fmt } from '@/lib/formatters';

interface HistogramChartProps {
  noBreachIterations: number[];
  breachIterations: number[];
}

function buildBuckets(noBreachData: number[], breachData: number[], nBuckets = 50) {
  const allVals = [...noBreachData, ...breachData];
  const minVal  = Math.min(...allVals);
  const maxVal  = Math.max(...allVals);
  const width   = (maxVal - minVal) / nBuckets;
  if (width === 0) return [];

  const buckets = Array.from({ length: nBuckets }, (_, i) => ({
    x:      minVal + i * width,
    xLabel: minVal + (i + 0.5) * width,
    nb:     0,
    wb:     0,
  }));

  const fill = (data: number[], key: 'nb' | 'wb') => {
    data.forEach((v) => {
      const idx = Math.min(nBuckets - 1, Math.floor((v - minVal) / width));
      if (idx >= 0) buckets[idx][key]++;
    });
  };

  fill(noBreachData, 'nb');
  fill(breachData, 'wb');

  return buckets;
}

function formatX(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000)     return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

interface TooltipPayload { name: string; value: number; }

function CustomTooltip({
  active, payload, label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: number;
}) {
  if (!active || !payload?.length || label === undefined) return null;
  const nb = payload.find((p) => p.name === 'nb')?.value ?? 0;
  const wb = payload.find((p) => p.name === 'wb')?.value ?? 0;

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #DDE3EC',
      borderRadius: '4px',
      padding: '8px 10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      fontFamily: 'var(--font-dm-mono)',
      fontSize: '11px',
    }}>
      <p style={{ color: '#7A8FA6', marginBottom: '4px' }}>{formatX(label)}</p>
      <p style={{ color: '#0F1729' }}>No Breach: <strong>{nb}</strong></p>
      <p style={{ color: '#B91C1C' }}>With Breach: <strong>{wb}</strong></p>
    </div>
  );
}

export default function HistogramChart({ noBreachIterations, breachIterations }: HistogramChartProps) {
  if (!noBreachIterations.length) return null;

  const buckets = buildBuckets(noBreachIterations, breachIterations, 50);
  if (!buckets.length) return null;

  const nbSorted = [...noBreachIterations].sort((a, b) => a - b);
  const wbSorted = [...breachIterations].sort((a, b) => a - b);
  const nbP50 = nbSorted[Math.floor(nbSorted.length / 2)];
  const wbP50 = wbSorted[Math.floor(wbSorted.length / 2)];

  const gridColor = '#EBF1F8';
  const axisColor = '#7A8FA6';
  const monoFont  = 'var(--font-dm-mono)';

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', fontWeight: 500, color: '#1A2332' }}>
          Distribution of 5,000 Simulated Outcomes
        </h3>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: '#7A8FA6', marginTop: '2px' }}>
          Navy = No breach &nbsp;·&nbsp; Red = Breach during vacancy
        </p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={buckets} margin={{ top: 5, right: 20, left: 52, bottom: 15 }} barCategoryGap={1}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={1} vertical={false} />
          <XAxis
            dataKey="xLabel"
            tickFormatter={formatX}
            tick={{ fontSize: 9, fill: axisColor, fontFamily: monoFont }}
            tickCount={6}
            label={{ value: 'Total Vacancy Cost', position: 'insideBottom', offset: -10, fontSize: 9, fill: axisColor, fontFamily: monoFont }}
            stroke={gridColor}
          />
          <YAxis
            tick={{ fontSize: 9, fill: axisColor, fontFamily: monoFont }}
            label={{ value: 'Frequency', angle: -90, position: 'insideLeft', offset: 15, fontSize: 9, fill: axisColor }}
            stroke={gridColor}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="nb" fill="#0F1729" opacity={0.70} name="nb" />
          <Bar dataKey="wb" fill="#B91C1C" opacity={0.50} name="wb" />
          <ReferenceLine
            x={nbP50}
            stroke="#0F1729"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            label={{ value: `P50: ${fmt(nbP50)}`, position: 'top', fontSize: 8, fill: '#0F1729', fontFamily: monoFont }}
          />
          <ReferenceLine
            x={wbP50}
            stroke="#B91C1C"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            label={{ value: `P50: ${fmt(wbP50)}`, position: 'top', fontSize: 8, fill: '#B91C1C', fontFamily: monoFont }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
