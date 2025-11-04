import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, useTheme } from '@mui/material';
import Topbar from '../../../components/calculators_shared_files/topBar';
import Footer from '../auto_loan_calculator/components/Footer';
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

        {/* Footer */}
        <Footer />
      </main>
    </Box>
  );
}
