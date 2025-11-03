import React from 'react';
import { motion } from 'framer-motion';
import { Building2, CreditCard, Car, TrendingDown } from 'lucide-react';

const LenderOffers = () => {
  const lenders = [
    {
      name: 'Credit Union Plus',
      description: 'Member-owned, better rates',
      icon: CreditCard,
      apr: '5.25%',
      rate: 5.25,
      features: ['Lower rates', 'Personal service', 'Local branches'],
      action: 'Apply Now'
    },
    {
      name: 'Quick Auto Finance',
      description: 'Bad credit? No problem. Let us help',
      icon: Car,
      apr: '6.75%',
      rate: 6.75,
      features: ['All credit types', 'Same-day funding', 'No down payment'],
      action: 'Apply Now'
    },
    {
      name: 'Auto Insurance',
      description: 'Protect your investment with comprehensive coverage.',
      icon: Building2,
      apr: 'Get a Quote',
      rate: 0,
      features: ['Comprehensive coverage', 'Liability protection', 'Collision coverage'],
      action: 'Get Quotes'
    },
    {
      name: 'Refinance Your Loan',
      description: 'Lower Bill payments with a new loan at a better rate.',
      icon: TrendingDown,
      apr: 'Custom', // Placeholder, as it's not a direct APR
      rate: 0,
      features: ['Lower payments', 'Better rates', 'Flexible terms'],
      action: 'Explore Options'
    }
  ];

  return (
    <motion.section
      className="mb-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">
          Find Better Auto Loan Rates
        </h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Compare rates from top lenders and potentially save thousands on your auto loan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Lender Cards */}
        {lenders.map((lender, index) => (
          <motion.div
            key={lender.name}
            className="bg-bg-surface rounded-lg boxShadow-sm p-6 card-hover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <lender.icon className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-neutral-900">
                    {lender.name}
                  </h3>
                  <p className="text-sm text-neutral-500">
                    {lender.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-neutral-900 mb-1">
                {lender.apr === 'Get a Quote' || lender.apr === 'Custom' ? (
                  lender.apr
                ) : (
                  `${lender.apr}`
                )}
              </div>
              <div className="text-xs text-neutral-400 uppercase tracking-wide">
                {lender.apr === 'Get a Quote' || lender.apr === 'Custom' ? '' : 'APR'}
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {lender.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                  <span className="text-neutral-600">{feature}</span>
                </div>
              ))}
            </div>

            <motion.button
              className="w-full bg-teal-500 text-white px-4 py-2 rounded-md font-medium hover:bg-teal-600 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {lender.action}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* FinWorld CTA */}
      <motion.div
        className="mt-12 text-center p-8 bg-teal-500 rounded-lg text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <h3 className="text-2xl font-bold mb-2">Ready to Save Money on Your Auto Loan?</h3>
        <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
          Join thousands of satisfied customers who have saved money with FinWorld's
          competitive rates and excellent service.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-500 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
          </motion.button>
          <motion.button
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-500 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default LenderOffers;
