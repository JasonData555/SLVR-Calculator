'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const sansFont = 'var(--font-dm-sans)';
const monoFont = 'var(--font-dm-mono)';

const labelStyle: React.CSSProperties = {
  fontFamily: sansFont,
  fontSize: '9px',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#7A8FA6',
  marginBottom: '6px',
};

const bodyStyle: React.CSSProperties = {
  fontFamily: sansFont,
  fontSize: '10px',
  color: '#7A8FA6',
  lineHeight: 1.6,
};

const dividerStyle: React.CSSProperties = {
  borderTop: '1px solid #DDE3EC',
  paddingTop: '16px',
  marginTop: '16px',
};

export default function FooterDisclosure() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <footer style={{
      position: 'sticky',
      bottom: 0,
      zIndex: 10,
      background: '#FFFFFF',
    }}>
      {/* Expandable panel — sits above trigger bar */}
      <div style={{
        maxHeight: isExpanded ? '400px' : '0',
        overflow: 'hidden',
        transition: 'max-height 250ms ease',
        borderTop: '1px solid #DDE3EC',
      }}>
        <div style={{ padding: '20px 32px' }}>

          {/* Methodology */}
          <div>
            <p style={labelStyle}>Methodology</p>
            <p style={bodyStyle}>
              Cost projections are risk-weighted estimates based on industry benchmarks,
              regulatory data, and statistical modeling. These represent potential financial
              impacts derived from empirical data across 600+ global organizations.
              Calculations utilize Hitch Partners&rsquo; proprietary VRQM (Vacancy Risk
              Quantification Model) methodology to model exponential risk acceleration during
              leadership gaps. Individual organizational outcomes will vary based on specific
              risk factors and security posture.
            </p>
          </div>

          {/* Data Sources */}
          <div style={dividerStyle}>
            <p style={labelStyle}>Data Sources</p>
            <p style={bodyStyle}>
              Industry breach data sourced from IBM Cost of Data Breach Report 2025,
              Cyentia Information Risk Insights Study (IRIS 2025) statistical analysis,
              and established cybersecurity industry standards. Security leader time-to-fill
              benchmarks sourced from IANS Research / Artico Search CISO Hiring Study.
              Hitch Partners placement timeline reflects verified internal search performance data.
            </p>
          </div>

          {/* Disclaimer */}
          <div style={dividerStyle}>
            <p style={labelStyle}>Disclaimer</p>
            <p style={bodyStyle}>
              These projections represent statistical estimates based on industry data,
              not guarantees of individual outcomes. Organizations should conduct their
              own risk assessment in consultation with qualified cybersecurity and legal
              professionals.
            </p>
          </div>

          {/* Citations */}
          <div style={dividerStyle}>
            <p style={labelStyle}>Citations</p>
            <p style={{ ...bodyStyle, lineHeight: 1.8 }}>
              IBM Cost of Data Breach Report 2025&nbsp;·<br />
              Cyentia IRIS 2025&nbsp;·<br />
              IANS/Artico CISO Hiring Study
            </p>
          </div>

        </div>
      </div>

      {/* Trigger bar */}
      <div style={{
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        borderTop: '1px solid #DDE3EC',
        background: '#FFFFFF',
      }}>
        <button
          onClick={() => setIsExpanded((v) => !v)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: sansFont,
            fontSize: '11px',
            color: hovered ? '#3D5068' : '#7A8FA6',
            transition: 'color 150ms ease',
          }}
        >
          Methodology &amp; Sources
          <ChevronRight
            size={13}
            style={{
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 200ms ease',
              flexShrink: 0,
            }}
          />
        </button>

        <span style={{
          fontFamily: monoFont,
          fontSize: '10px',
          color: '#7A8FA6',
        }}>
          &copy; 2026 Hitch Partners. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
