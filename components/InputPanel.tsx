'use client';

import React from 'react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { SimulationInputs, Industry, SecurityRole, GapSeverity, RegulatoryEnvironment } from '@/lib/types';
import {
  INDUSTRIES, ROLES, SLIDER_RANGES, GAP_SEVERITY_HELPER,
} from '@/lib/constants';

interface InputPanelProps {
  inputs: SimulationInputs;
  onChange: <K extends keyof SimulationInputs>(key: K, value: SimulationInputs[K]) => void;
}

// ——— Logarithmic slider helpers (for Revenue and Employees) ——
function toLog(value: number, min: number, max: number): number {
  const logMin = Math.log10(min);
  const logMax = Math.log10(max);
  return ((Math.log10(value) - logMin) / (logMax - logMin)) * 100;
}

function fromLog(pos: number, min: number, max: number): number {
  const logMin = Math.log10(min);
  const logMax = Math.log10(max);
  return Math.round(Math.pow(10, logMin + (pos / 100) * (logMax - logMin)));
}

// ——— Slider + numeric input combo ————————————————————————————
interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  useLogScale?: boolean;
  formatDisplay?: (v: number) => string;
  onChange: (v: number) => void;
}

function SliderInput({
  label, value, min, max, step = 1, prefix = '', suffix = '',
  useLogScale = false, formatDisplay, onChange,
}: SliderInputProps) {
  const sliderPos = useLogScale ? toLog(value, min, max) : ((value - min) / (max - min)) * 100;

  const handleSlider = (value: number | readonly number[]) => {
    const pos = Array.isArray(value) ? (value as number[])[0] : (value as number);
    const raw = useLogScale
      ? fromLog(pos, min, max)
      : Math.round(min + (pos / 100) * (max - min));
    onChange(Math.max(min, Math.min(max, raw)));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(raw)) onChange(Math.max(min, Math.min(max, raw)));
  };

  return (
    <div className="space-y-2">
      <Label style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', fontWeight: 500, color: '#3D5068' }}>
        {label}
      </Label>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Slider
            value={[sliderPos]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={handleSlider}
            className="w-full"
          />
        </div>
        <div className="relative flex items-center shrink-0" style={{ width: '80px' }}>
          {prefix && (
            <span className="absolute left-2 pointer-events-none" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '13px', color: '#7A8FA6' }}>
              {prefix}
            </span>
          )}
          <input
            type="text"
            value={formatDisplay ? formatDisplay(value) : value.toLocaleString()}
            onChange={handleInput}
            className="w-full focus:outline-none transition-colors"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '13px',
              textAlign: 'left',
              border: '1px solid #DDE3EC',
              borderRadius: '4px',
              padding: prefix ? '5px 6px 5px 16px' : suffix ? '5px 8px 5px 8px' : '5px 8px',
              background: '#FFFFFF',
              color: '#1A2332',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#1D4ED8'; }}
            onBlur={(e) => { e.target.style.borderColor = '#DDE3EC'; }}
          />
          {suffix && (
            <span className="absolute right-2 pointer-events-none" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: '#7A8FA6' }}>
              {suffix}
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-between" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: '#7A8FA6' }}>
        <span>{prefix}{min.toLocaleString()}{suffix}</span>
        <span>{prefix}{max.toLocaleString()}{suffix}</span>
      </div>
    </div>
  );
}

// ——— Section header ——————————————————————————————————————————
function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ borderBottom: '1px solid #DDE3EC', paddingBottom: '8px', marginBottom: '16px' }}>
      <h3 style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7A8FA6' }}>
        {title}
      </h3>
    </div>
  );
}

// ——— Select wrapper ——————————————————————————————————————————
interface LabeledSelectProps<T extends string> {
  label: string;
  value: T;
  options: T[];
  onValueChange: (v: T) => void;
}

