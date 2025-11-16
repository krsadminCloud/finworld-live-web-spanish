import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";
import InputCard from "./components/InputCard";
import ResultsCard from "./components/ResultsCard";
import BreakdownChart from "./components/BreakdownChart";
import ComparisonChart from "./components/ComparisonChart";
import StickySummary from "./components/StickySummary";
import {
  calculateMaxAffordablePrice,
  calculatePITIBreakdown,
} from "./utils/calculations";
import TopBar from "../../../components/calculators_shared_files/topBar";
import { ensureHomeAffThemeCss } from "./themeCssLoader";

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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much house can I afford?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "This calculator looks at your income, debts, down payment, and underwriting ratios to estimate a comfortable maximum home price. You can tune assumptions to match your lender.",
        },
      },
      {
        "@type": "Question",
        name: "What debt-to-income ratios does this tool use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "By default, the calculator uses common front-end and back-end DTI ratios, such as 28% for housing and 36% for total debt. You can adjust both to see how tighter or looser guidelines change what you can afford.",
        },
      },
      {
        "@type": "Question",
        name: "Does this include taxes, insurance, and HOA fees?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Property taxes, homeowners insurance, and HOA dues are included in the PITI breakdown so your estimated payment aligns more closely with a real mortgage quote.",
        },
      },
      {
        "@type": "Question",
        name: "How does my down payment affect affordability?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A larger down payment reduces the loan amount, which can lower your monthly payment and may remove PMI requirements. This calculator lets you experiment with different down payment amounts to see how they change the maximum home price you can afford.",
        },
      },
      {
        "@type": "Question",
        name: "Can this tool help me stay within safe DTI ranges?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. By combining your income and monthly debts with lender-style DTI targets, the calculator estimates a home price that fits within common underwriting guidelines so you can avoid overextending your budget.",
        },
      },
      {
        "@type": "Question",
        name: "What if property taxes or insurance are higher in my area?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Property tax and insurance costs vary widely by location. You can adjust both values to more closely match local quotes, and the calculator will show how those changes affect your affordable price and total monthly payment.",
        },
      },
    ],
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "FinWorld Home Affordability Calculator",
    operatingSystem: "All",
    applicationCategory: "FinanceApplication",
    browserRequirements: "Requires JavaScript",
    url: canonical,
    description:
      "Interactive home affordability calculator that estimates a realistic price range and monthly payment using income, debts, down payment, and lender-style underwriting ratios.",
  };

  return (
    <div className="home-affordability calculator-container min-h-screen bg-bg-page transition-colors duration-300">
      <Helmet>
        <title>Home Affordability Calculator | FinWorld</title>
        <meta
          name="description"
          content="Estimate how much house you can afford based on your income, debts, down payment, and mortgage assumptions. See a full PITI breakdown and compare scenarios."
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Home Affordability Calculator | FinWorld"
        />
        <meta
          property="og:description"
          content="Use our home affordability calculator to estimate a realistic price range and monthly payment, including taxes, insurance, and HOA fees."
        />
        <meta property="og:url" content={canonical} />
        <meta
          property="og:image"
          content="https://www.finworld.live/assets/finworld-preview.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Home Affordability Calculator | FinWorld"
        />
        <meta
          name="twitter:description"
          content="Find out how much house you can afford with a detailed PITI breakdown and underwriting-style ratios."
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
      <TopBar />
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
              Home Affordability Calculator
            </h1>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
              Calculate how much home you can comfortably afford based on your income, debts, and down payment—then see how lenders might view the same numbers.
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
                  Home Affordability Calculator Overview
                </h2>
                <p>
                  The FinWorld Home Affordability Calculator is designed to help you
                  answer one of the most important questions in the homebuying
                  process: &ldquo;How much house can I really afford?&rdquo; By
                  combining your income, existing monthly debts, down payment, and
                  key mortgage assumptions, the tool estimates a purchase price that
                  fits within common lender guidelines while still giving you a
                  realistic picture of your monthly payment.
                </p>
                <p>
                  Instead of focusing only on the sticker price of a home, this
                  calculator breaks your payment down into principal and interest,
                  property taxes, homeowners insurance, and HOA fees. Seeing all of
                  these components together can make it easier to balance your
                  housing goals with other priorities like saving for retirement,
                  paying down debt, or building an emergency fund.
                </p>

                <h2 className="text-xl font-semibold text-neutral-900 mt-4">
                  How to Use This Home Affordability Calculator
                </h2>
                <p>
                  Start by entering your annual household income and your total
                  monthly debt payments, such as auto loans, student loans, and
                  credit cards. Then choose a target down payment amount and adjust
                  the interest rate, loan term, property tax rate, and insurance
                  estimate to match what you are seeing from lenders and local
                  listings.
                </p>
                <p>
                  As you update these inputs, the calculator recomputes your
                  estimated maximum home price and monthly payment, along with a
                  PITI breakdown. You can fine-tune the front-end and back-end DTI
                  ratios to reflect more conservative or more flexible underwriting
                  standards, then use the comparison chart to test different price
                  points or interest rate scenarios before you start touring homes.
                </p>

                <h2 className="text-xl font-semibold text-neutral-900 mt-4">
                  Home Affordability Examples
                </h2>
                <p>
                  Consider a household earning $120,000 per year with $500 in
                  monthly non-housing debt. Using a 28% front-end DTI and 36%
                  back-end DTI, the calculator might show that a payment around a
                  certain range is considered comfortable, translating into a target
                  price band for homes in your area depending on rates and taxes.
                </p>
                <p>
                  In a higher-cost metro with elevated property taxes and HOA fees,
                  the same income and debt profile may support a lower maximum home
                  price. By adjusting the tax and insurance assumptions upward,
                  you&apos;ll see how these location-driven costs compress
                  affordability and why two similarly priced homes can produce very
                  different monthly payments.
                </p>
                <p>
                  Finally, imagine a scenario where your income is stable but you
                  carry significant student loan or auto debt. The calculator will
                  show how higher monthly obligations eat into your debt-to-income
                  capacity, and how paying down certain loans first could expand the
                  price range you can comfortably afford in the future.
                </p>

                <h2 className="text-xl font-semibold text-neutral-900 mt-4">
                  Common Home Affordability Mistakes
                </h2>
                <p>
                  A frequent mistake is anchoring on the maximum amount a lender is
                  willing to approve rather than what fits your day-to-day budget.
                  Just because a loan is technically approved does not mean it will
                  feel comfortable once you layer in childcare, transportation, and
                  other living expenses. This calculator is meant to help you pick a
                  target below your absolute maximum if that aligns better with your
                  financial goals.
                </p>
                <p>
                  Another pitfall is underestimating variable costs like property
                  taxes, insurance, and HOA dues, or assuming they will stay flat
                  over time. These line items can rise, sometimes faster than
                  income. Building in a buffer by using slightly higher estimates
                  can keep your plan resilient if rates or local tax assessments
                  change.
                </p>

                <h2 className="text-xl font-semibold text-neutral-900 mt-4">
                  Understanding Key Terms
                </h2>
                <p>
                  Your <strong>front-end DTI</strong> (debt-to-income ratio) looks
                  at housing costs as a percentage of your gross income, while your{" "}
                  <strong>back-end DTI</strong> includes housing plus other debts.
                  Many lenders use thresholds such as 28% and 36%, but actual
                  guidelines vary by program and credit profile.
                </p>
                <p>
                  <strong>PITI</strong> stands for principal, interest, taxes, and
                  insurance and represents your core housing payment. If you live in
                  a community with <strong>HOA fees</strong>, those dues are added
                  on top. A larger <strong>down payment</strong> typically lowers
                  your loan amount and may reduce or eliminate PMI, which helps
                  stretch your budget further.
                </p>

                <h2 className="text-xl font-semibold text-neutral-900 mt-4">
                  Frequently Asked Questions
                </h2>
                <p>
                  <strong>How much house can I afford?</strong>
                </p>
                <p>
                  The calculator looks at your income, debts, down payment, and
                  underwriting-style ratios to estimate a comfortable maximum home
                  price. You can adjust assumptions to match what you&apos;re hearing
                  from lenders or to aim for a more conservative payment.
                </p>
                <p>
                  <strong>What debt-to-income ratios should I use?</strong>
                </p>
                <p>
                  Many buyers start with 28% for housing costs and 36% for total
                  debt, but some loan programs allow higher DTIs. This tool lets you
                  raise or lower those percentages so you can see how stricter or
                  more flexible guidelines affect affordability.
                </p>
                <p>
                  <strong>Does this estimate include taxes, insurance, and HOA fees?</strong>
                </p>
                <p>
                  Yes. Property taxes, homeowners insurance, and HOA dues are
                  included in the payment breakdown so the estimated monthly cost is
                  closer to what you might see on an actual mortgage quote.
                </p>
                <p>
                  <strong>What if I plan to move or refinance in a few years?</strong>
                </p>
                <p>
                  Shorter expected timelines can change how much risk you&apos;re
                  comfortable taking on. You can use this calculator together with
                  the mortgage and extra payment tools to compare shorter or
                  adjustable-rate scenarios against long-term fixed-rate options.
                </p>

                <h2 className="text-xl font-semibold text-neutral-900 mt-4">
                  Related Tools at FinWorld
                </h2>
                <p>
                  Planning a home purchase? Try the{" "}
                  <a href="/tools/mortgage-calculator" className="underline">
                    Mortgage Calculator
                  </a>{" "}
                  to model specific loan amounts, rates, and amortization
                  schedules once you have a target price range.
                </p>
                <p>
                  If you&apos;re thinking about paying off debt faster, the{" "}
                  <a href="/tools/extra-payment" className="underline">
                    Loan Payoff &amp; Extra Payment Calculator
                  </a>{" "}
                  can show how redirecting cash flow might free up room in your
                  housing budget over time.
                </p>
                <p>
                  For investors, the{" "}
                  <a href="/tools/rental-property-calculator" className="underline">
                    Rental Property Calculator
                  </a>{" "}
                  helps evaluate potential income properties, while the{" "}
                  <a href="/tools/compounding-calculator" className="underline">
                    Compounding Calculator
                  </a>{" "}
                  illustrates how long-term savings and investments complement your
                  home purchase decisions.
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
              © 2025 FinWorld Project. This calculator provides estimates only. 
              Consult with financial professionals for personalized advice.
            </p>
            <p className="text-xs mt-2">
              Calculations based on standard mortgage underwriting guidelines. 
              Actual loan terms may vary by lender and credit profile.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomeAffordabilityCalculator;
