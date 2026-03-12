'use client';

interface BreachWarningProps {
  visible: boolean;
}

export default function BreachWarning({ visible }: BreachWarningProps) {
  if (!visible) return null;

  return (
    <div style={{
      background: '#FEF2F2',
      border: '1px solid #FECACA',
      borderRadius: '6px',
      padding: '14px 18px',
      display: 'flex',
      gap: '14px',
    }}>
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', fontWeight: 600, color: '#B91C1C', marginBottom: '4px' }}>
          Security Incident During Leadership Vacancy
        </p>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: '#7F1D1D', lineHeight: 1.5 }}>
          A security breach during a leadership vacancy significantly amplifies all cost
          components. Immediate board escalation and legal counsel engagement are recommended.
        </p>
      </div>
    </div>
  );
}
