'use client';

// [PLACEHOLDER]: Replace with live URLs before launch
const CONTACT_URL = '#contact';
const METHODOLOGY_URL = '#methodology';

export default function CTASection() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        Ready to Reduce Your Exposure?
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed mb-6">
        Hitch Partners typically places CISOs and security leaders in ~62 days — roughly 32 days
        faster than general search firms. Every day of vacancy carries measurable risk.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={CONTACT_URL}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-slate-900
            hover:bg-slate-800 text-white text-sm font-medium transition-colors"
        >
          Schedule a Conversation
        </a>
        <a
          href={METHODOLOGY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-300
            hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
        >
          Download Methodology Paper
        </a>
      </div>
    </div>
  );
}
