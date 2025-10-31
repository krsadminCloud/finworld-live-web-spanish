import React from 'react';
import { motion } from 'framer-motion';
import { Home, TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatCurrency';
import { calculateRatios, getLenderRecommendations } from '../utils/calculations';

const ResultsCard = ({ affordablePrice, pitiBreakdown, inputs }) => {
  if (!pitiBreakdown) return null;

  const ratios = calculateRatios(inputs, affordablePrice);
  const recommendations = getLenderRecommendations(ratios.debtToIncomeRatio, ratios.mortgageToIncomeRatio);

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error" />;
      default:
        return <Info className="w-5 h-5 text-primary-500" />;
    }
  };

  const getRecommendationBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-success/20';
      case 'warning':
        return 'border-warning/20';
      case 'error':
        return 'border-error/20';
      default:
        return 'border-primary-500/20';
    }
  };

  const pitiItems = [
    {
      label: 'Principal & Interest',
      amount: pitiBreakdown.principalAndInterest,
      description: 'Your loan payment',
      color: 'text-primary-500'
    },
    {
      label: 'Property Tax',
      amount: pitiBreakdown.propertyTax,
      description: 'Monthly property taxes',
      color: 'text-blue-500'
    },
    {
      label: 'Homeowners Insurance',
      amount: pitiBreakdown.insurance,
      description: 'Monthly insurance premium',
      color: 'text-green-500'
    },
    {
      label: 'HOA Fees',
      amount: pitiBreakdown.hoa,
      description: 'Homeowners association',
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Results Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-surface rounded-xl p-6 shadow-card card-hover"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Home className="w-6 h-6 text-primary-500" />
          <h3 className="text-xl font-heading font-semibold text-text-primary">
            Affordability Results
          </h3>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-primary-100 rounded-lg">
            <p className="text-sm text-text-secondary mb-1">Max Home Price</p>
            <motion.p 
              key={affordablePrice}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-bold text-primary-700"
            >
              {formatCurrency(affordablePrice, { compact: true })}
            </motion.p>
          </div>
          
          <div className="text-center p-4 bg-success/10 rounded-lg">
            <p className="text-sm text-text-secondary mb-1">Loan Amount</p>
            <motion.p 
              key={pitiBreakdown.loanAmount}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-xl font-bold text-success"
            >
              {formatCurrency(pitiBreakdown.loanAmount, { compact: true })}
            </motion.p>
          </div>
          
          <div className="text-center p-4 bg-warning/10 rounded-lg">
            <p className="text-sm text-text-secondary mb-1">Down Payment</p>
            <motion.p 
              key={inputs.downPayment}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-xl font-bold text-warning"
            >
              {formatCurrency(inputs.downPayment, { compact: true })}
            </motion.p>
          </div>
        </div>

        {/* PITI Breakdown */}
        <div>
          <h4 className="text-lg font-semibold text-text-primary mb-4">
            Monthly Payment Breakdown (PITI)
          </h4>
          <div className="space-y-3">
            {pitiItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-bg-page rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-text-primary">{item.label}</p>
                  <p className="text-sm text-text-secondary">{item.description}</p>
                </div>
                <p className={`font-semibold ${item.color}`}>
                  {formatCurrency(item.amount)}
                </p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="mt-4 p-4 bg-primary-500 text-white rounded-lg"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total Monthly Payment</span>
              <span className="text-xl font-bold">
                {formatCurrency(pitiBreakdown.totalMonthlyPayment)}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Lender Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-surface rounded-xl p-6 shadow-card card-hover"
      >
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary-500" />
          <h3 className="text-xl font-heading font-semibold text-text-primary">
            Lender Recommendations
          </h3>
        </div>

        {/* DTI Ratios */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-bg-page rounded-lg">
            <p className="text-sm text-text-secondary mb-1">Debt-to-Income Ratio</p>
            <p className={`text-lg font-bold ${
              ratios.debtToIncomeRatio <= 36 ? 'text-success' : 
              ratios.debtToIncomeRatio <= 43 ? 'text-warning' : 'text-error'
            }`}>
              {formatPercentage(ratios.debtToIncomeRatio, 1)}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Target: 36% or below
            </p>
          </div>
          
          <div className="text-center p-4 bg-bg-page rounded-lg">
            <p className="text-sm text-text-secondary mb-1">Mortgage-to-Income Ratio</p>
            <p className={`text-lg font-bold ${
              ratios.mortgageToIncomeRatio <= 28 ? 'text-success' : 'text-warning'
            }`}>
              {formatPercentage(ratios.mortgageToIncomeRatio, 1)}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Target: 28% or below
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              className={`flex items-start space-x-3 p-4 border rounded-lg ${getRecommendationBorderColor(rec.type)}`}
            >
              {getRecommendationIcon(rec.type)}
              <div className="flex-1">
                <h4 className="font-semibold text-text-primary mb-1">{rec.title}</h4>
                <p className="text-sm text-text-secondary">{rec.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ResultsCard;
