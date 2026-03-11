'use client';

interface BreachWarningProps {
  visible: boolean;
}

export default function BreachWarning({ visible }: BreachWarningProps) {
  if (!visible) return null;

  return (
    <div className="bg-red-50 border border-red-300 rounded-xl px-6 py-5 flex gap-4">
      <div className="shrink-0 mt-0.5">
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-red-700 mb-1">
          Security Incident During Leadership Vacancy
        </p>
        <p className="text-sm text-red-600 leading-relaxed">
          A security breach during a leadership vacancy significantly amplifies all cost
          components. Immediate board escalation and legal counsel engagement are recommended.
        </p>
      </div>
    </div>
  );
}
