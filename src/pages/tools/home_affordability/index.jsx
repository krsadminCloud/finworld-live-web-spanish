import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import InputCard from './components/InputCard';
import ResultsCard from './components/ResultsCard';
import BreakdownChart from './components/BreakdownChart';
import ComparisonChart from './components/ComparisonChart';
import StickySummary from './components/StickySummary';
import { calculateMaxAffordablePrice, calculatePITIBreakdown } from './utils/calculations';
import TopBar from '../../../components/calculators_shared_files/topBar';
import { ensureHomeAffThemeCss } from './themeCssLoader';

function HomeAffordabilityCalculator() {
  const [inputs, setInputs] = useState({
    annualIncome: 100000,
    monthlyDebts: 500,
    downPayment: 60000,
    loanTerm: 30,
    interestRate: 7.0,
    propertyTaxRate: 1.2,
    insuranceAmount: 1200,
    hoaFees: 0,
    zipCode: '10001',
    mortgageToIncomeRatio: 28,
    debtToIncomeRatio: 36,
    maxHomePrice: 2000000
  });

  const [affordablePrice, setAffordablePrice] = useState(0);
  const [pitiBreakdown, setPitiBreakdown] = useState(null);
  const theme = useTheme();

  // Load saved inputs from localStorage
  useEffect(() => {
    const savedInputs = localStorage.getItem('homeCalculatorInputs');
    if (savedInputs) {
      setInputs(JSON.parse(savedInputs));
    }
  }, []);

  // Save inputs to localStorage
  useEffect(() => {
    localStorage.setItem('homeCalculatorInputs', JSON.stringify(inputs));
  }, [inputs]);

  // Calculate affordability whenever inputs change
  useEffect(() => {
    const maxPrice = calculateMaxAffordablePrice(inputs);
    setAffordablePrice(maxPrice);
    
    const breakdown = calculatePITIBreakdown(maxPrice, inputs);
    setPitiBreakdown(breakdown);
  }, [inputs]);

  useEffect(() => {
    ensureHomeAffThemeCss(theme.palette.mode);
  }, [theme.palette.mode]);

  return (
    <div className="home-affordability calculator-container min-h-screen bg-bg-page transition-colors duration-300">
      <TopBar />
      <motion.section
        className="text-center mb-12 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-h1 font-bold text-neutral-900">
              Home Affordability Calculator
            </h1>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
              Calculate how much home you can afford based on your financial situation
            </p>
          </div>
        </div>
        <div className="mt-4 w-24 h-1 bg-primary-500 mx-auto rounded-full" />
      </motion.section>

      {/* Sticky Summary */}
      <StickySummary affordablePrice={affordablePrice} pitiBreakdown={pitiBreakdown} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <InputCard inputs={inputs} setInputs={setInputs} />
          </motion.div>

          {/* Right Column - Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <ResultsCard 
              affordablePrice={affordablePrice} 
              pitiBreakdown={pitiBreakdown} 
              inputs={inputs}
            />
            
            {pitiBreakdown && (
              <>
                <BreakdownChart pitiBreakdown={pitiBreakdown} />
                <ComparisonChart inputs={inputs} affordablePrice={affordablePrice} />
              </>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border-subtle mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-text-secondary">
            <p className="text-sm">
              © 2025 FinWorld Project. This calculator provides estimates only. 
              Consult with financial professionals for personalized advice.
            </p>
            <p className="text-xs mt-2">
              Calculations based on standard mortgage underwriting guidelines. 
              Actual loan terms may vary by lender and credit profile.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomeAffordabilityCalculator;
