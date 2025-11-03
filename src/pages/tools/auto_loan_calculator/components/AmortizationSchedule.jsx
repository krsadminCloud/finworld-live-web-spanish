import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Table, Download } from 'lucide-react';
import { formatCurrency } from '../utils/loanCalculations';

const AmortizationSchedule = ({ schedule, isOpen, onToggle }) => {
  if (!schedule || schedule.length === 0) return null;

  const exportToCSV = () => {
    const headers = ['Payment #', 'Date', 'Regular Payment', 'Extra Payment', 'Total Payment', 'Principal', 'Interest', 'Balance'];
    const csvContent = [
      headers.join(','),
      ...schedule.map((payment, index) => [
        payment.month,
        new Date(2024, 0, 1 + (index * 30)).toLocaleDateString(),
        payment.payment.toFixed(2),
        payment.extraPayment.toFixed(2),
        payment.totalPayment.toFixed(2),
        payment.principal.toFixed(2),
        payment.interest.toFixed(2),
        payment.balance.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amortization_schedule.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      className="bg-bg-surface rounded-lg boxShadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {/* Accordion Header */}
      <motion.button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors duration-200"
        whileHover={{ backgroundColor: '#F8F9FB' }}
      >
        <h2 className="text-h2 text-neutral-900 flex items-center gap-2">
          <Table className="w-6 h-6 text-primary-500" />
          Accelerated Amortization Schedule
        </h2>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-400">
            {isOpen ? 'Hide Details' : 'Show Details'}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          </motion.div>
        </div>
      </motion.button>

      {/* Accordion Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              {/* Export Button */}
              <div className="flex justify-end mb-4">
                <motion.button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-primary-500 text-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </motion.button>
              </div>

              {/* Schedule Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-2 font-semibold text-neutral-900">Payment #</th>
                      <th className="text-right py-3 px-2 font-semibold text-neutral-900">Date</th>
                      <th className="text-right py-3 px-2 font-semibold text-neutral-900">Regular Payment</th>
                      <th className="text-right py-3 px-2 font-semibold text-neutral-900">Extra Payment</th>
                      <th className="text-right py-3 px-2 font-semibold text-neutral-900">Total Payment</th>
                      <th className="text-right py-3 px-2 font-semibold text-neutral-900">Principal</th>
                      <th className="text-right py-3 px-2 font-semibold text-neutral-900">Interest</th>
                      <th className="text-right py-3 px-2 font-semibold text-neutral-900">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="table-striped">
                    {schedule.slice(0, 12).map((payment, index) => (
                      <motion.tr
                        key={payment.month}
                        className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors duration-150"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                      >
                        <td className="py-3 px-2 font-medium text-neutral-900">
                          {payment.month}
                        </td>
                        <td className="py-3 px-2 text-right text-neutral-600">
                          {new Date(2024, 0, 1 + (index * 30)).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2 text-right font-medium">
                          {formatCurrency(payment.payment)}
                        </td>
                        <td className="py-3 px-2 text-right">
                          {payment.extraPayment > 0 ? (
                            <span className="text-semantic-success font-medium">
                              {formatCurrency(payment.extraPayment)}
                            </span>
                          ) : (
                            <span className="text-neutral-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-right font-semibold text-primary-500">
                          {formatCurrency(payment.totalPayment)}
                        </td>
                        <td className="py-3 px-2 text-right text-semantic-success">
                          {formatCurrency(payment.principal)}
                        </td>
                        <td className="py-3 px-2 text-right text-semantic-warning">
                          {formatCurrency(payment.interest)}
                        </td>
                        <td className="py-3 px-2 text-right font-medium text-neutral-900">
                          {formatCurrency(payment.balance)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {schedule.length > 12 && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-neutral-400">
                    Showing first 12 months of {schedule.length} total payments
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Export the complete schedule to see all payments
                  </p>
                </div>
              )}

              {/* Summary */}
              <motion.div
                className="mt-6 p-4 bg-primary-100 rounded-lg border border-primary-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h4 className="font-semibold text-neutral-900 mb-2">Payment Summary</h4>
                <div className="text-sm text-neutral-600 space-y-1">
                  <p>• Total payments: {schedule.length}</p>
                  <p>• Regular payment: {formatCurrency(schedule[0]?.payment || 0)}</p>
                  <p>• Total extra payments: {formatCurrency(schedule.reduce((sum, p) => sum + p.extraPayment, 0))}</p>
                  <p>• Final payment date: {new Date(2024, 0, 1 + (schedule.length * 30)).toLocaleDateString()}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AmortizationSchedule;
