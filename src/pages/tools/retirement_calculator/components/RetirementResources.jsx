import React from 'react';
import { motion } from 'framer-motion';
import { PiggyBank, Wallet, Shield, TrendingUp } from 'lucide-react';

const CARDS = [
  { name: '401(k) Plans', desc: 'Pre-tax savings with employer match.', Icon: PiggyBank, cta: 'Learn More' },
  { name: 'IRAs & Roth IRAs', desc: 'Tax-deferred or tax-free growth options.', Icon: Wallet, cta: 'Compare' },
  { name: 'Income Annuities', desc: 'Turn savings into predictable income.', Icon: Shield, cta: 'Explore' },
  { name: 'Growth Strategies', desc: 'Allocation ideas by time horizon.', Icon: TrendingUp, cta: 'View Ideas' },
];

export default function RetirementResources() {
  return (
    <motion.section
      className="mb-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">Explore Retirement Options</h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Compare account types and strategies that can help you grow savings and optimize income in retirement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.name}
            className="bg-bg-surface rounded-lg shadow-md p-6 card-hover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-primary-100 rounded-lg"><card.Icon className="w-6 h-6 text-primary-500" /></div>
              <div>
                <h3 className="font-semibold text-lg">{card.name}</h3>
                <p className="text-sm text-neutral-500">{card.desc}</p>
              </div>
            </div>
            <motion.button
              className="w-full bg-primary-500 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {card.cta}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
