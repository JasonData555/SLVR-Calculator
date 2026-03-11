'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend,
} from 'recharts';
import type { CumulativeDataPoint } from '@/lib/types';
import { fmt } from '@/lib/formatters';

interface CumulativeCostChartProps {
  data: CumulativeDataPoint[];
  daysVacant: number;
}

function formatYAxis(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000)     return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active, payload, label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: number;
}) {
  if (!active || !payload?.length) return null;

  const p10 = payload.find((p) => p.name === 'p10')?.value ?? 0;
  const p50 = payload.find((p) => p.name === 'p50')?.value ?? 0;
  const p90 = payload.find((p) => p.name === 'p90')?.value ?? 0;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs font-mono">
      <p className="font-sans font-semibold text-slate-700 mb-2">Day {label}</p>
      <div className="space-y-1">
        <p className="text-slate-500">P10: <span className="text-slate-800 font-semibold">{fmt(p10)}</span></p>
        <p className="text-blue-600">P50: <span className="font-semibold">{fmt(p50)}</span></p>
        <p className="text-slate-500">P90: <span className="text-slate-800 font-semibold">{fmt(p90)}</span></p>
      </div>
    </div>
  );
}

export default function CumulativeCostChart({ data, daysVacant }: CumulativeCostChartProps) {
  if (!data.length) return null;

  // Recharts needs a flat data array with both area bounds
  const chartData = data.map((d) => ({
    day: d.day,
    p50: d.p50,
    p10: d.p10,
    p90: d.p90,
    band: [d.p10, d.p90],   // for area fill
  }));

  const showHitch  = daysVacant >= 62;
  const showGen    = daysVacant >= 94;
  const showIndust = daysVacant >= 127;

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-800">Cumulative Vacancy Risk Over Time</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Shaded band represents 80% confidence interval across 5,000 simulations
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 60, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'var(--font-dm-mono)' }}
            label={{ value: 'Days Vacant', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#94a3b8' }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'var(--font-dm-mono)' }}
            width={58}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* P10–P90 confidence band (semi-transparent fill) */}
          <Area
            type="monotone"
            dataKey="p90"
            stroke="none"
            fill="#3b82f6"
            fillOpacity={0.10}
            name="p90"
            legendType="none"
          />
          <Area
            type="monotone"
            dataKey="p10"
            stroke="none"
            fill="#ffffff"
            fillOpacity={1}
            name="p10"
            legendType="none"
          />

          {/* P50 primary line */}
          <Area
            type="monotone"
            dataKey="p50"
            stroke="#2563eb"
            strokeWidth={2}
            fill="none"
            name="p50"
            dot={false}
            activeDot={{ r: 4, fill: '#2563eb' }}
          />

          {/* Reference lines */}
          {showHitch && (
            <ReferenceLine
              x={62}
              stroke="#16a34a"
              strokeDasharray="5 4"
              strokeWidth={1.5}
              label={{
                value: 'Hitch Partners ~62d',
                position: 'top',
                fontSize: 9,
                fill: '#16a34a',
                fontFamily: 'var(--font-dm-sans)',
              }}
            />
          )}
          {showGen && (
            <ReferenceLine
              x={94}
              stroke="#d97706"
              strokeDasharray="5 4"
              strokeWidth={1.5}
              label={{
                value: 'General Search ~94d',
                position: 'top',
                fontSize: 9,
                fill: '#d97706',
                fontFamily: 'var(--font-dm-sans)',
              }}
            />
          )}
          {showIndust && (
            <ReferenceLine
              x={127}
              stroke="#dc2626"
              strokeDasharray="5 4"
              strokeWidth={1.5}
              label={{
                value: 'Industry Typical ~127d',
                position: 'top',
                fontSize: 9,
                fill: '#dc2626',
                fontFamily: 'var(--font-dm-sans)',
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex gap-5 mt-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-blue-600 inline-block" /> P50 Median
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-3 bg-blue-500/10 border border-blue-200 inline-block rounded-sm" /> 80% CI Band
        </span>
        {showHitch && (
          <span className="flex items-center gap-1.5">
            <span className="w-4 border-t-2 border-dashed border-green-600 inline-block" /> Hitch
          </span>
        )}
        {showGen && (
          <span className="flex items-center gap-1.5">
            <span className="w-4 border-t-2 border-dashed border-amber-600 inline-block" /> General
          </span>
        )}
        {showIndust && (
          <span className="flex items-center gap-1.5">
            <span className="w-4 border-t-2 border-dashed border-red-600 inline-block" /> Industry
          </span>
        )}
      </div>
    </div>
  );
}
