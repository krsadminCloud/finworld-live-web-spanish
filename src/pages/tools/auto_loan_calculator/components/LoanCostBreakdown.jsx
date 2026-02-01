import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../utils/loanCalculations';
import { useTranslation } from 'react-i18next';

const LoanCostBreakdown = ({ chartData, standard, accelerated }) => {
  const { t } = useTranslation();
  if (!chartData.length || !standard || !accelerated) return null;

  const totalCost = accelerated.totalPayment;
  const principal = standard.principal;
  const interest = accelerated.totalInterest;

  const data = [
    {
      name: t("calculators.autoLoan.cost.principal"),
      value: principal,
      color: '#00C1B0'
    },
    {
      name: t("calculators.autoLoan.cost.interest"),
      value: interest,
      color: '#ADD8E6'
    }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-bg-surface p-3 rounded-lg shadow-lg border border-neutral-200">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-lg font-bold text-teal-500">
            {formatCurrency(data.value)}
          </p>
          <p className="text-xs text-neutral-400">
            {t("calculators.autoLoan.cost.percentOfTotal", { percent: ((data.value / totalCost) * 100).toFixed(1) })}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.1) return null; // Don't show labels for slices smaller than 10%

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      className="bg-bg-surface rounded-lg boxShadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold text-neutral-900 mb-4">{t("calculators.autoLoan.cost.title")}</h2>

      <div className="flex flex-col lg:flex-row items-center">
        {/* Chart */}
        <div className="w-full lg:w-1/2 h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={88}
                innerRadius={44}
                fill="#8884d8"
                dataKey="value"
                animationDuration={750}
                animationEasing="ease-in-out"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      boxShadow: '0 4px 12px rgba(0, 193, 176, 0.06)',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-sm text-neutral-400">{t("calculators.autoLoan.cost.totalCost")}</p>
              <p className="text-lg font-bold text-neutral-900">
                {formatCurrency(totalCost)}
              </p>
            </div>
          </div>
        </div>

        {/* Legend and Details */}
        <div className="w-full lg:w-1/2 lg:pl-8 mt-6 lg:mt-0">
          <div className="space-y-4">
            {data.map((item, index) => (
              <motion.div
                key={item.name}
                className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="font-medium text-neutral-900">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-neutral-900">
                    {formatCurrency(item.value)}
                  </div>
                  <div className="text-sm text-neutral-400">
                    {((item.value / totalCost) * 100).toFixed(1)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-6 p-4 bg-teal-100 rounded-lg border border-teal-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h4 className="font-semibold text-neutral-900 mb-2">{t("calculators.autoLoan.cost.withExtras")}</h4>
            <div className="text-sm text-neutral-600 space-y-1">
              <p>• {t("calculators.autoLoan.cost.originalInterest", { amount: formatCurrency(standard.totalInterest) })}</p>
              <p>• {t("calculators.autoLoan.cost.newInterest", { amount: formatCurrency(accelerated.totalInterest) })}</p>
              <p className="font-semibold text-semantic-success">
                • {t("calculators.autoLoan.cost.youSave", { amount: formatCurrency(accelerated.interestSaved) })}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoanCostBreakdown;
