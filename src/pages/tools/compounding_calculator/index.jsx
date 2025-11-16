import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import Topbar from '../../../components/calculators_shared_files/topBar';
import CalculatorSection from './components/CalculatorSection';
import ResultsSection from './components/ResultsSection';
import { calculateAll } from './utils/calc';
import { useSearchParams } from 'react-router-dom';
import { ensureCompThemeCss } from './themeCssLoader';

const DEFAULTS = {
  initialInvestment: 0,
  ratePercent: 0,
  rateUnit: 'annual',
  compoundingFrequency: 'monthly',
  years: 0,
  months: 0,
  contribution: 0,
  contributionFrequency: 'monthly',
  timing: 'end',
};

const RESET_STATE = {
  initialInvestment: 0,
  ratePercent: 0,
  rateUnit: 'annual',
  compoundingFrequency: 'monthly',
  years: 0,
  months: 0,
  contribution: 0,
  contributionFrequency: 'monthly',
  timing: 'end',
};

export default function CompoundingCalculator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputs, setInputs] = useState(() => readParams(searchParams) || DEFAULTS);
  const [granularity, setGranularity] = useState('yearly');
  const [palette, setPalette] = useState('A');
  const PALETTES = {
    A: { primary: '#00C1B0', secondary1: '#93C5FD', secondary2: '#F59E0B' },
    B: { primary: '#10B981', secondary1: '#6366F1', secondary2: '#F59E0B' },
    C: { primary: '#3B82F6', secondary1: '#8B5CF6', secondary2: '#14B8A6' },
  };
  const scheduleRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(inputs).forEach(([k, v]) => params.set(k, String(v)));
    setSearchParams(params, { replace: true });
  }, [inputs, setSearchParams]);

  useEffect(() => {
    ensureCompThemeCss(theme.palette.mode);
  }, [theme.palette.mode]);

  const results = useMemo(() => {
    return calculateAll({ ...inputs, chartGranularity: granularity });
  }, [inputs, granularity]);

  const updateInput = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const reset = () => setInputs(RESET_STATE);
  // Build canonical URL dynamically to match deployed route
  const loc = typeof window !== 'undefined' && window.location ? window.location : null;
  const canonicalUrl = loc ? `${loc.origin}${loc.pathname}` : 'https://www.finworld.live/tools/compounding-calculator';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Compounding Calculator',
    url: canonicalUrl,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: 'Calculate compound interest with flexible frequencies and periodic contributions. Visualize growth and export schedules.'
  };

  return (
    <div className="compounding-calculator min-h-screen bg-bg-page text-neutral-900">
      <Helmet>
        <title>Compounding Calculator | FinWorld</title>
        <meta name="description" content="Free compounding calculator to project investment growth with compound interest, contributions, and flexible frequencies. Visualize results and export your schedule." />
        <meta name="keywords" content="compounding calculator, compound interest calculator, financial calculator, investment calculator, savings growth, future value, FinWorld" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Compounding Calculator | FinWorld" />
        <meta property="og:description" content="Project your investment growth with compound interest and contributions. Charts, tables, and exports included." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://www.finworld.live/assets/finworld-preview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Compounding Calculator | FinWorld" />
        <meta name="twitter:description" content="Free compounding calculator with charts and exportable schedules." />
        <meta name="twitter:image" content="https://www.finworld.live/assets/finworld-preview.png" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <Topbar />
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.section
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-h1 font-bold text-neutral-900 mb-4">
            Compounding Calculator
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Calculate compound interest and projected investment growth with flexible contribution and compounding schedules. This free financial calculator helps you estimate future value, interest earned, and total contributions over time.
          </p>
          <div className="mt-6 w-24 h-1 bg-primary-500 mx-auto rounded-full" />
        </motion.section>

        <motion.section
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CalculatorSection inputs={inputs} onChange={updateInput} onReset={reset} results={results} granularity={granularity} setGranularity={setGranularity} />
          <ResultsSection results={results} granularity={granularity} setGranularity={setGranularity} scheduleRef={scheduleRef} palette={PALETTES[palette]} />
        </motion.section>

        {/* SEO guide + long-form content */}
        <motion.section
          className="prose prose-slate max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center mb-6">
            <a
              href="/guides/how-to-use-compounding-calculator"
              className="text-blue-600 underline"
            >
              📘 View the Full Compounding Calculator Guide
            </a>
          </div>

          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Compounding Calculator Overview
          </h2>
          <p className="text-neutral-600">
            The FinWorld Compounding Calculator helps you understand how your savings
            or investments can grow over time when interest is compounded and when you
            add recurring contributions. By combining your starting balance, rate of
            return, contribution schedule, and time horizon, the tool estimates future
            value, total contributions, and interest earned so you can see the long‑term
            impact of today&apos;s decisions.
          </p>
          <p className="text-neutral-600">
            Instead of guessing what a percentage return really means in dollars, you
            can visualize growth on charts and export a schedule that shows how your
            balance evolves year by year or period by period. This makes it easier to
            set realistic goals for retirement, education savings, or other long‑term
            plans and to compare different contribution or rate assumptions side by
            side.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8 mb-3">
            How to Use This Compounding Calculator
          </h2>
          <p className="text-neutral-600">
            Start by entering your initial investment amount and the annual rate of
            return you want to model. Then choose how often interest is compounded
            (such as annually, monthly, or daily) and how long you plan to invest,
            using years and optional additional months. If you plan to make additional
            contributions, add the contribution amount and choose a contribution
            frequency and timing (beginning or end of each period).
          </p>
          <p className="text-neutral-600">
            As you adjust these inputs, the calculator updates your projected ending
            balance, total interest earned, and contribution totals. You can switch the
            chart granularity between yearly and finer views, and scroll through the
            schedule to see how the balance builds over time. Use the URL parameters to
            save or share specific scenarios with others on your team or with an
            advisor.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8 mb-3">
            Compounding Examples
          </h2>
          <p className="text-neutral-600">
            Imagine investing 5,000 today at a 7% annual return with no additional
            contributions. Over several decades, compounded returns can turn a modest
            starting balance into a significantly larger amount, even though you never
            add new money. The calculator highlights how much of the final value comes
            from your initial principal versus accumulated growth.
          </p>
          <p className="text-neutral-600">
            In another scenario, you might start with a smaller 1,000 balance but add
            200 each month. Even at a moderate rate of return, regular contributions
            can quickly outpace the impact of your starting amount. The schedule view
            makes it clear how steady investing can be more powerful than waiting for
            a perfect lump sum.
          </p>
          <p className="text-neutral-600">
            Finally, you can compare different contribution frequencies or timing. For
            example, switching from end‑of‑period contributions to beginning‑of‑period
            contributions means each deposit spends more time in the market, producing
            slightly higher ending balances over long horizons. The tool lets you
            quantify that difference instead of relying on rules of thumb.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8 mb-3">
            Common Compounding Mistakes
          </h2>
          <p className="text-neutral-600">
            A common mistake is assuming that past returns will repeat exactly in the
            future. The calculator uses a steady rate for clarity, but real markets are
            volatile. Treat the results as scenario planning rather than a guarantee,
            and consider modeling a range of conservative and optimistic rates instead
            of a single point estimate.
          </p>
          <p className="text-neutral-600">
            Another pitfall is ignoring inflation and taxes when interpreting the final
            number. A projected balance decades from now will not have the same
            purchasing power as today&apos;s dollars, and some forms of investment
            income are taxed differently than others. Use this tool alongside
            conversations with a financial professional to adjust expectations for your
            specific situation.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8 mb-3">
            Key Compounding Terms
          </h2>
          <p className="text-neutral-600">
            The <strong>nominal rate</strong> is the stated annual interest or return
            rate, while the <strong>effective annual rate</strong> accounts for how
            often compounding occurs in a year. More frequent compounding leads to a
            higher effective yield, even when the nominal rate is the same.
          </p>
          <p className="text-neutral-600">
            <strong>Compounding frequency</strong> describes how often interest is
            added to your balance (for example, monthly or quarterly), and{" "}
            <strong>contribution frequency</strong> describes how often you add new
            money. The <strong>timing</strong> setting determines whether those
            contributions happen at the beginning or end of each period, which slightly
            changes the growth path over time.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8 mb-3">
            Frequently Asked Questions
          </h2>
          <h3 className="text-lg font-semibold text-neutral-900">
            What is a compounding calculator?
          </h3>
          <p className="text-neutral-600">
            A compounding calculator estimates how your money can grow over time when
            interest is added to both your original balance and previously earned
            interest. You can also include regular contributions to see how ongoing
            saving changes the picture.
          </p>
          <h3 className="text-lg font-semibold text-neutral-900">
            How do contributions affect results?
          </h3>
          <p className="text-neutral-600">
            Contributions increase your balance at a chosen frequency, such as monthly
            or annually. Depending on timing, they are applied at the beginning or end
            of each period, which slightly changes the outcome and can significantly
            increase your ending balance over the long term.
          </p>
          <h3 className="text-lg font-semibold text-neutral-900">
            What is the difference between nominal and effective rate?
          </h3>
          <p className="text-neutral-600">
            The nominal rate is the headline annual rate a bank or investment provider
            quotes. The effective annual rate accounts for how often interest
            compounds, giving a more accurate measure of how quickly your money
            actually grows.
          </p>
          <h3 className="text-lg font-semibold text-neutral-900">
            Can I use this calculator for retirement planning?
          </h3>
          <p className="text-neutral-600">
            Yes. You can use the compounding calculator to model long‑term savings
            toward retirement or other major goals. For even more detail around income
            in retirement, pair it with the FinWorld Retirement Calculator.
          </p>
          <h3 className="text-lg font-semibold text-neutral-900">
            What rate of return should I enter?
          </h3>
          <p className="text-neutral-600">
            The right rate of return depends on your investment mix and risk profile.
            Many people model a range of conservative, moderate, and aggressive rates
            to understand different outcomes rather than relying on one precise
            assumption.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8 mb-3">
            Related Tools at FinWorld
          </h2>
          <p className="text-neutral-600">
            Once you understand how compounding affects your savings, you can use the{" "}
            <a href="/tools/retirement-calculator">Retirement Calculator</a> to turn
            those growth projections into potential retirement income estimates.
          </p>
          <p className="text-neutral-600">
            If you are balancing investing with debt payoff, the{" "}
            <a href="/tools/extra-payment">Loan Payoff &amp; Extra Payment Calculator</a>{" "}
            helps you see how redirecting cash flow toward debt might change your long‑term
            plans. You can also explore the{" "}
            <a href="/tools/mortgage-calculator">Mortgage Calculator</a> and{" "}
            <a href="/tools/home-affordability">Home Affordability Calculator</a> to
            understand how homeownership fits into your broader financial picture.
          </p>

          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is a compounding calculator?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'A compounding calculator estimates how money can grow over time when interest is added to both the original balance and previously earned interest, with optional recurring contributions.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How do contributions affect compounding results?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Contributions increase the balance at a chosen frequency such as monthly or annually. Because new deposits also begin earning returns, regular contributions can dramatically increase the final value.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What is the difference between nominal and effective rate?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The nominal rate is the stated annual rate, while the effective annual rate adjusts for how often interest compounds, providing a truer picture of growth over a year.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can this compounding calculator be used for retirement planning?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. The calculator can model long term savings toward retirement by combining an initial balance, ongoing contributions, a rate assumption, and a time horizon.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What rate of return should I enter in the calculator?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The appropriate rate depends on the investments and risk tolerance involved. Many users test a conservative, moderate, and aggressive rate to understand a range of possible outcomes.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Does the calculator include the effects of inflation or taxes?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The tool focuses on nominal growth and does not directly adjust for inflation or taxes. Those factors can be layered on separately based on personal circumstances and tax rules.',
                  },
                },
              ],
            })}
          </script>
        </motion.section>
      </main>
    </div>
  );
}

function readParams(sp) {
  if (!sp || sp.size === 0) return null;
  const val = (k, d, parse=Number) => sp.get(k) !== null ? (parse === Number ? Number(sp.get(k)) : sp.get(k)) : d;
  return {
    initialInvestment: val('initialInvestment', 0),
    ratePercent: val('ratePercent', 0),
    rateUnit: val('rateUnit', 'annual', String),
    compoundingFrequency: val('compoundingFrequency', 'monthly', String),
    years: val('years', 0),
    months: val('months', 0),
    contribution: val('contribution', 0),
    contributionFrequency: val('contributionFrequency', 'monthly', String),
    timing: val('timing', 'end', String),
  };
}




