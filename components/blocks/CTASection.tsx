'use client';

// [PLACEHOLDER]: Replace with live URLs before launch
const CONTACT_URL = '#contact';
const METHODOLOGY_URL = '#methodology';

export default function CTASection() {
  return (
    <div className="bg-[#0D1929] border border-[#C4A55A]/20 rounded-lg p-6">
      <div className="mb-1">
        <p className="text-label mb-2">Recommended Next Steps</p>
        <h3 className="text-base font-semibold text-[#E8EDF5] leading-snug">
          Reduce Your Exposure with a Faster Search
        </h3>
      </div>
      <p className="text-sm text-[#6B7FA3] leading-relaxed mb-5 mt-2">
        Hitch Partners typically places CISOs and security leaders in ~62 days — roughly 32 days
        faster than general search firms. Every additional day of vacancy carries measurable,
        quantifiable financial risk.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={CONTACT_URL}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg
            bg-[#C4A55A] hover:bg-[#D4B56A] text-[#0A1628] text-sm font-semibold
            transition-colors tracking-wide"
        >
          Schedule a Conversation
        </a>
        <a
          href={METHODOLOGY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg
            border border-[#1E3A5F] hover:border-[#C4A55A]/40 text-[#6B7FA3]
            hover:text-[#E8EDF5] text-sm font-medium transition-colors"
        >
          Download Methodology Paper
        </a>
      </div>
    </div>
  );
}
