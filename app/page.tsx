'use client';

import { useState, useCallback } from 'react';
import InputPanel from '@/components/InputPanel';
import ResultsPanel from '@/components/ResultsPanel';
import { useSimulation } from '@/hooks/useSimulation';
import type { SimulationInputs } from '@/lib/types';
import { INPUT_DEFAULTS } from '@/lib/constants';

export default function Home() {
  const [inputs, setInputs] = useState<SimulationInputs>(INPUT_DEFAULTS);

  const handleChange = useCallback(
    <K extends keyof SimulationInputs>(key: K, value: SimulationInputs[K]) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const { result, isRunning } = useSimulation(inputs);

  return (
    <div className="min-h-screen bg-[#F7F9FB]">

      {/* ── Page Header — navy bar, one dark element ── */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{ background: '#0F1729', borderBottom: '1px solid rgba(255,255,255,0.08)', height: '48px' }}
      >
        <div className="max-w-[1600px] mx-auto h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Red vertical rule accent */}
            <div style={{ width: '2px', height: '20px', background: '#B91C1C', flexShrink: 0 }} aria-hidden />
            <h1
              style={{ fontFamily: 'var(--font-libre-baskerville), Georgia, serif', fontSize: '16px', fontWeight: 400, color: '#FFFFFF', letterSpacing: '0.01em', lineHeight: 1.2 }}
            >
              Security Leader Vacancy Risk Calculator
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', color: '#6B8DB0', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Powered by Hitch Partners
            </span>
            <span style={{ color: '#3A5272', fontSize: '10px' }}>&nbsp;·&nbsp;</span>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: '#4A6B8C' }}>
              VRQM · 5,000 MC Iterations
            </span>
          </div>
        </div>
      </header>

      {/* ── Two-Column Layout ── */}
      <div className="max-w-[1600px] mx-auto">
        <div className="lg:flex lg:h-[calc(100vh-48px)]">

          {/* Left — Input Panel (fixed 380px, sticky) */}
          <div
            className="lg:w-[380px] lg:shrink-0 lg:sticky lg:top-[48px] lg:h-[calc(100vh-48px)] lg:overflow-y-auto
              border-b lg:border-b-0 lg:border-r border-[#DDE3EC] bg-white"
          >
            <InputPanel inputs={inputs} onChange={handleChange} />
          </div>

          {/* Right — Results Panel (flex-fill, scrollable) */}
          <div className="lg:flex-1 lg:overflow-y-auto bg-[#F7F9FB]">
            <ResultsPanel result={result} isRunning={isRunning} inputs={inputs} />

            {/* Footer */}
            <footer className="border-t border-[#DDE3EC] bg-white px-8 py-5 mt-2">
              <div className="flex flex-col sm:flex-row gap-6 justify-between max-w-4xl">
                <div className="space-y-4 flex-1">
                  <div>
                    <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#7A8FA6', marginBottom: '4px' }}>
                      Methodology
                    </p>
                    <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', color: '#7A8FA6', lineHeight: 1.6 }}>
                      Cost projections are risk-weighted estimates based on industry benchmarks,
                      regulatory data, and statistical modeling. These represent potential financial
                      impacts derived from empirical data across 600+ global organizations.
                      Calculations utilize Hitch Partners&rsquo; proprietary VRQM (Vacancy Risk
                      Quantification Model) methodology to model exponential risk acceleration during
                      leadership gaps. Individual organizational outcomes will vary based on specific
                      risk factors and security posture.
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#7A8FA6', marginBottom: '4px' }}>
                      Data Sources
                    </p>
                    <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', color: '#7A8FA6', lineHeight: 1.6 }}>
                      Industry breach data sourced from IBM Cost of Data Breach Report 2025,
                      Cyentia Information Risk Insights Study (IRIS 2025) statistical analysis,
                      and established cybersecurity industry standards. Security leader time-to-fill
                      benchmarks sourced from IANS Research / Artico Search CISO Hiring Study.
                      Hitch Partners placement timeline reflects verified internal search performance data.
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#7A8FA6', marginBottom: '4px' }}>
                      Disclaimer
                    </p>
                    <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', color: '#7A8FA6', lineHeight: 1.6 }}>
                      These projections represent statistical estimates based on industry data,
                      not guarantees of individual outcomes. Organizations should conduct their
                      own risk assessment in consultation with qualified cybersecurity and legal
                      professionals.
                    </p>
                  </div>
                </div>
                <div className="sm:text-right sm:shrink-0 sm:max-w-xs">
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#7A8FA6', marginBottom: '4px' }}>
                    Citations
                  </p>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', color: '#7A8FA6', lineHeight: 1.8 }}>
                    IBM Cost of Data Breach Report 2025&nbsp;·<br />
                    Cyentia IRIS 2025&nbsp;·<br />
                    IANS/Artico CISO Hiring Study
                  </p>
                  <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: '#7A8FA6', marginTop: '16px', opacity: 0.7 }}>
                    &copy; {new Date().getFullYear()} Hitch Partners · VRQM stochastic methodology
                  </p>
                </div>
              </div>
            </footer>
          </div>

        </div>
      </div>
    </div>
  );
}
