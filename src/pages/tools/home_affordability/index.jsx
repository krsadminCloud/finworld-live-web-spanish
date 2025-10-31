import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Home } from 'lucide-react';
import InputCard from './components/InputCard';
import ResultsCard from './components/ResultsCard';
import BreakdownChart from './components/BreakdownChart';
import ComparisonChart from './components/ComparisonChart';
import StickySummary from './components/StickySummary';
import { calculateMaxAffordablePrice, calculatePITIBreakdown } from './utils/calculations';

function HomeAffordabilityCalculator() {
  const [darkMode, setDarkMode] = useState(false);
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

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="calculator-container min-h-screen bg-bg-page transition-colors duration-300">
      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50 p-3 bg-bg-surface rounded-lg shadow-card hover:shadow-card-hover transition-all duration-200"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-text-secondary" />
        )}
      </button>

      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <Home className="w-8 h-8 text-primary-500" />
            <div>
              <h1 className="text-3xl font-heading font-bold text-text-primary">
                Home Affordability Calculator
              </h1>
              <p className="text-text-secondary mt-1">
                Calculate how much home you can afford based on your financial situation
              </p>
            </div>
          </div>
        </div>
      </header>

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
