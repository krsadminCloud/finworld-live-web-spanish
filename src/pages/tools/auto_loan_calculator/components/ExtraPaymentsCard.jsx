import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Clock } from 'lucide-react';

const ExtraPaymentsCard = ({ loanInputs, onInputChange }) => {
  const handleExtraPaymentChange = (field, value) => {
    const numericValue = parseFloat(value) || 0;
    onInputChange(field, numericValue);
  };

  const handleFrequencyChange = (field, value) => {
    onInputChange(field, parseInt(value));
  };

  return (
    <motion.div
      className="bg-bg-surface rounded-lg boxShadow-md p-6"
      whileHover={{ boxShadow: 'boxShadow-lg' }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
        <PlusCircle className="w-6 h-6 text-teal-500" />
        Extra Payments
      </h2>
      
      <div className="space-y-6">
        {/* Extra Payment Amount */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Extra Payment Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">$</span>
            <input
              type="number"
              value={loanInputs.extraPayment}
              onChange={(e) => handleExtraPaymentChange('extraPayment', e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-neutral-400 rounded-md input-focus"
              min="0"
              step="25"
              placeholder="100"
            />
          </div>
          <div className="mt-2 text-sm text-neutral-400">
            Add this amount on top of your regular payment
          </div>
        </div>

        {/* Extra Payment Frequency */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Extra Payment Frequency
          </label>
          <select
            value={loanInputs.extraPaymentFrequency}
            onChange={(e) => handleFrequencyChange('extraPaymentFrequency', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-400 rounded-md input-focus bg-bg-surface"
          >
            <option value={1}>Monthly</option>
            <option value={2}>Bi-weekly (every 2 weeks)</option>
          </select>
          <div className="mt-2 text-sm text-neutral-400">
            How often you'll make the extra payment
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Quick Add Extra Payment
          </label>
          <div className="flex gap-2 flex-wrap">
            {[25, 50, 100, 200].map((amount) => (
              <motion.button
                key={amount}
                onClick={() => handleExtraPaymentChange('extraPayment', amount)}
                className="px-4 py-2 text-sm border border-teal-500 text-teal-500 rounded-md hover:bg-teal-500 hover:text-neutral-100 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                +${amount}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Payment Frequency */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Regular Payment Frequency
          </label>
          <select
            value={loanInputs.paymentFrequency}
            onChange={(e) => handleFrequencyChange('paymentFrequency', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-400 rounded-md input-focus bg-bg-surface"
          >
            <option value={1}>Monthly</option>
            <option value={2}>Bi-weekly (every 2 weeks)</option>
          </select>
          <div className="mt-2 text-sm text-neutral-400">
            Your regular loan payment schedule
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExtraPaymentsCard;
