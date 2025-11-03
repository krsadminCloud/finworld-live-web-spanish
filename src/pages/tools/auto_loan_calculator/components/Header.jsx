import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header 
      className="bg-bg-surface shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-neutral-100 rounded-sm"></div>
            </div>
            <h1 className="text-xl font-semibold text-neutral-900">
              FinWorld Auto Loan Calculator
            </h1>
          </div>
          
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-sm text-neutral-400">
              Professional Financial Tools
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;