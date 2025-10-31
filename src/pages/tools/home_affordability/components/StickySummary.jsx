import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TrendingUp, Home } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

const StickySummary = ({ affordablePrice, pitiBreakdown }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  
  // Transform scroll position to opacity
  const opacity = useTransform(scrollY, [200, 300], [0, 1]);
  const translateY = useTransform(scrollY, [200, 300], [-20, 0]);

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsVisible(latest > 200);
    });
    return () => unsubscribe();
  }, [scrollY]);

  if (!pitiBreakdown) return null;

  return (
    <motion.div
      style={{ opacity, y: translateY }}
      className="fixed top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-b border-border-subtle shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Home className="w-6 h-6 text-primary-500" />
            <div>
              <p className="text-sm text-text-secondary">You can afford up to</p>
              <motion.p 
                key={affordablePrice}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-2xl font-heading font-bold text-text-primary"
              >
                {formatCurrency(affordablePrice, { compact: true })}
              </motion.p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center space-x-6 text-sm">
            <div className="text-center">
              <p className="text-text-secondary">Monthly Payment</p>
              <p className="font-semibold text-text-primary">
                {formatCurrency(pitiBreakdown.totalMonthlyPayment)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-text-secondary">Loan Amount</p>
              <p className="font-semibold text-text-primary">
                {formatCurrency(pitiBreakdown.loanAmount, { compact: true })}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-success">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Excellent DTI</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StickySummary;
