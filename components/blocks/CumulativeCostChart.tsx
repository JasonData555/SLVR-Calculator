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
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #DDE3EC',
      borderRadius: '4px',
      padding: '10px 12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    }}>
      <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#7A8FA6', marginBottom: '8px' }}>
        Day {label}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'var(--font-dm-mono)', fontSize: '11px' }}>
        <p style={{ color: '#7A8FA6' }}>P10: <span style={{ color: '#1A2332', fontWeight: 500 }}>{fmt(p10)}</span></p>
        <p style={{ color: '#0F1729', fontWeight: 500 }}>P50: <span>{fmt(p50)}</span></p>
        <p style={{ color: '#7A8FA6' }}>P90: <span style={{ color: '#1A2332', fontWeight: 500 }}>{fmt(p90)}</span></p>
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

  const lastP50 = chartData[chartData.length - 1]?.p50 ?? 0;
  const yMax = lastP50 * 2.2;

  const showHitch  = daysVacant >= 62;
  const showIndust = daysVacant >= 127;

  const gridColor  = '#EBF1F8';
  const axisColor  = '#7A8FA6';
  const monoFont   = 'var(--font-dm-mono)';
  const sansFont   = 'var(--font-dm-sans)';

  const interval = Math.ceil(daysVacant / 10);
  const xTicks = Array.from({ length: 10 }, (_, i) => interval * (i + 1));

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontFamily: sansFont, fontSize: '12px', fontWeight: 500, color: '#1A2332' }}>
          Cumulative Vacancy Risk Over Time
        </h3>
        <p style={{ fontFamily: sansFont, fontSize: '11px', fontStyle: 'italic', color: '#7A8FA6', marginTop: '2px' }}>
          Shaded band = likely range across 5,000 simulations
        </p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData} margin={{ top: 48, right: 20, left: 55, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={1} />
          <XAxis
            dataKey="day"
            ticks={xTicks}
            tick={{ fontSize: 11, fill: '#3D5068', fontFamily: monoFont }}
            label={{ value: 'Days Vacant', position: 'insideBottom', offset: -5, fontSize: 11, fill: axisColor, fontFamily: sansFont }}
            stroke={gridColor}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 11, fill: '#3D5068', fontFamily: monoFont }}
            width={52}
            stroke={gridColor}
            domain={[0, yMax]}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* P10–P90 confidence band — subtle navy wash */}
          <Area
            type="monotone"
            dataKey="p90"
            stroke="none"
            fill="#0F1729"
            fillOpacity={0.12}
            name="p90"
            legendType="none"
          />
          <Area
            type="monotone"
            dataKey="p10"
            stroke="none"
            fill="#F7F9FB"
            fillOpacity={1}
            name="p10"
            legendType="none"
          />

          {/* P50 — navy primary line */}
          <Area
            type="monotone"
            dataKey="p50"
            stroke="#0F1729"
            strokeWidth={2.5}
            fill="none"
            name="p50"
            dot={false}
            activeDot={{ r: 4, fill: '#0F1729', stroke: '#FFFFFF', strokeWidth: 2 }}
          />

          {/* Search timeline reference lines */}
          {showHitch && (
            <ReferenceLine
              x={62}
              stroke="#15803D"
              strokeDasharray="5 4"
              strokeWidth={1}
              label={{
                value: 'Hitch Partners ~62 days',
                position: 'top',
                fontSize: 10,
                fill: '#15803D',
                fontFamily: sansFont,
              }}
            />
          )}
          {showIndust && (
            <ReferenceLine
              x={127}
              stroke="#B91C1C"
              strokeDasharray="5 4"
              strokeWidth={1}
              label={{
                value: 'Industry Typical ~127 days',
                position: 'top',
                fontSize: 10,
                fill: '#B91C1C',
                fontFamily: sansFont,
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px', fontFamily: sansFont, fontSize: '11px', color: '#7A8FA6' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: '16px', height: '2.5px', background: '#0F1729' }} /> P50 Median
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: '16px', height: '12px', background: 'rgba(15,23,41,0.15)', border: '1px solid rgba(15,23,41,0.20)', borderRadius: '2px' }} /> Likely Range
        </span>
        {showHitch && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '16px', borderTop: '1px dashed #15803D' }} /> Hitch Partners
          </span>
        )}
        {showIndust && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '16px', borderTop: '1px dashed #B91C1C' }} /> Industry Typical
          </span>
        )}
      </div>
    </div>
  );
}
