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
    <div className="bg-[#162040] border border-[#1E3A5F] rounded-lg shadow-xl p-2.5 text-xs">
      <p className="font-mono text-[#6B7FA3] mb-1">{formatX(label)}</p>
      <p className="text-[#C4A55A] font-mono">No Breach: <strong>{nb}</strong></p>
      <p className="text-red-400 font-mono">With Breach: <strong>{wb}</strong></p>
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

  const gridColor = '#1E3A5F';
  const axisColor = '#6B7FA3';
  const monoFont  = 'var(--font-dm-mono)';

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#E8EDF5]">Distribution of 5,000 Simulated Outcomes</h3>
        <p className="text-[11px] text-[#6B7FA3] mt-0.5">
          Gold = No breach &nbsp;·&nbsp; Red = Breach during vacancy
        </p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={buckets} margin={{ top: 5, right: 20, left: 52, bottom: 15 }} barCategoryGap={1}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.5} vertical={false} />
          <XAxis
            dataKey="xLabel"
            tickFormatter={formatX}
            tick={{ fontSize: 9, fill: axisColor, fontFamily: monoFont }}
            tickCount={6}
            label={{ value: 'Total Vacancy Cost', position: 'insideBottom', offset: -10, fontSize: 9, fill: axisColor }}
            stroke={gridColor}
          />
          <YAxis
            tick={{ fontSize: 9, fill: axisColor }}
            label={{ value: 'Frequency', angle: -90, position: 'insideLeft', offset: 15, fontSize: 9, fill: axisColor }}
            stroke={gridColor}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="nb" fill="#C4A55A" opacity={0.80} name="nb" />
          <Bar dataKey="wb" fill="#EF4444" opacity={0.55} name="wb" />
          <ReferenceLine
            x={nbP50}
            stroke="#C4A55A"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            label={{ value: `P50: ${fmt(nbP50)}`, position: 'top', fontSize: 8, fill: '#C4A55A' }}
          />
          <ReferenceLine
            x={wbP50}
            stroke="#EF4444"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            label={{ value: `P50: ${fmt(wbP50)}`, position: 'top', fontSize: 8, fill: '#EF4444' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
