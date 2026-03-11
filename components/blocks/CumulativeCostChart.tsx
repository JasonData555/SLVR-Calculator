'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
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
    <div className="bg-[#162040] border border-[#1E3A5F] rounded-lg shadow-xl p-3 text-xs font-mono">
      <p className="font-sans font-semibold text-[#E8EDF5]/60 mb-2 text-[10px] uppercase tracking-wide">
        Day {label}
      </p>
      <div className="space-y-1">
        <p className="text-[#6B7FA3]">P10: <span className="text-[#E8EDF5] font-semibold">{fmt(p10)}</span></p>
        <p className="text-[#C4A55A]">P50: <span className="font-semibold">{fmt(p50)}</span></p>
        <p className="text-[#6B7FA3]">P90: <span className="text-[#E8EDF5] font-semibold">{fmt(p90)}</span></p>
      </div>
    </div>
  );
}

export default function CumulativeCostChart({ data, daysVacant }: CumulativeCostChartProps) {
  if (!data.length) return null;

  const chartData = data.map((d) => ({
    day: d.day,
    p50: d.p50,
    p10: d.p10,
    p90: d.p90,
    band: [d.p10, d.p90],
  }));

  const showHitch  = daysVacant >= 62;
  const showGen    = daysVacant >= 94;
  const showIndust = daysVacant >= 127;

  const gridColor  = '#1E3A5F';
  const axisColor  = '#6B7FA3';
  const monoFont   = 'var(--font-dm-mono)';

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#E8EDF5]">Cumulative Vacancy Risk Over Time</h3>
        <p className="text-[11px] text-[#6B7FA3] mt-0.5">
          Shaded band = 80% confidence interval · 5,000 simulations
        </p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData} margin={{ top: 8, right: 20, left: 55, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.6} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: axisColor, fontFamily: monoFont }}
            label={{ value: 'Days Vacant', position: 'insideBottom', offset: -5, fontSize: 10, fill: axisColor }}
            stroke={gridColor}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 10, fill: axisColor, fontFamily: monoFont }}
            width={52}
            stroke={gridColor}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* P10–P90 confidence band */}
          <Area
            type="monotone"
            dataKey="p90"
            stroke="none"
            fill="#C4A55A"
            fillOpacity={0.08}
            name="p90"
            legendType="none"
          />
          <Area
            type="monotone"
            dataKey="p10"
            stroke="none"
            fill="#0A1628"
            fillOpacity={1}
            name="p10"
            legendType="none"
          />

          {/* P50 — executive gold primary line */}
          <Area
            type="monotone"
            dataKey="p50"
            stroke="#C4A55A"
            strokeWidth={2}
            fill="none"
            name="p50"
            dot={false}
            activeDot={{ r: 4, fill: '#C4A55A', stroke: '#0A1628', strokeWidth: 2 }}
          />

          {/* Search timeline reference lines */}
          {showHitch && (
            <ReferenceLine
              x={62}
              stroke="#2DD4BF"
              strokeDasharray="5 4"
              strokeWidth={1.5}
              label={{
                value: 'Hitch ~62d',
                position: 'top',
                fontSize: 9,
                fill: '#2DD4BF',
                fontFamily: 'var(--font-dm-sans)',
              }}
            />
          )}
          {showGen && (
            <ReferenceLine
              x={94}
              stroke="#6B7FA3"
              strokeDasharray="5 4"
              strokeWidth={1.5}
              label={{
                value: 'General ~94d',
                position: 'top',
                fontSize: 9,
                fill: '#6B7FA3',
                fontFamily: 'var(--font-dm-sans)',
              }}
            />
          )}
          {showIndust && (
            <ReferenceLine
              x={127}
              stroke="#EF4444"
              strokeDasharray="5 4"
              strokeWidth={1.5}
              label={{
                value: 'Industry ~127d',
                position: 'top',
                fontSize: 9,
                fill: '#EF4444',
                fontFamily: 'var(--font-dm-sans)',
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-2 text-[10px] text-[#6B7FA3]">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-[#C4A55A] inline-block" /> P50 Median
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-3 bg-[#C4A55A]/10 border border-[#C4A55A]/20 inline-block rounded-sm" /> 80% CI
        </span>
        {showHitch && (
          <span className="flex items-center gap-1.5">
            <span className="w-4 border-t border-dashed border-[#2DD4BF] inline-block" /> Hitch Partners
          </span>
        )}
        {showGen && (
          <span className="flex items-center gap-1.5">
            <span className="w-4 border-t border-dashed border-[#6B7FA3] inline-block" /> General Search
          </span>
        )}
        {showIndust && (
          <span className="flex items-center gap-1.5">
            <span className="w-4 border-t border-dashed border-[#EF4444] inline-block" /> Industry Typical
          </span>
        )}
      </div>
    </div>
  );
}
