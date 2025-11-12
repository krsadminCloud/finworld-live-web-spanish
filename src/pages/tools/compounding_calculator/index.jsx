import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import Topbar from '../../../components/calculators_shared_files/topBar';
import CalculatorSection from './components/CalculatorSection';
import ResultsSection from './components/ResultsSection';
import { calculateAll } from './utils/calc';
import { useSearchParams } from 'react-router-dom';
import { ensureCompThemeCss } from './themeCssLoader';

const DEFAULTS = {
  initialInvestment: 0,
  ratePercent: 0,
  rateUnit: 'annual',
  compoundingFrequency: 'monthly',
  years: 0,
  months: 0,
  contribution: 0,
  contributionFrequency: 'monthly',
  timing: 'end',
};

const RESET_STATE = {
  initialInvestment: 0,
  ratePercent: 0,
  rateUnit: 'annual',
  compoundingFrequency: 'monthly',
  years: 0,
  months: 0,
  contribution: 0,
  contributionFrequency: 'monthly',
  timing: 'end',
};

export default function CompoundingCalculator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputs, setInputs] = useState(() => readParams(searchParams) || DEFAULTS);
  const [granularity, setGranularity] = useState('yearly');
  const [palette, setPalette] = useState('A');
  const PALETTES = {
    A: { primary: '#00C1B0', secondary1: '#93C5FD', secondary2: '#F59E0B' },
    B: { primary: '#10B981', secondary1: '#6366F1', secondary2: '#F59E0B' },
    C: { primary: '#3B82F6', secondary1: '#8B5CF6', secondary2: '#14B8A6' },
  };
  const scheduleRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(inputs).forEach(([k, v]) => params.set(k, String(v)));
    setSearchParams(params, { replace: true });
  }, [inputs, setSearchParams]);

  useEffect(() => {
    ensureCompThemeCss(theme.palette.mode);
  }, [theme.palette.mode]);

  const results = useMemo(() => {
    return calculateAll({ ...inputs, chartGranularity: granularity });
  }, [inputs, granularity]);

  const updateInput = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const reset = () => setInputs(RESET_STATE);

  return (
    <div className="compounding-calculator min-h-screen bg-bg-page text-neutral-900">
      <Topbar />
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.section
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-h1 font-bold text-neutral-900 mb-4">
            Compounding Calculator
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Calculate compound growth with flexible compounding and contribution schedules. Share results with a link, export tables, and visualize your growth.
          </p>
          <div className="mt-6 w-24 h-1 bg-primary-500 mx-auto rounded-full" />
        </motion.section>

        <motion.section
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CalculatorSection inputs={inputs} onChange={updateInput} onReset={reset} results={results} granularity={granularity} setGranularity={setGranularity} />
          <ResultsSection results={results} granularity={granularity} setGranularity={setGranularity} scheduleRef={scheduleRef} palette={PALETTES[palette]} />
        </motion.section>
      </main>
    </div>
  );
}

function readParams(sp) {
  if (!sp || sp.size === 0) return null;
  const val = (k, d, parse=Number) => sp.get(k) !== null ? (parse === Number ? Number(sp.get(k)) : sp.get(k)) : d;
  return {
    initialInvestment: val('initialInvestment', 0),
    ratePercent: val('ratePercent', 0),
    rateUnit: val('rateUnit', 'annual', String),
    compoundingFrequency: val('compoundingFrequency', 'monthly', String),
    years: val('years', 0),
    months: val('months', 0),
    contribution: val('contribution', 0),
    contributionFrequency: val('contributionFrequency', 'monthly', String),
    timing: val('timing', 'end', String),
  };
}
