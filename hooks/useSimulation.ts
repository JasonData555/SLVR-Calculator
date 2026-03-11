'use client';

import { useEffect, useRef, useState } from 'react';
import type { SimulationInputs, SimulationOutput } from '@/lib/types';
import { useDebounce } from './useDebounce';

export function useSimulation(inputs: SimulationInputs) {
  const [result, setResult] = useState<SimulationOutput | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const workerRef = useRef<Worker | null>(null);

  // Debounce all input changes 300ms before triggering a new simulation run
  const debouncedInputs = useDebounce(inputs, 300);

  useEffect(() => {
    // Terminate any in-progress worker before starting a new one
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    setIsRunning(true);
    setResult(null); // clears result → triggers skeleton loaders

    const worker = new Worker('/workers/simulation.worker.js');
    workerRef.current = worker;

    worker.postMessage(debouncedInputs);

    worker.onmessage = (e: MessageEvent<SimulationOutput>) => {
      setResult(e.data);
      setIsRunning(false);
    };

    worker.onerror = (err) => {
      console.error('Simulation worker error:', err);
      setIsRunning(false);
    };

    return () => {
      worker.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(debouncedInputs)]);

  return { result, isRunning };
}
