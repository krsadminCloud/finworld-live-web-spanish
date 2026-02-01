import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Clock } from 'lucide-react';
import { formatCurrency, calculatePayoffDate, formatDate } from '../utils/loanCalculations';
import { useTranslation } from 'react-i18next';

const PayoffSummaryCard = ({ standard, accelerated, loanInputs }) => {
  const { t } = useTranslation();
  const standardPayoffDate = calculatePayoffDate(loanInputs.startDate, standard.termMonths);
  const acceleratedPayoffDate = calculatePayoffDate(loanInputs.startDate, accelerated.actualMonths);
  
  const metrics = [
    {
      icon: Calendar,
      label: t("calculators.autoLoan.summary.newPayoffDate"),
      value: formatDate(acceleratedPayoffDate),
      change: t("calculators.autoLoan.summary.monthsSooner", { months: accelerated.paymentsSaved }),
      color: 'text-semantic-success'
    },
    {
      icon: DollarSign,
      label: t("calculators.autoLoan.summary.interestSaved"),
      value: formatCurrency(accelerated.interestSaved),
      change: t("calculators.autoLoan.summary.lessInterest", {
        percent: ((accelerated.interestSaved / standard.totalInterest) * 100).toFixed(1),
      }),
      color: 'text-semantic-success'
    },
    {
      icon: Clock,
      label: t("calculators.autoLoan.summary.loanShortened"),
      value: t("calculators.autoLoan.summary.months", { months: accelerated.paymentsSaved }),
      change: t("calculators.autoLoan.summary.years", { years: (accelerated.paymentsSaved / 12).toFixed(1) }),
      color: 'text-semantic-success'
    }
  ];

  return (
<motion.div
  className="bg-bg-surface rounded-lg boxShadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-neutral-900 mb-4">{t("calculators.autoLoan.summary.title")}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="text-center p-4 bg-neutral-50 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-center mb-3">
              <metric.icon className="w-8 h-8 text-teal-500" />
            </div>
            <p className="text-sm text-semantic-success mb-1">{metric.label}</p>
            <div className={`text-sm font-bold ${metric.color} mb-1`}>
              {metric.value}
            </div>
            <p className="text-xs text-semantic-success">{metric.change}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Summary Highlight */}
      <motion.div
        className="mt-6 p-4 bg-primary-100 rounded-lg border border-primary-500/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="font-semibold text-neutral-900 mb-2">
          {t("calculators.autoLoan.summary.savingInterest", { amount: formatCurrency(accelerated.interestSaved) })}
        </h3>
        <p className="text-sm text-neutral-600">
          {t("calculators.autoLoan.summary.savingDetails", {
            extra: formatCurrency(accelerated.actualMonths > 0 ? accelerated.totalInterest : 0),
            months: accelerated.paymentsSaved,
          })}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PayoffSummaryCard;
