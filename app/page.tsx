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
    <div className="min-h-screen bg-[#0A1628]">

      {/* ── Page Header ── */}
      <header
        className="sticky top-0 z-50 w-full border-b border-[#1E3A5F]"
        style={{ background: '#080F1E' }}
      >
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-px h-4 bg-[#C4A55A]" aria-hidden />
            <h1 className="text-[#E8EDF5] font-semibold text-sm leading-tight tracking-wide">
              Security Leader Vacancy Risk Calculator
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#6B7FA3] text-xs font-light tracking-widest uppercase">
              Powered by Hitch Partners
            </span>
            <span className="text-[#1E3A5F] text-xs">·</span>
            <span className="text-[#6B7FA3] text-[10px] font-mono">
              VRQM · 5,000 MC Iterations
            </span>
          </div>
        </div>
      </header>

      {/* ── Two-Column Layout ── */}
      <div className="max-w-[1600px] mx-auto">
        <div className="lg:flex lg:h-[calc(100vh-48px)]">

          {/* Left — Input Panel (40%, sticky) */}
          <div
            className="lg:w-[40%] lg:shrink-0 lg:sticky lg:top-[48px] lg:h-[calc(100vh-48px)] lg:overflow-y-auto
              border-b lg:border-b-0 lg:border-r border-[#1E3A5F] bg-[#0D1929]"
          >
            <InputPanel inputs={inputs} onChange={handleChange} />
          </div>

          {/* Right — Results Panel (60%, scrollable) */}
          <div className="lg:flex-1 lg:overflow-y-auto bg-[#0A1628]">
            <ResultsPanel result={result} isRunning={isRunning} inputs={inputs} />

            {/* Footer */}
            <footer className="border-t border-[#1E3A5F] bg-[#080F1E] px-6 py-8 mt-2">
              <div className="max-w-3xl space-y-5 text-xs text-[#6B7FA3] leading-relaxed">
                <div>
                  <p className="font-semibold text-[#E8EDF5]/60 mb-1 uppercase tracking-wide text-[10px]">
                    Methodology
                  </p>
                  <p>
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
                  <p className="font-semibold text-[#E8EDF5]/60 mb-1 uppercase tracking-wide text-[10px]">
                    Data Sources
                  </p>
                  <p>
                    Industry breach data sourced from IBM Cost of Data Breach Report 2025,
                    Cyentia Information Risk Insights Study (IRIS 2025) statistical analysis,
                    and established cybersecurity industry standards. Security leader time-to-fill
                    benchmarks sourced from IANS Research / Artico Search CISO Hiring Study.
                    Hitch Partners placement timeline reflects verified internal search performance data.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[#E8EDF5]/60 mb-1 uppercase tracking-wide text-[10px]">
                    Disclaimer
                  </p>
                  <p>
                    These projections represent statistical estimates based on industry data,
                    not guarantees of individual outcomes. Organizations should conduct their
                    own risk assessment in consultation with qualified cybersecurity and legal
                    professionals.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#1E3A5F]">
                  <p className="text-[#6B7FA3]/60 font-mono text-[10px]">
                    &copy; {new Date().getFullYear()} Hitch Partners &nbsp;·&nbsp; All rights reserved &nbsp;·&nbsp;
                    VRQM stochastic methodology with Monte Carlo simulation
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
