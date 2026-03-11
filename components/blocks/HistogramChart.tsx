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
    <div className="bg-white border border-slate-200 rounded-lg shadow p-2.5 text-xs">
      <p className="font-mono text-slate-600 mb-1">{formatX(label)}</p>
      <p className="text-blue-600">No Breach: <strong>{nb}</strong> simulations</p>
      <p className="text-red-500">With Breach: <strong>{wb}</strong> simulations</p>
    </div>
  );
}

export default function HistogramChart({ noBreachIterations, breachIterations }: HistogramChartProps) {
  if (!noBreachIterations.length) return null;

  const buckets = buildBuckets(noBreachIterations, breachIterations, 50);
  if (!buckets.length) return null;

  // P50 reference lines
  const nbSorted = [...noBreachIterations].sort((a, b) => a - b);
  const wbSorted = [...breachIterations].sort((a, b) => a - b);
  const nbP50 = nbSorted[Math.floor(nbSorted.length / 2)];
  const wbP50 = wbSorted[Math.floor(wbSorted.length / 2)];

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-800">Distribution of 5,000 Simulated Outcomes</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Blue = No breach · Red = Breach during vacancy
        </p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={buckets} margin={{ top: 5, right: 20, left: 60, bottom: 15 }} barCategoryGap={0}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="xLabel"
            tickFormatter={formatX}
            tick={{ fontSize: 9, fill: '#94a3b8', fontFamily: 'var(--font-dm-mono)' }}
            tickCount={6}
            label={{ value: 'Total Vacancy Cost', position: 'insideBottom', offset: -10, fontSize: 10, fill: '#94a3b8' }}
          />
          <YAxis
            tick={{ fontSize: 9, fill: '#94a3b8' }}
            label={{ value: 'Frequency', angle: -90, position: 'insideLeft', offset: 15, fontSize: 10, fill: '#94a3b8' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="nb" fill="#3b82f6" opacity={0.85} name="nb" />
          <Bar dataKey="wb" fill="#ef4444" opacity={0.60} name="wb" />
          <ReferenceLine
            x={nbP50}
            stroke="#2563eb"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            label={{ value: `P50 NB: ${fmt(nbP50)}`, position: 'top', fontSize: 8, fill: '#2563eb' }}
          />
          <ReferenceLine
            x={wbP50}
            stroke="#dc2626"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            label={{ value: `P50 WB: ${fmt(wbP50)}`, position: 'top', fontSize: 8, fill: '#dc2626' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
