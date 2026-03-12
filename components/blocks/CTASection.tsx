'use client';

// [PLACEHOLDER]: Replace with final Hitch Partners URLs before launch
const CONTACT_URL = 'https://hitchpartners.com';
const METHODOLOGY_URL = 'https://hitchpartners.com';

export default function CTASection() {
  return (
    <div style={{
      background: '#EBF1F8',
      border: '1px solid #C7D9EE',
      borderRadius: '6px',
      padding: '24px 28px',
      marginTop: '24px',
    }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

        {/* Left: heading + body copy */}
        <div style={{ flex: '1' }}>
          <h3 style={{
            fontFamily: 'var(--font-libre-baskerville), Georgia, serif',
            fontSize: '18px',
            fontWeight: 700,
            color: '#0F1729',
            lineHeight: 1.3,
          }}>
            Ready to Reduce Your Exposure?
          </h3>
          <p style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '12px',
            color: '#3D5068',
            lineHeight: 1.7,
            marginTop: '8px',
          }}>
            Hitch Partners typically places CISOs and security leaders in ~62 days — roughly 32 days
            faster than general search firms. Every day of vacancy carries measurable, compounding risk.
          </p>
        </div>

        {/* Right: CTA buttons */}
        <div className="flex flex-col items-start sm:items-end gap-2 sm:shrink-0">
          <a
            href={CONTACT_URL}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 22px',
              borderRadius: '4px',
              background: '#0F1729',
              color: '#FFFFFF',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#1E3A5F'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#0F1729'; }}
          >
            Schedule a Conversation
          </a>
          <a
            href={METHODOLOGY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '11px',
              color: '#1D4ED8',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            Download Methodology Paper →
          </a>
        </div>

      </div>
    </div>
  );
}
