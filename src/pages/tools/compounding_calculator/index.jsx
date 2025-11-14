import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
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
  // Build canonical URL dynamically to match deployed route
  const loc = typeof window !== 'undefined' && window.location ? window.location : null;
  const canonicalUrl = loc ? `${loc.origin}${loc.pathname}` : 'https://www.finworld.live/tools/compounding-calculator';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Compounding Calculator',
    url: canonicalUrl,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: 'Calculate compound interest with flexible frequencies and periodic contributions. Visualize growth and export schedules.'
  };

  return (
    <div className="compounding-calculator min-h-screen bg-bg-page text-neutral-900">
      <Helmet>
        <title>Compounding Calculator | FinWorld</title>
        <meta name="description" content="Free compounding calculator to project investment growth with compound interest, contributions, and flexible frequencies. Visualize results and export your schedule." />
        <meta name="keywords" content="compounding calculator, compound interest calculator, financial calculator, investment calculator, savings growth, future value, FinWorld" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Compounding Calculator | FinWorld" />
        <meta property="og:description" content="Project your investment growth with compound interest and contributions. Charts, tables, and exports included." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://www.finworld.live/assets/finworld-preview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Compounding Calculator | FinWorld" />
        <meta name="twitter:description" content="Free compounding calculator with charts and exportable schedules." />
        <meta name="twitter:image" content="https://www.finworld.live/assets/finworld-preview.png" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
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
            Calculate compound interest and projected investment growth with flexible contribution and compounding schedules. This free financial calculator helps you estimate future value, interest earned, and total contributions over time.
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

        {/* SEO FAQ Section */}
        <motion.section
          className="prose prose-slate max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Compounding Calculator FAQs</h2>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">What is a compounding calculator?</h3>
            <p className="text-neutral-600">A compounding calculator estimates how your money can grow over time when interest is added to both your original balance and previously earned interest. You can also include regular contributions.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">How do contributions affect results?</h3>
            <p className="text-neutral-600">Contributions increase your balance at a chosen frequency (monthly, weekly, etc.). Depending on timing, they are applied at the beginning or end of each period, which slightly changes the outcome.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">What’s the difference between nominal and effective rate?</h3>
            <p className="text-neutral-600">The nominal rate is the stated annual rate. The effective annual yield accounts for how often interest compounds, providing a more accurate picture of growth.</p>
          </div>
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is a compounding calculator?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'A compounding calculator estimates how your money can grow over time when interest is added to both your original balance and previously earned interest. You can also include regular contributions.'
                }
              },
              {
                '@type': 'Question',
                name: 'How do contributions affect results?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Contributions increase your balance at a chosen frequency (monthly, weekly, etc.). Depending on timing, they are applied at the beginning or end of each period, which slightly changes the outcome.'
                }
              },
              {
                '@type': 'Question',
                name: 'What’s the difference between nominal and effective rate?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The nominal rate is the stated annual rate. The effective annual yield accounts for how often interest compounds, providing a more accurate picture of growth.'
                }
              }
            ]
          })}</script>
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

