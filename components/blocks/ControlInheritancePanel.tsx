'use client';

import type { ControlInheritanceOutput } from '@/lib/types';
import { fmt } from '@/lib/formatters';

interface ControlInheritancePanelProps {
  controlInheritance: ControlInheritanceOutput;
  daysVacant: number;
}

function pct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

export default function ControlInheritancePanel({
  controlInheritance: ci,
  daysVacant,
}: ControlInheritancePanelProps) {
  if (!ci.isActive) return null;

  const sansFont = 'var(--font-dm-sans)';
  const monoFont = 'var(--font-dm-mono)';

  const isProtected = ci.cliffDay !== null && ci.cliffDay > daysVacant;
  const cliffDay = ci.cliffDay ?? 0;

  // Decay bar: fill % = (discountAtDay1 / initialDiscount) × 100
  const fillPct = ci.initialDiscount > 0
    ? Math.min(100, (ci.discountAtDay1 / ci.initialDiscount) * 100)
    : 100;

  // Cliff marker position on bar (relative to daysVacant or max 365)
  const barMaxDay = Math.max(daysVacant, cliffDay, 90);
  const cliffMarkerPct = Math.min(100, (cliffDay / barMaxDay) * 100);

  // Callout: cost difference at cliffDay vs current daysVacant
  // Approximation: saving_at_cliffDay ≈ 0 (by definition, discount < 10% threshold)
  // Delta = (dailySaving at start - ~0) × days remaining after cliff
  const deltaCost = ci.dailySavingAtDay1 * Math.max(0, daysVacant - cliffDay);

  return (
    <div>
      {/* Section label */}
      <p style={{
        fontFamily: sansFont,
        fontSize: '9px',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#7A8FA6',
        marginBottom: '12px',
      }}>
        Inherited Control Posture · {ci.maturity} Maturity
      </p>

      {/* Panel container */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #DDE3EC',
        borderLeft: '4px solid #15803D',
        borderRadius: '6px',
        padding: '20px 24px',
      }}>

        {/* Row 1: Three stat cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
        }}>

          {/* Card A — TODAY (DAY 1) */}
          <div style={{ paddingRight: '16px', borderRight: '1px solid #DDE3EC' }}>
            <p style={{ fontFamily: sansFont, fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#15803D', marginBottom: '6px' }}>
              Today (Day 1)
            </p>
            <p style={{ fontFamily: monoFont, fontSize: '22px', fontWeight: 500, color: '#15803D', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              −{pct(ci.discountAtDay1)}
            </p>
            <p style={{ fontFamily: monoFont, fontSize: '11px', color: '#15803D', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
              −{fmt(ci.dailySavingAtDay1)} vs. no program
            </p>
            <p style={{ fontFamily: sansFont, fontSize: '10px', fontStyle: 'italic', color: '#7A8FA6', marginTop: '6px', lineHeight: 1.4 }}>
              Daily risk reduction from inherited controls
            </p>
          </div>

          {/* Card B — DAY 30 */}
          <div style={{ paddingLeft: '16px', paddingRight: '16px', borderRight: '1px solid #DDE3EC' }}>
            <p style={{ fontFamily: sansFont, fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#3D5068', marginBottom: '6px' }}>
              Day 30
            </p>
            <p style={{ fontFamily: monoFont, fontSize: '22px', fontWeight: 500, color: '#3D5068', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              −{pct(ci.discountAtDay30)}
            </p>
            <p style={{ fontFamily: monoFont, fontSize: '11px', color: '#3D5068', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
              −{fmt(ci.dailySavingAtDay30)} vs. no program
            </p>
            <p style={{ fontFamily: sansFont, fontSize: '10px', fontStyle: 'italic', color: '#7A8FA6', marginTop: '6px', lineHeight: 1.4 }}>
              Controls beginning to degrade without leadership
            </p>
          </div>

          {/* Card C — PROTECTION THRESHOLD */}
          <div style={{ paddingLeft: '16px', background: '#FEF9F9', borderRadius: '0 4px 4px 0', padding: '0 0 0 16px' }}>
            <p style={{ fontFamily: sansFont, fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#B91C1C', marginBottom: '6px' }}>
              Protection Threshold · Day {cliffDay}
            </p>
            <p style={{ fontFamily: monoFont, fontSize: '22px', fontWeight: 500, color: '#B91C1C', lineHeight: 1 }}>
              {'< 10%'}
            </p>
            <p style={{ fontFamily: sansFont, fontSize: '10px', fontStyle: 'italic', color: '#B91C1C', marginTop: '10px', lineHeight: 1.4 }}>
              Inherited controls no longer materially reduce risk
            </p>
          </div>
        </div>

        {/* Row 2: Inheritance decay bar */}
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #DDE3EC' }}>

          {/* Label row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <p style={{ fontFamily: sansFont, fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#7A8FA6' }}>
              Inherited Protection Remaining
            </p>
            <p style={{ fontFamily: sansFont, fontSize: '9px', fontStyle: 'italic', color: '#7A8FA6' }}>
              Decays to &lt;10% at Day {cliffDay}
            </p>
          </div>

          {/* Bar track */}
          <div style={{ position: 'relative', height: '8px', borderRadius: '4px', background: '#EBF1F8' }}>
            {/* Bar fill with gradient */}
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${fillPct}%`,
              borderRadius: '4px',
              background: 'linear-gradient(to right, #15803D, #D97706, #B91C1C)',
            }} />
            {/* Cliff marker — inverted triangle */}
            <div style={{
              position: 'absolute',
              top: '-4px',
              left: `${cliffMarkerPct}%`,
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '7px solid #B91C1C',
            }} />
            {/* Cliff day label below marker */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: `${cliffMarkerPct}%`,
              transform: 'translateX(-50%)',
              fontFamily: monoFont,
              fontSize: '9px',
              color: '#B91C1C',
              whiteSpace: 'nowrap',
            }}>
              Day {cliffDay}
            </div>
          </div>

          {/* End labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <p style={{ fontFamily: monoFont, fontSize: '9px', color: '#15803D' }}>
              {pct(ci.initialDiscount)} at vacancy start
            </p>
            <p style={{ fontFamily: monoFont, fontSize: '9px', color: '#B91C1C' }}>
              &lt;10% at Day {cliffDay}
            </p>
          </div>
        </div>
      </div>

      {/* Callout line below panel */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '10px' }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: isProtected ? '#15803D' : '#B91C1C',
          flexShrink: 0,
          marginTop: '3px',
        }} />
        {isProtected ? (
          <p style={{ fontFamily: sansFont, fontSize: '11px', color: '#15803D', lineHeight: 1.5 }}>
            Your inherited controls provide meaningful protection through your {daysVacant}-day vacancy window.
            Risk is reduced by {pct(ci.discountAtDay1)} compared to an equivalent organization with no prior security program.
          </p>
        ) : (
          <p style={{ fontFamily: sansFont, fontSize: '11px', color: '#B91C1C', lineHeight: 1.5 }}>
            At your current {daysVacant}-day vacancy duration, inherited controls will provide meaningful protection
            only through Day {cliffDay}. After that, risk converges with an organization that had no prior security
            program. Accelerating the search reduces exposure by {fmt(deltaCost)}.
          </p>
        )}
      </div>
    </div>
  );
}
