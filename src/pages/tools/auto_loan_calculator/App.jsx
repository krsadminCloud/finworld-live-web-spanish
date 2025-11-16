import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Topbar from '../../../components/calculators_shared_files/topBar';
import CalculatorSection from './components/CalculatorSection';
import ResultsSection from './components/ResultsSection';
import LenderOffers from './components/LenderOffers';
import Footer from './components/Footer';
import { Helmet } from 'react-helmet-async';
import { calculateStandardLoan, calculateAcceleratedLoan } from './utils/loanCalculations';
import { trackEvent } from '../../../utils/analytics';

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
      trackEvent('auto_loan_calculated', {
        calculator: 'auto_loan',
        amount: loanInputs.amount,
        termMonths: loanInputs.term,
        rate: loanInputs.rate,
        extraPayment: loanInputs.extraPayment,
        extraFrequency: loanInputs.extraPaymentFrequency,
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
      <Helmet>
        <title>Auto Loan Early Payoff Calculator | FinWorld</title>
        <meta
          name="description"
          content="See how extra payments and different schedules change your auto loan payoff date, interest cost, and savings."
        />
        <link
          rel="canonical"
          href={
            typeof window !== 'undefined'
              ? `${window.location.origin}/tools/auto-loan-calculator`
              : 'https://www.finworld.live/tools/auto-loan-calculator'
          }
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Auto Loan Early Payoff Calculator | FinWorld"
        />
        <meta
          property="og:description"
          content="Compare standard vs accelerated auto loan payoff and visualize how much interest you can save."
        />
        <meta
          property="og:url"
          content={
            typeof window !== 'undefined'
              ? `${window.location.origin}/tools/auto-loan-calculator`
              : 'https://www.finworld.live/tools/auto-loan-calculator'
          }
        />
        <meta
          property="og:image"
          content="https://www.finworld.live/assets/finworld-preview.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Auto Loan Early Payoff Calculator | FinWorld"
        />
        <meta
          name="twitter:description"
          content="Model extra payments, biweekly schedules, and interest savings on your car loan."
        />
        <meta
          name="twitter:image"
          content="https://www.finworld.live/assets/finworld-preview.png"
        />
      </Helmet>

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

        <section className="mt-10 space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900">
            How to use this auto loan payoff calculator
          </h2>
          <p className="text-sm text-neutral-600">
            Enter your loan amount, term, and interest rate, then choose a payment frequency and extra payment strategy. The results panel compares your standard schedule with an accelerated plan so you can see how many months and how much interest you save.
          </p>
          <p className="text-sm text-neutral-600">
            Try testing different extra payment amounts or switching between monthly and biweekly payments to find a plan that fits your budget while still paying off the loan faster.
          </p>

          <h3 className="text-lg font-semibold text-neutral-900 mt-4">
            Related tools
          </h3>
          <p className="text-sm text-neutral-600">
            Shopping for a car? Compare financing options with the{" "}
            <a href="/tools/buy-vs-lease-auto" className="underline">
              Buy vs Lease Calculator
            </a>
            , or explore broader debt strategies with the{" "}
            <a href="/tools/extra-payment" className="underline">
              Loan Payoff Calculator
            </a>{" "}
            and{" "}
            <a href="/tools/take-home-pay" className="underline">
              Take-Home Pay Calculator
            </a>
            .
          </p>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

export default App;
