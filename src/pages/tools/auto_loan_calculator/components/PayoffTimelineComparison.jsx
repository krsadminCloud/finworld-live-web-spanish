import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, Clock } from 'lucide-react';
import { calculatePayoffDate, formatDate, formatCurrency } from '../utils/loanCalculations';

const PayoffTimelineComparison = ({ chartData, startDate, standard, accelerated }) => {
  if (!chartData.length || !standard || !accelerated) return null;

  const standardPayoffDate = calculatePayoffDate(startDate, standard.termMonths);
  const acceleratedPayoffDate = calculatePayoffDate(startDate, accelerated.actualMonths);

  const data = [
    {
      name: 'Standard',
      months: standard.termMonths,
      color: '#697586',
      payoffDate: standardPayoffDate,
      totalCost: standard.totalPayment
    },
    {
      name: 'Accelerated',
      months: accelerated.actualMonths,
      color: '#00C1B0',
      payoffDate: acceleratedPayoffDate,
      totalCost: accelerated.totalPayment
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-bg-surface p-4 rounded-lg boxShadow-lg border border-neutral-200">
          <h4 className="font-semibold text-neutral-900 mb-2">{data.name}</h4>
          <div className="space-y-1 text-sm">
            <p><span className="text-neutral-400">Duration:</span> <span className="font-medium">{data.months} months</span></p>
            <p><span className="text-neutral-400">Payoff Date:</span> <span className="font-medium">{formatDate(data.payoffDate)}</span></p>
            <p><span className="text-neutral-400">Total Cost:</span> <span className="font-medium text-teal-500">{formatCurrency(data.totalCost)}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="bg-bg-surface rounded-lg boxShadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-neutral-900 mb-4">Payoff Timeline Comparison</h2>

      {/* Chart */}
      <div className="h-64 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#697586' }}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#697586' }}
              axisLine={{ stroke: '#E2E8F0' }}
              label={{ value: 'Months', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#697586' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="months"
              fill="#00C1B0"
              radius={[8, 8, 0, 0]}
              animationDuration={750}
              animationEasing="ease-in-out"
            >
              {data.map((entry, index) => (
                <Bar key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Timeline Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((item, index) => (
          <motion.div
            key={item.name}
            className={`p-4 rounded-lg border-2 ${
              item.name === 'Accelerated'
                ? 'border-teal-500 bg-teal-100'
                : 'border-neutral-200 bg-neutral-50'
            }`}
            initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
              <h3 className="font-semibold text-neutral-900">{item.name}</h3>
              {item.name === 'Accelerated' && (
                <span className="text-xs bg-teal-500 text-white px-2 py-1 rounded-full">
                  Recommended
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span className="text-neutral-400">Duration:</span>
                <span className="font-medium">{item.months} months ({(item.months / 12).toFixed(1)} years)</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span className="text-neutral-400">Payoff Date:</span>
                <span className="font-medium">{formatDate(item.payoffDate)}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-neutral-400">Total Cost:</span>
                <span className="font-bold text-teal-500">{formatCurrency(item.totalCost)}</span>
              </div>
            </div>

            {item.name === 'Accelerated' && (
              <div className="mt-3 pt-3 border-t border-teal-500/20">
                <p className="text-sm text-semantic-success font-medium">
                  💡 You save {accelerated.paymentsSaved} months and {formatCurrency(accelerated.interestSaved)}!
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PayoffTimelineComparison;
