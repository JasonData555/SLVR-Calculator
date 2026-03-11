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
    <div className="min-h-screen" style={{ background: '#F8F9FA' }}>
      {/* ── Page Header ── */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{ background: '#0F1729' }}
      >
        <div className="max-w-[1600px] mx-auto px-6 py-3.5 flex items-center justify-between">
          <h1 className="text-white font-semibold text-base leading-tight">
            Security Leader Vacancy Risk Calculator
          </h1>
          <p className="text-slate-400 text-xs font-light tracking-wide">
            Powered by Hitch Partners
          </p>
        </div>
      </header>

      {/* ── Two-Column Layout ── */}
      <div className="max-w-[1600px] mx-auto">
        <div className="lg:flex lg:h-[calc(100vh-52px)]">

          {/* Left — Input Panel (40%, sticky) */}
          <div
            className="lg:w-[40%] lg:shrink-0 lg:sticky lg:top-[52px] lg:h-[calc(100vh-52px)] lg:overflow-y-auto
              border-b lg:border-b-0 lg:border-r border-slate-200 bg-white"
          >
            <InputPanel inputs={inputs} onChange={handleChange} />
          </div>

          {/* Right — Results Panel (60%, scrollable) */}
          <div className="lg:flex-1 lg:overflow-y-auto">
            <ResultsPanel result={result} isRunning={isRunning} inputs={inputs} />

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white px-6 py-8 mt-4">
              <div className="max-w-3xl space-y-5 text-xs text-slate-500 leading-relaxed">
                <div>
                  <p className="font-semibold text-slate-700 mb-1">Methodology</p>
                  <p>
                    Cost projections are risk-weighted estimates based on industry benchmarks,
                    regulatory data, and statistical modeling. These represent potential financial
                    impacts derived from empirical data across 600+ global organizations.
                    Calculations utilize Hitch Partners&rsquo; proprietary CVR (CISO Vacancy Risk)
                    methodology to model exponential risk acceleration during leadership gaps.
                    Individual organizational outcomes will vary based on specific risk factors
                    and security posture.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 mb-1">Data Sources</p>
                  <p>
                    Industry breach data sourced from IBM Cost of Data Breach Report 2025,
                    Cyentia Information Risk Insights Study (IRIS 2025) statistical analysis,
                    and established cybersecurity industry standards. Hitch Partners applied
                    risk-weighted industry averages segmented by sector and company size to
                    reflect your organization&rsquo;s specific risk profile. Security leader
                    time-to-fill benchmarks sourced from IANS Research / Artico Search CISO
                    Hiring Study. Hitch Partners placement timeline reflects verified internal
                    search performance data.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 mb-1">Disclaimer</p>
                  <p>
                    These projections represent statistical estimates based on industry data,
                    not guarantees of individual outcomes. Organizations should conduct their
                    own risk assessment in consultation with qualified cybersecurity and legal
                    professionals.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-slate-400">
                    &copy; {new Date().getFullYear()} Hitch Partners. All rights reserved.
                    Powered by VRQM stochastic methodology with Monte Carlo simulation.
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
