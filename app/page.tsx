'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import InputPanel from '@/components/InputPanel';
import ResultsPanel from '@/components/ResultsPanel';
import FooterDisclosure from '@/components/blocks/FooterDisclosure';
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

      {/* ── Page Header — steel blue bar ── */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{ background: '#5B7C99', borderBottom: '1px solid rgba(255,255,255,0.12)', height: '48px' }}
      >
        <div className="max-w-[1600px] mx-auto h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/hitch-partners-logo.png"
              alt="Hitch Partners"
              height={24}
              width={80}
              style={{ objectFit: 'contain', opacity: 1 }}
              priority
            />
            <h1
              style={{ fontFamily: 'var(--font-libre-baskerville), Georgia, serif', fontSize: '16px', fontWeight: 400, color: '#FFFFFF', letterSpacing: '0.01em', lineHeight: 1.2 }}
            >
              Security Leader Vacancy Risk Calculator
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.65)' }}>
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

            <FooterDisclosure />
          </div>

        </div>
      </div>
    </div>
  );
}
