'use client';

import type { RiskLevel, SecurityRole } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  riskLevel: RiskLevel | null;
  role: SecurityRole;
}

const RISK_CONFIG: Record<RiskLevel, { bg: string; label: string }> = {
  Low:    { bg: 'bg-emerald-900/60 border border-emerald-700/50', label: 'Low Risk'    },
  Medium: { bg: 'bg-[#C4A55A]/10 border border-[#C4A55A]/30',    label: 'Medium Risk' },
  High:   { bg: 'bg-red-900/40 border border-red-700/50',         label: 'High Risk'   },
};

const RISK_TEXT: Record<RiskLevel, string> = {
  Low:    'text-emerald-300',
  Medium: 'text-[#F0C674]',
  High:   'text-red-400',
};

export default function RiskBadge({ riskLevel, role }: RiskBadgeProps) {
  if (!riskLevel) {
    return <div className="w-full h-14 rounded-lg skeleton-dark animate-pulse" />;
  }

  const config = RISK_CONFIG[riskLevel];

  return (
    <div
      className={cn(
        'w-full rounded-lg px-5 py-3.5 flex items-center justify-between',
        config.bg,
        riskLevel === 'High' && 'animate-pulse-subtle',
      )}
    >
      <div>
        <p className="text-label mb-0.5">{role} Vacancy Risk</p>
        <p className={`text-xl font-bold leading-tight ${RISK_TEXT[riskLevel]}`}>
          {config.label}
        </p>
      </div>
      <div className={RISK_TEXT[riskLevel] + ' opacity-60'}>
        {riskLevel === 'High' && (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )}
        {riskLevel === 'Medium' && (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {riskLevel === 'Low' && (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>
    </div>
  );
}
