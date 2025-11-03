import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Topbar from '../../../components/calculators_shared_files/topBar';
import CalculatorSection from './components/CalculatorSection';
import ResultsSection from './components/ResultsSection';
import LenderOffers from './components/LenderOffers';
import Footer from './components/Footer';
import { calculateStandardLoan, calculateAcceleratedLoan } from './utils/loanCalculations';

function App() {
  // Loan input state
  const [loanInputs, setLoanInputs] = useState({
    amount: 25000,
    term: 60, // months
    rate: 0.065, // 6.5%
    startDate: new Date(),
    extraPayment: 100,
    extraPaymentFrequency: 1, // 1 = monthly, 2 = biweekly
    paymentFrequency: 1 // 1 = monthly, 2 = biweekly
  });

  // Calculation results state
  const [results, setResults] = useState({
    standard: null,
    accelerated: null,
    chartData: null
  });

  // UI state
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAmortization, setShowAmortization] = useState(false);

  // Auto-calculate whenever inputs change
  useEffect(() => {
    calculateResults();
  }, [loanInputs]);

  const calculateResults = async () => {
    setIsCalculating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // smooth UX delay

      const standard = calculateStandardLoan(
        loanInputs.amount,
        loanInputs.rate,
        loanInputs.term
      );

      const accelerated = calculateAcceleratedLoan(
        loanInputs.amount,
        loanInputs.rate,
        loanInputs.term,
        loanInputs.extraPayment,
        loanInputs.extraPaymentFrequency
      );

      setResults({
        standard: { ...standard, principal: loanInputs.amount },
        accelerated,
        chartData: {
          costBreakdown: [
            { name: 'Principal', value: loanInputs.amount, color: '#00C1B0' },
            { name: 'Interest', value: accelerated.totalInterest, color: '#E0F7F5' }
          ],
          timelineComparison: [
            { name: 'Standard', months: standard.termMonths, color: '#697586' },
            { name: 'Accelerated', months: accelerated.actualMonths, color: '#00C1B0' }
          ]
        }
      });
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const updateLoanInput = (field, value) => {
    setLoanInputs(prev => ({ ...prev, [field]: value }));
  };

  const resetCalculator = () => {
    setLoanInputs({
      amount: 25000,
      term: 60,
      rate: 0.065,
      startDate: new Date(),
      extraPayment: 100,
      extraPaymentFrequency: 1,
      paymentFrequency: 1
    });
    setShowAmortization(false);
  };

  return (
    <div className="min-h-screen bg-bg-page text-neutral-900">
      <Topbar />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.section
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-h1 font-bold text-neutral-900 mb-4">
            Auto Loan Early Payoff Calculator
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            See how much you can save in interest and how quickly you can pay off your car loan 
            by making extra payments toward your principal balance.
          </p>
          <div className="mt-6 w-24 h-1 bg-primary-500 mx-auto rounded-full" />
        </motion.section>

        {/* Calculator + Results Section */}
        <motion.section
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CalculatorSection
            loanInputs={loanInputs}
            onInputChange={updateLoanInput}
            onCalculate={calculateResults}
            onReset={resetCalculator}
            isCalculating={isCalculating}
          />

          <ResultsSection
            results={results}
            loanInputs={loanInputs}
            showAmortization={showAmortization}
            onToggleAmortization={() => setShowAmortization(!showAmortization)}
          />
        </motion.section>

        {/* Lender Offers */}
        <LenderOffers />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

export default App;
