import React from 'react';
import { motion } from 'framer-motion';
import PayoffSummaryCard from './PayoffSummaryCard';
import LoanCostBreakdown from './LoanCostBreakdown';
import PayoffTimelineComparison from './PayoffTimelineComparison';
import AmortizationSchedule from './AmortizationSchedule';

const ResultsSection = ({ 
  results, 
  loanInputs, 
  showAmortization, 
  onToggleAmortization 
}) => {
  if (!results.standard || !results.accelerated) {
    return (
      <motion.div
        className="bg-bg-surface rounded-lg boxShadow-md p-8 text-center"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-neutral-400">
          <h3 className="text-h2 mb-4">Ready to Calculate</h3>
          <p>Enter your loan details and extra payment information to see your savings.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <PayoffSummaryCard 
        standard={results.standard}
        accelerated={results.accelerated}
        loanInputs={loanInputs}
      />
      
      <LoanCostBreakdown 
        chartData={results.chartData?.costBreakdown || []}
        standard={results.standard}
        accelerated={results.accelerated}
      />
      
      <PayoffTimelineComparison 
        chartData={results.chartData?.timelineComparison || []}
        startDate={loanInputs.startDate}
        standard={results.standard}
        accelerated={results.accelerated}
      />
      
      <AmortizationSchedule 
        schedule={results.accelerated.schedule}
        isOpen={showAmortization}
        onToggle={onToggleAmortization}
      />
    </motion.div>
  );
};

export default ResultsSection;
