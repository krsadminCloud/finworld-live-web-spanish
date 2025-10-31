import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

const BreakdownChart = ({ pitiBreakdown }) => {
  if (!pitiBreakdown) return null;

  const chartData = [
    {
      name: 'Principal & Interest',
      value: pitiBreakdown.principalAndInterest,
      color: '#0057B7',
      description: 'Your loan payment'
    },
    {
      name: 'Property Tax',
      value: pitiBreakdown.propertyTax,
      color: '#3B82F6',
      description: 'Monthly property taxes'
    },
    {
      name: 'Insurance',
      value: pitiBreakdown.insurance,
      color: '#10B981',
      description: 'Homeowners insurance'
    },
    {
      name: 'HOA Fees',
      value: pitiBreakdown.hoa,
      color: '#8B5CF6',
      description: 'Homeowners association'
    }
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface p-3 rounded-lg shadow-lg border border-border-subtle">
          <p className="font-semibold text-text-primary">{data.name}</p>
          <p className="text-text-secondary text-sm">{data.description}</p>
          <p className="text-primary-500 font-bold mt-1">
            {formatCurrency(data.value)}
          </p>
          <p className="text-text-secondary text-sm">
            {((data.value / pitiBreakdown.totalMonthlyPayment) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm text-text-secondary">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-surface rounded-xl p-6 shadow-card card-hover"
    >
      <div className="flex items-center space-x-3 mb-6">
        <PieChartIcon className="w-6 h-6 text-primary-500" />
        <h3 className="text-xl font-heading font-semibold text-text-primary">
          Payment Breakdown
        </h3>
      </div>

      <div className="flex flex-col lg:flex-row items-center">
        {/* Chart */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationBegin={300}
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Details */}
        <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
          {/* Total in center */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="inline-block p-4 bg-primary-500 rounded-full text-white"
            >
              <div className="text-center">
                <p className="text-sm opacity-90">Total Monthly</p>
                <p className="text-xl font-bold">
                  {formatCurrency(pitiBreakdown.totalMonthlyPayment)}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Breakdown items */}
          <div className="space-y-3">
            {chartData.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-bg-page rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div>
                    <p className="font-medium text-text-primary">{item.name}</p>
                    <p className="text-sm text-text-secondary">{item.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-text-primary">
                    {formatCurrency(item.value)}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {((item.value / pitiBreakdown.totalMonthlyPayment) * 100).toFixed(0)}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BreakdownChart;
