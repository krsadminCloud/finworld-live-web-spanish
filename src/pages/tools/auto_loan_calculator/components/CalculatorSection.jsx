import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, RotateCcw } from 'lucide-react';
import LoanDetailsCard from './LoanDetailsCard';
import ExtraPaymentsCard from './ExtraPaymentsCard';

const CalculatorSection = ({ 
  loanInputs, 
  onInputChange, 
  onCalculate, 
  onReset, 
  isCalculating 
}) => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <LoanDetailsCard
        loanInputs={loanInputs}
        onInputChange={onInputChange}
      />
      
      <ExtraPaymentsCard
        loanInputs={loanInputs}
        onInputChange={onInputChange}
      />
      
    </motion.div>
  );
};

export default CalculatorSection;
