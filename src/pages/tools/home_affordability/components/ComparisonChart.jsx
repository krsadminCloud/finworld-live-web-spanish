import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, ArrowUpDown } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatCurrency';
import { compareScenarios } from '../utils/calculations';

const ComparisonChart = ({ inputs, affordablePrice }) => {
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonRate, setComparisonRate] = useState(inputs.interestRate + 0.5);

  const comparisonData = showComparison ? 
    compareScenarios(inputs, comparisonRate) : null;

  const scenarios = [
    {
      rate: inputs.interestRate,
      price: affordablePrice,
      label: `Current Rate (${formatPercentage(inputs.interestRate, 1)})`,
      color: '#0057B7'
    },
    ...(showComparison ? [{
      rate: comparisonRate,
      price: comparisonData?.comparisonPrice || 0,
      label: `Higher Rate (${formatPercentage(comparisonRate, 1)})`,
      color: '#EF4444'
    }] : [])
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface p-3 rounded-lg shadow-lg border border-border-subtle">
          <p className="font-semibold text-text-primary">{`Rate: ${formatPercentage(label, 1)}`}</p>
          <p className="text-primary-500 font-bold">
            Max Price: {formatCurrency(payload[0].value, { compact: true })}
          </p>
        </div>
      );
    }
    return null;
  };

  const impactMessage = comparisonData ? {
    type: comparisonData.impact < -5 ? 'warning' : 'info',
    title: comparisonData.impact < -5 ? 'Significant Impact' : 'Moderate Impact',
    message: `A ${formatPercentage(comparisonRate - inputs.interestRate, 1)} rate increase reduces your buying power by ${formatCurrency(Math.abs(comparisonData.difference), { compact: true })} (${Math.abs(comparisonData.impact).toFixed(1)}%)`
  } : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-surface rounded-xl p-6 shadow-card card-hover"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-primary-500" />
          <h3 className="text-xl font-heading font-semibold text-text-primary">
            Interest Rate Impact
          </h3>
        </div>
        
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 btn-hover"
        >
          <ArrowUpDown className="w-4 h-4" />
          <span>{showComparison ? 'Hide' : 'Compare'} Rates</span>
        </button>
      </div>

      {showComparison && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 p-4 bg-bg-page rounded-lg"
        >
          <label className="block text-sm font-medium text-text-primary mb-3">
            Compare with rate: {formatPercentage(comparisonRate, 1)}
          </label>
          <input
            type="range"
            min={Math.max(2.0, inputs.interestRate - 2)}
            max={Math.min(15.0, inputs.interestRate + 2)}
            step={0.1}
            value={comparisonRate}
            onChange={(e) => setComparisonRate(Number(e.target.value))}
            className="w-full h-2 bg-border-subtle rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #0057B7 0%, #0057B7 ${((comparisonRate - (inputs.interestRate - 2)) / 4) * 100}%, #E2E8F0 ${((comparisonRate - (inputs.interestRate - 2)) / 4) * 100}%, #E2E8F0 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>{formatPercentage(inputs.interestRate - 2, 1)}</span>
            <span>{formatPercentage(inputs.interestRate, 1)}</span>
            <span>{formatPercentage(inputs.interestRate + 2, 1)}</span>
          </div>
        </motion.div>
      )}

      {/* Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={scenarios} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 12, fill: '#4A5568' }}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#4A5568' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickFormatter={(value) => formatCurrency(value, { compact: true })}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="price" 
              radius={[4, 4, 0, 0]}
              animationBegin={300}
              animationDuration={800}
            >
              {scenarios.map((entry, index) => (
                <motion.rect
                  key={`bar-${index}`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  fill={entry.color}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Impact Analysis */}
      {showComparison && comparisonData && impactMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className={`p-4 rounded-lg border ${
            impactMessage.type === 'warning' 
              ? 'bg-warning/10 border-warning/20' 
              : 'bg-primary-100 border-primary-500/20'
          }`}
        >
          <div className="flex items-start space-x-3">
            <TrendingUp className={`w-5 h-5 mt-0.5 ${
              impactMessage.type === 'warning' ? 'text-warning' : 'text-primary-500'
            }`} />
            <div>
              <h4 className="font-semibold text-text-primary mb-1">
                {impactMessage.title}
              </h4>
              <p className="text-sm text-text-secondary">
                {impactMessage.message}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-secondary">Current Rate</p>
                  <p className="font-semibold text-text-primary">
                    {formatCurrency(comparisonData.basePrice, { compact: true })}
                  </p>
                </div>
                <div>
                  <p className="text-text-secondary">Higher Rate</p>
                  <p className="font-semibold text-text-primary">
                    {formatCurrency(comparisonData.comparisonPrice, { compact: true })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {!showComparison && (
        <div className="text-center p-6 bg-bg-page rounded-lg">
          <p className="text-text-secondary">
            Click "Compare Rates" to see how different interest rates affect your buying power
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ComparisonChart;