function LabeledSelect<T extends string>({
  label, value, options, onValueChange,
}: LabeledSelectProps<T>) {
  return (
    <div className="space-y-1.5">
      <Label style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', fontWeight: 500, color: '#3D5068' }}>
        {label}
      </Label>
      <Select value={value} onValueChange={(v) => { if (v !== null) onValueChange(v as T); }}>
        <SelectTrigger
          className="w-full focus:outline-none transition-colors"
          style={{
            border: '1px solid #DDE3EC',
            borderRadius: '4px',
            background: '#FFFFFF',
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '13px',
            color: '#1A2332',
            height: '36px',
          }}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent style={{ background: '#FFFFFF', border: '1px solid #DDE3EC', borderRadius: '4px' }}>
          {options.map((opt) => (
            <SelectItem
              key={opt}
              value={opt}
              style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', color: '#1A2332' }}
              className="focus:bg-[#EBF1F8] focus:text-[#1A2332] data-[highlighted]:bg-[#EBF1F8]"
            >
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ——— Toggle row ——————————————————————————————————————————————
function ToggleRow({
  label, checked, onCheckedChange, description,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', fontWeight: 500, color: '#1A2332' }}>
          {label}
        </p>
        {description && (
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', fontStyle: 'italic', color: '#B45309', marginTop: '2px' }}>
            {description}
          </p>
        )}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

// ——— Main InputPanel ——————————————————————————————————————————
export default function InputPanel({ inputs, onChange }: InputPanelProps) {
  return (
    <div style={{ padding: '28px 24px' }} className="space-y-8">
      {/* ── Section 1: Organization Profile ── */}
      <div>
        <SectionHeader title="Organization Profile" />
        <div className="space-y-5">
          <LabeledSelect<Industry>
            label="Industry"
            value={inputs.industry}
            options={INDUSTRIES}
            onValueChange={(v) => onChange('industry', v)}
          />

          <LabeledSelect<SecurityRole>
            label="Security Leader Title"
            value={inputs.role}
            options={ROLES}
            onValueChange={(v) => onChange('role', v)}
          />

          <SliderInput
            label="Annual Revenue (USD Millions)"
            value={inputs.revenueMillions}
            min={SLIDER_RANGES.revenueMillions.min}
            max={SLIDER_RANGES.revenueMillions.max}
            prefix="$"
            suffix="M"
            useLogScale
            onChange={(v) => onChange('revenueMillions', v)}
          />

          <SliderInput
            label="Employee Count"
            value={inputs.employees}
            min={SLIDER_RANGES.employees.min}
            max={SLIDER_RANGES.employees.max}
            useLogScale
            formatDisplay={(v) => v.toLocaleString()}
            onChange={(v) => onChange('employees', v)}
          />

          <SliderInput
            label="Security Team Size"
            value={inputs.teamSize}
            min={SLIDER_RANGES.teamSize.min}
            max={SLIDER_RANGES.teamSize.max}
            onChange={(v) => onChange('teamSize', v)}
          />

          <LabeledSelect<RegulatoryEnvironment>
            label="Regulatory Environment"
            value={inputs.regulatoryEnvironment}
            options={['Low', 'Medium', 'High', 'Critical']}
            onValueChange={(v) => onChange('regulatoryEnvironment', v)}
          />
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ borderTop: '1px solid #DDE3EC', margin: '0' }} />

      {/* ── Section 2: Vacancy Details ── */}
      <div>
        <SectionHeader title="Vacancy Details" />
        <div className="space-y-5">
          <SliderInput
            label="Days Position Vacant"
            value={inputs.daysVacant}
            min={SLIDER_RANGES.daysVacant.min}
            max={SLIDER_RANGES.daysVacant.max}
            suffix=" days"
            onChange={(v) => onChange('daysVacant', v)}
          />

          <ToggleRow
            label="Has Interim Leadership"
            checked={inputs.hasInterim}
            onCheckedChange={(v) => onChange('hasInterim', v)}
          />

          <div className="space-y-1">
            <LabeledSelect<GapSeverity>
              label="Leadership Gap Severity"
              value={inputs.gapSeverity}
              options={['Low', 'Medium', 'High']}
              onValueChange={(v) => onChange('gapSeverity', v)}
            />
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', fontStyle: 'italic', color: '#7A8FA6', lineHeight: 1.4, marginTop: '4px' }}>
              {GAP_SEVERITY_HELPER}
            </p>
          </div>

          <ToggleRow
            label="Breach Occurred During Vacancy"
            checked={inputs.breachOccurred}
            onCheckedChange={(v) => onChange('breachOccurred', v)}
            description={inputs.breachOccurred ? 'Elevated exposure scenario active' : undefined}
          />
        </div>
      </div>

      {/* ── Attribution ── */}
      <div style={{ paddingTop: '8px', borderTop: '1px solid #DDE3EC' }}>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: '#7A8FA6', lineHeight: 1.5 }}>
          IBM Cost of Data Breach 2025 · Cyentia IRIS 2025 · 5,000 MC iterations/scenario
        </p>
      </div>
    </div>
  );
}
