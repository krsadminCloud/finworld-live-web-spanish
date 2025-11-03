import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, Percent } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/loanCalculations';

const LoanDetailsCard = ({ loanInputs, onInputChange }) => {
  const handleSliderChange = (field, value) => {
    onInputChange(field, parseFloat(value));
  };

  const handleInputChange = (field, value) => {
    const numericValue = parseFloat(value) || 0;
    onInputChange(field, numericValue);
  };

  const [interestRateInput, setInterestRateInput] = useState((loanInputs.rate * 100).toFixed(2));

  useEffect(() => {
    setInterestRateInput((loanInputs.rate * 100).toFixed(2));
  }, [loanInputs.rate]);

  const handleInterestRateChange = (e) => {
    setInterestRateInput(e.target.value);
  };

  const handleInterestRateBlur = () => {
    const numericValue = parseFloat(interestRateInput) || 0;
    onInputChange('rate', numericValue / 100);
  };

  return (
    <motion.div
      className="bg-bg-surface rounded-lg boxShadow-md p-6"
      whileHover={{ boxShadow: 'boxShadow-lg' }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
        <DollarSign className="w-6 h-6 text-teal-500" />
        Loan Details
      </h2>
      
      <div className="space-y-6">
        {/* Loan Amount */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Loan Amount
          </label>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">$</span>
                <input
                  type="number"
                  value={loanInputs.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="w-28 pl-7 pr-3 py-1 border border-neutral-400 rounded-md text-left font-medium input-focus mt-1"
                  min="0"
                />
              </div>
            </div>
<input
  type="range"
  min="0"
  max="100000"
  step="1000"
  value={loanInputs.amount}
  onChange={(e) => handleSliderChange('amount', e.target.value)}
  className="slider"
/>
<div className="flex justify-between mt-2">
  <span className="text-sm text-neutral-500">$0k</span>
  <span className="text-sm text-neutral-500">$100k</span>
</div>
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Loan Term
          </label>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="number"
                value={loanInputs.term / 12}
                onChange={(e) => handleInputChange('term', e.target.value * 12)}
                className="w-28 px-3 py-1 border border-neutral-400 rounded-md text-left font-medium input-focus mt-1"
                min="1"
                max="10"
              />
            </div>
<input
  type="range"
  min="0"
  max="120"
  step="12"
  value={loanInputs.term}
  onChange={(e) => handleSliderChange('term', e.target.value)}
  className="slider"
/>
<div className="flex justify-between mt-2">
  <span className="text-sm text-neutral-500">0 Yrs</span>
  <span className="text-sm text-neutral-500">10 Yrs</span>
</div>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Interest Rate (APR)
          </label>
          <input
            type="number"
            value={interestRateInput}
            onChange={handleInterestRateChange}
            onBlur={handleInterestRateBlur}
            className="w-full px-3 py-2 border border-neutral-400 rounded-md input-focus"
            step="0.01"
            min="0"
            max="30"
            placeholder="6.50"
          />
          <div className="mt-1 text-sm text-neutral-400">
            Current average: {formatPercentage(0.065)} (6.5%)
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Loan Start Date
          </label>
          <input
            type="date"
            value={loanInputs.startDate.toISOString().split('T')[0]}
            onChange={(e) => onInputChange('startDate', new Date(e.target.value))}
            className="w-full px-3 py-2 border border-neutral-400 rounded-md input-focus"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LoanDetailsCard;
