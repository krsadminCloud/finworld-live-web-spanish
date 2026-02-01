import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import InputCard from "./components/InputCard";
import ResultsCard from "./components/ResultsCard";
import BreakdownChart from "./components/BreakdownChart";
import ComparisonChart from "./components/ComparisonChart";
import StickySummary from "./components/StickySummary";
import {
  calculateMaxAffordablePrice,
  calculatePITIBreakdown,
} from "./utils/calculations";
import Navbar from "../../../components/Navbar";
import { ensureHomeAffThemeCss } from "./themeCssLoader";
import { Trans } from "react-i18next";

function HomeAffordabilityCalculator() {
  const [inputs, setInputs] = useState({
    annualIncome: 100000,
    monthlyDebts: 500,
    downPayment: 60000,
    loanTerm: 30,
    interestRate: 7.0,
    propertyTaxRate: 1.2,
    insuranceAmount: 1200,
    hoaFees: 0,
    zipCode: "10001",
    mortgageToIncomeRatio: 28,
    debtToIncomeRatio: 36,
    maxHomePrice: 2000000,
  });

  const [affordablePrice, setAffordablePrice] = useState(0);
  const [pitiBreakdown, setPitiBreakdown] = useState(null);
  const theme = useTheme();
  const { t } = useTranslation();

  // Load saved inputs from localStorage
  useEffect(() => {
    const savedInputs = localStorage.getItem("homeCalculatorInputs");
    if (savedInputs) {
      setInputs(JSON.parse(savedInputs));
    }
  }, []);

  // Save inputs to localStorage
  useEffect(() => {
    localStorage.setItem("homeCalculatorInputs", JSON.stringify(inputs));
  }, [inputs]);

  // Calculate affordability whenever inputs change
  useEffect(() => {
    const maxPrice = calculateMaxAffordablePrice(inputs);
    setAffordablePrice(maxPrice);

    const breakdown = calculatePITIBreakdown(maxPrice, inputs);
    setPitiBreakdown(breakdown);
  }, [inputs]);

  useEffect(() => {
    ensureHomeAffThemeCss(theme.palette.mode);
  }, [theme.palette.mode]);

  const loc =
    typeof window !== "undefined" && window.location ? window.location : null;
  const canonical =
    loc?.origin && loc?.pathname
      ? `${loc.origin}${loc.pathname}`
      : "https://www.finworld.live/tools/home-affordability";

  const faqSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t('tool_home_affordability.faq.q1'),
        acceptedAnswer: {
          "@type": "Answer",
          text: t('tool_home_affordability.faq.a1'),
        },
      },
      {
        "@type": "Question",
        name: t('tool_home_affordability.faq.q2'),
        acceptedAnswer: {
          "@type": "Answer",
          text: t('tool_home_affordability.faq.a2'),
        },
      },
      {
        "@type": "Question",
        name: t('tool_home_affordability.faq.q3'),
        acceptedAnswer: {
          "@type": "Answer",
          text: t('tool_home_affordability.faq.a3'),
        },
      },
      {
        "@type": "Question",
        name: t('tool_home_affordability.faq.q4'),
        acceptedAnswer: {
          "@type": "Answer",
          text: t('tool_home_affordability.faq.a4'),
        },
      },
      {
        "@type": "Question",
        name: t('tool_home_affordability.faq.q5'),
        acceptedAnswer: {
          "@type": "Answer",
          text: t('tool_home_affordability.faq.a5'),
        },
      },
      {
        "@type": "Question",
        name: t('tool_home_affordability.faq.q6'),
        acceptedAnswer: {
          "@type": "Answer",
          text: t('tool_home_affordability.faq.a6'),
        },
      },
    ],
  }), [t]);

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "FinWorld Home Affordability Calculator",
    operatingSystem: "All",
    applicationCategory: "FinanceApplication",
    browserRequirements: "Requires JavaScript",
    url: canonical,
    description: t('tool_home_affordability.meta.desc'),
  };

  return (
    <div className="home-affordability calculator-container min-h-screen bg-bg-page transition-colors duration-300">
      <Helmet>
        <title>{t('tool_home_affordability.meta.title')}</title>
        <meta
          name="description"
          content={t('tool_home_affordability.meta.desc')}
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={t('tool_home_affordability.meta.title')}
        />
        <meta
          property="og:description"
          content={t('tool_home_affordability.meta.desc')}
        />
        <meta property="og:url" content={canonical} />
        <meta
          property="og:image"
          content="https://www.finworld.live/assets/finworld-preview.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={t('tool_home_affordability.meta.title')}
        />
        <meta
          name="twitter:description"
          content={t('tool_home_affordability.meta.desc')}
        />
        <meta
          name="twitter:image"
          content="https://www.finworld.live/assets/finworld-preview.png"
        />
        <script type="application/ld+json">
          {JSON.stringify(appSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      <Navbar />
      <motion.section
        className="text-center mb-12 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-h1 font-bold text-neutral-900">
              {t('tool_home_affordability.hero.title')}
            </h1>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
              {t('tool_home_affordability.hero.subtitle')}
            </p>
          </div>
        </div>
        <div className="mt-4 w-24 h-1 bg-primary-500 mx-auto rounded-full" />
      </motion.section>

      {/* Sticky Summary */}
      <StickySummary affordablePrice={affordablePrice} pitiBreakdown={pitiBreakdown} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <InputCard inputs={inputs} setInputs={setInputs} />
          </motion.div>

          {/* Right Column - Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <ResultsCard 
              affordablePrice={affordablePrice} 
              pitiBreakdown={pitiBreakdown} 
              inputs={inputs}
            />
            
            {pitiBreakdown && (
              <>
                <BreakdownChart pitiBreakdown={pitiBreakdown} />
                <ComparisonChart inputs={inputs} affordablePrice={affordablePrice} />
              </>
            )}

            <section className="mt-8 space-y-4">
              <div className="text-center">
                <a
                  href="/guides/how-to-use-home-affordability-calculator"
                  className="text-blue-600 underline"
                >
                  📘 View the Full Home Affordability Guide
                </a>
              </div>

              <div className="space-y-3 text-sm text-neutral-600 mt-6">
                <h2 className="text-xl font-semibold text-neutral-900">
                  {t('tool_home_affordability.sections.overview_title')}
                </h2>
                <p>
                  {t('tool_home_affordability.sections.overview_p1')}
                </p>
                <p>
                  {t('tool_home_affordability.sections.overview_p2')}
                </p>

                <h2 className="text-xl font-semibold text-neutral-900 mt-4">
                  {t('tool_home_affordability.sections.how_to_title')}
                </h2>
                <p>
                  {t('tool_home_affordability.sections.how_to_p1')}
                </p>
                <p>
                  {t('tool_home_affordability.sections.how_to_p2')}
                </p>

                <h2 className="text-xl font-semibold text-neutral-900 mt-4">
                  {t('tool_home_affordability.sections.examples_title')}
                </h2>
                <p>
                  {t('tool_home_affordability.sections.examples_p1')}
                </p>
                <p>
                  {t('tool_home_affordability.sections.examples_p2')}
                </p>
                <p>
                  {t('tool_home_affordability.sections.examples_p3')}
                </p>

                <h2 className="text-xl font-semibold text-neutral-900 mt-4">
                  {t('tool_home_affordability.sections.mistakes_title')}
                </h2>
                <p>
                  {t('tool_home_affordability.sections.mistakes_p1')}
                </p>
                <p>
                  {t('tool_home_affordability.sections.mistakes_p2')}
                </p>

                <h2 className="text-xl font-semibold text-neutral-900 mt-4">
                  {t('tool_home_affordability.sections.terms_title')}
                </h2>
                <p>
                  <Trans i18nKey="tool_home_affordability.sections.terms_p1" />
                </p>
                <p>
                  <Trans i18nKey="tool_home_affordability.sections.terms_p2" />
                </p>

                <h2 className="text-xl font-semibold text-neutral-900 mt-4">
                  {t('tool_home_affordability.sections.faq_title')}
                </h2>
                <p>
                  <strong>{t('tool_home_affordability.faq.q1')}</strong>
                </p>
                <p>
                  {t('tool_home_affordability.faq.a1')}
                </p>
                <p>
                  <strong>{t('tool_home_affordability.faq.q2')}</strong>
                </p>
                <p>
                  {t('tool_home_affordability.faq.a2')}
                </p>
                <p>
                  <strong>{t('tool_home_affordability.faq.q3')}</strong>
                </p>
                <p>
                  {t('tool_home_affordability.faq.a3')}
                </p>
                <p>
                  <strong>{t('tool_home_affordability.faq.q6')}</strong>
                </p>
                <p>
                  {t('tool_home_affordability.faq.a6')}
                </p>

                <h2 className="text-xl font-semibold text-neutral-900 mt-4">
                  {t('tool_home_affordability.sections.related_title')}
                </h2>
                <p>
                  <Trans i18nKey="tool_home_affordability.sections.related_p1">
                    Planning a home purchase? Try the <a href="/tools/mortgage-calculator" className="underline">Mortgage Calculator</a> to model specific loan amounts, rates, and amortization schedules once you have a target price range.
                  </Trans>
                </p>
                <p>
                  <Trans i18nKey="tool_home_affordability.sections.related_p2">
                    If you're thinking about paying off debt faster, the <a href="/tools/extra-payment" className="underline">Loan Payoff &amp; Extra Payment Calculator</a> can show how redirecting cash flow might free up room in your housing budget over time.
                  </Trans>
                </p>
                <p>
                  <Trans i18nKey="tool_home_affordability.sections.related_p3">
                    For investors, the <a href="/tools/rental-property-calculator" className="underline">Rental Property Calculator</a> helps evaluate potential income properties, while the <a href="/tools/compounding-calculator" className="underline">Compounding Calculator</a> illustrates how long-term savings and investments complement your home purchase decisions.
                  </Trans>
                </p>
              </div>
            </section>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border-subtle mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-text-secondary">
            <p className="text-sm">
              {t('footer.disclaimer_main')}
            </p>
            <p className="text-xs mt-2">
              {t('footer.disclaimer_sub')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomeAffordabilityCalculator;
