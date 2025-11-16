import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, useTheme } from '@mui/material';
import Topbar from '../../../components/calculators_shared_files/topBar';
import Footer from '../auto_loan_calculator/components/Footer';
import { Helmet } from 'react-helmet-async';
import { formatCurrency } from './utils/retirementLogic';

// Local components
import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';
import SavingsChart from './components/SavingsChart';
import RetirementResources from './components/RetirementResources';

export default function RetirementCalculator() {
  const theme = useTheme();
  const [inputs, setInputs] = useState({
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 0,
    monthlyContribution: 500,
    annualReturn: 7,
    inflationRate: 3,
    withdrawalRate: 4,
  });

  const yearsToRetirement = Math.max(0, inputs.retirementAge - inputs.currentAge);

  const { data, finalBalanceNominal, finalBalanceReal } = useMemo(() => {
    const months = Math.max(0, yearsToRetirement * 12);
    const rMonthly = Math.pow(1 + inputs.annualReturn / 100, 1 / 12) - 1;
    const iMonthly = Math.pow(1 + inputs.inflationRate / 100, 1 / 12) - 1;

    let bal = inputs.currentSavings;
    const out = [];
    for (let m = 1; m <= months; m++) {
      bal = bal * (1 + rMonthly) + inputs.monthlyContribution;
      if (m % 12 === 0) {
        const year = m / 12;
        const age = inputs.currentAge + year;
        const deflator = Math.pow(1 + iMonthly, m);
        out.push({
          name: `Age ${Math.round(age)}`,
          nominal: bal,
          real: bal / deflator,
        });
      }
    }
    const last = out[out.length - 1] || { nominal: inputs.currentSavings, real: inputs.currentSavings };
    return { data: out, finalBalanceNominal: last.nominal, finalBalanceReal: last.real };
  }, [inputs, yearsToRetirement]);

  const annualWithdrawal = (inputs.withdrawalRate / 100) * finalBalanceNominal;
  const monthlyWithdrawal = annualWithdrawal / 12;

  const handleInputChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: Number(value) || 0 }));
  };

  const resetAll = () => {
    setInputs({
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 100000,
      monthlyContribution: 500,
      annualReturn: 7,
      inflationRate: 3,
      withdrawalRate: 4,
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
        color: 'text.primary',
      }}
    >
      <Topbar />
      <Helmet>
        <title>Retirement Savings Calculator | FinWorld</title>
        <meta
          name="description"
          content="Estimate your retirement nest egg, inflation-adjusted savings, and potential withdrawal income based on your age, contributions, and return assumptions."
        />
        <link
          rel="canonical"
          href={
            typeof window !== 'undefined'
              ? `${window.location.origin}/tools/retirement-calculator`
              : 'https://www.finworld.live/tools/retirement-calculator'
          }
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Retirement Savings Calculator | FinWorld"
        />
        <meta
          property="og:description"
          content="Project your retirement savings and withdrawal income with an interactive, inflation-aware calculator."
        />
        <meta
          property="og:url"
          content={
            typeof window !== 'undefined'
              ? `${window.location.origin}/tools/retirement-calculator`
              : 'https://www.finworld.live/tools/retirement-calculator'
          }
        />
        <meta
          property="og:image"
          content="https://www.finworld.live/assets/finworld-preview.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Retirement Savings Calculator | FinWorld"
        />
        <meta
          name="twitter:description"
          content="See how your monthly savings and investment returns can add up by retirement."
        />
        <meta
          name="twitter:image"
          content="https://www.finworld.live/assets/finworld-preview.png"
        />
      </Helmet>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <motion.section
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-h1 font-bold mb-4">Retirement Calculator</h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Estimate your retirement income by allocating monthly savings toward your future. Adjust your savings mix to see how it impacts your take-home retirement income.
          </p>
          <div className="mt-6 w-24 h-1 bg-primary-500 mx-auto rounded-full" />
        </motion.section>

        {/* Calculator Grid */}
        <motion.section
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Left: Inputs */}
          <InputPanel inputs={inputs} onChange={handleInputChange} onReset={resetAll} />

          {/* Right: Results + Chart */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
              <ResultsPanel
                yearsToRetirement={yearsToRetirement}
                finalBalanceNominal={finalBalanceNominal}
                finalBalanceReal={finalBalanceReal}
                annualWithdrawal={annualWithdrawal}
                monthlyWithdrawal={monthlyWithdrawal}
                formatCurrency={formatCurrency}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
              <SavingsChart data={data} formatCurrency={formatCurrency} />
            </motion.div>
          </div>
        </motion.section>

        {/* Supplemental Info */}
        <RetirementResources />

        <section className="mt-10 space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            How to use this retirement calculator
          </h2>
          <p className="text-sm text-neutral-600">
            Start with your current age, desired retirement age, existing savings, and monthly contribution. Then select reasonable assumptions for annual investment return, inflation, and withdrawal rate. The chart and summary show both nominal and inflation-adjusted balances at retirement.
          </p>
          <p className="text-sm text-neutral-600">
            Use the withdrawal section to see a rough estimate of sustainable annual and monthly income at your chosen withdrawal rate, then tweak contributions or retirement age to close any gap.
          </p>

          <h3 className="text-lg font-semibold text-neutral-900 mt-4">
            Related tools
          </h3>
          <p className="text-sm text-neutral-600">
            For a fuller picture of your finances, explore the{" "}
            <a href="/tools/compounding-calculator" className="underline">
              Compounding Calculator
            </a>
            ,{" "}
            <a href="/tools/take-home-pay" className="underline">
              Take-Home Pay Calculator
            </a>
            , and{" "}
            <a href="/tools/extra-payment" className="underline">
              Loan Payoff Calculator
            </a>
            .
          </p>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </Box>
  );
}
