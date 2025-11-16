import * as React from "react";
import { Helmet } from "react-helmet-async";
import Layout from "./components/Layout";
import PaymentBreakdown from "./components/PaymentBreakdown";
import AdvancedSection from "./components/AdvancedSection";
import RateCards from "./components/RateCards";
import LenderPartners from "./components/LenderPartners";
import { calculateMortgage } from "./utils/mortgageCalculations";
import { Box } from "@mui/material";

const initialInputs = {
  homePrice: "",
  downPayment: "",
  downPaymentMode: "percent", // 'amount' | 'percent'
  downPaymentPercent: "",
  loanTerm: "30",
  interestRate: "",
  state: "",
  propertyTax: "",
  homeInsurance: "",
  pmi: "",
  hoaFees: "",
  creditScore: "Excellent (740+)",
};

export default function MortgageCalculator() {
  const seoFaq = [
    { q: 'How are mortgage payments calculated?', a: 'Payments are based on principal, interest rate (APR), and term. This tool computes amortization and total interest.' },
    { q: 'Can I include extra payments?', a: 'Yes. Adding extras reduces overall interest and shortens the term.' },
    { q: "What's the difference between APR and rate?", a: 'APR can include certain fees; the nominal rate is just interest. This tool uses your entered rate for payment math.' }
  ];
  const [inputs, setInputs] = React.useState(initialInputs);
  const [results, setResults] = React.useState(null);
  const loc = typeof window !== "undefined" && window.location ? window.location : null;
  const canonicalUrl = loc ? `${loc.origin}${loc.pathname}` : "https://www.finworld.live/tools/mortgage-calculator";

  const handleCalculate = React.useCallback(() => {
    const homePrice = parseFloat(inputs.homePrice.replace(/,/g, "")) || 0;
    const downPayment =
      inputs.downPaymentMode === "percent"
        ? (homePrice * (parseFloat(inputs.downPaymentPercent) || 0)) / 100
        : parseFloat(inputs.downPayment.replace(/,/g, "")) || 0;
    const loanTerm = parseFloat(inputs.loanTerm) || 30;
    const interestRate = parseFloat(inputs.interestRate) || 0;
    const propertyTax = parseFloat(inputs.propertyTax) || 0;
    const homeInsurance = parseFloat(inputs.homeInsurance) || 0;
    const pmi = parseFloat(inputs.pmi) || 0;
    const hoaFees = parseFloat(inputs.hoaFees) || 0;

    const calculationResults = calculateMortgage({
      homePrice,
      downPayment,
      loanTerm,
      interestRate,
      propertyTax,
      homeInsurance,
      pmi,
      hoaFees,
    });

    setResults(calculationResults);
  }, [inputs]);

  const handleReset = React.useCallback(() => {
    setInputs(initialInputs);
    setResults(null); // Clear results when inputs are reset
  }, []);

  React.useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <>
      <Helmet>
        <title>FinWorld Mortgage Calculator | Payments, Amortization & Total Interest</title>
        <meta
          name="description"
          content="Use the FinWorld mortgage calculator to estimate monthly payments, total interest, taxes, insurance, and PMI. See a full amortization schedule and compare scenarios before you buy or refinance."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="FinWorld Mortgage Calculator | Payments, Amortization & Total Interest" />
        <meta
          property="og:description"
          content="Model your mortgage payment with principal, interest, taxes, insurance, and PMI. View amortization, compare terms, and explore payoff strategies in one place."
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://www.finworld.live/assets/finworld-preview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FinWorld Mortgage Calculator | Payments, Amortization & Total Interest" />
        <meta
          name="twitter:description"
          content="Free, interactive mortgage calculator from FinWorld with amortization, total interest, and advanced options for taxes, insurance, and PMI."
        />
        <meta name="twitter:image" content="https://www.finworld.live/assets/finworld-preview.png" />
        <script
          type="application/ld+json"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "FinWorld Mortgage Calculator",
            operatingSystem: "All",
            applicationCategory: "FinanceApplication",
            browserRequirements: "Requires JavaScript",
            url: canonicalUrl,
            description:
              "Interactive mortgage calculator that estimates monthly payments, total interest, and amortization based on home price, down payment, term, and interest rate.",
          })}
        </script>
        <script
          type="application/ld+json"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How are mortgage payments calculated?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Mortgage payments are based on the loan amount, interest rate, and term. This calculator uses standard amortization formulas to break each payment into principal and interest, and then adds estimates for taxes, insurance, and PMI if you include them.",
                },
              },
              {
                "@type": "Question",
                name: "What is PMI and when does it apply?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Private mortgage insurance (PMI) is typically required when your down payment is below 20% of the home price. It protects the lender, not the borrower. You can model PMI costs in this calculator to see how a larger down payment or home price change affects your monthly payment.",
                },
              },
              {
                "@type": "Question",
                name: "What is a good debt-to-income (DTI) ratio for a mortgage?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Many lenders prefer to see a total debt-to-income (DTI) ratio at or below 43%, though some programs allow higher. While this tool focuses on your housing payment, you can use the results alongside your other debts to understand whether a payment is likely to be considered affordable.",
                },
              },
              {
                "@type": "Question",
                name: "How can extra payments reduce interest paid on a mortgage?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Extra payments go directly toward principal, which shortens your loan term and reduces total interest. You can pair this mortgage calculator with the FinWorld Extra Payment Calculator to see how different extra payment strategies change payoff timing and interest costs.",
                },
              },
              {
                "@type": "Question",
                name: "Is refinancing my mortgage worth it?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Refinancing can be worth it if you can meaningfully lower your interest rate or change your loan term to better fit your budget. Use this tool to compare your current payment and payoff schedule against a potential new rate and term, factoring in closing costs and how long you plan to stay in the home.",
                },
              },
              {
                "@type": "Question",
                name: "How does a 15-year vs 30-year mortgage affect total interest?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Shorter terms like a 15-year mortgage usually have higher monthly payments but significantly lower total interest paid over the life of the loan. A 30-year mortgage offers lower monthly payments but more interest over time. This calculator lets you compare different terms side by side.",
                },
              },
              {
                "@type": "Question",
                name: "How do property taxes, insurance, and HOA fees change my payment?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Property taxes, homeowners insurance, and HOA fees are added on top of your principal and interest to form your total monthly housing payment. The calculator lets you enter estimates for each so you can see a more realistic monthly cost instead of just the base loan payment.",
                },
              },
            ],
          })}
        </script>
      </Helmet>
      <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)"
            : "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      <Layout inputs={inputs} setInputs={setInputs} onCalculate={handleCalculate} onReset={handleReset}>
        <Box
          sx={{
            width: "100%",
            // Shrink default content width ~30% on medium+ screens
            // Shrink a further ~15% on md+ screens (now ~55% of page width)
            maxWidth: { xs: '100%', md: '55%' },
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: { xs: 3, sm: 4, md: 6 },
          }}
        >
          <PaymentBreakdown results={results} />
          <AdvancedSection />
          <RateCards />
          <LenderPartners />
          <div className="mt-8 text-center">
            <a
              href="/guides/how-to-use-mortgage-calculator"
              className="text-blue-600 underline"
            >
              📘 View the Full Mortgage Calculator Guide
            </a>
          </div>
          <section className="mt-12 prose max-w-none">
            <h2>FinWorld Mortgage Calculator Overview</h2>
            <p>
              The FinWorld mortgage calculator is designed to help homebuyers, current homeowners, and refinancers quickly understand what a mortgage payment could look like before talking to a lender. By combining the core pieces of a mortgage payment&mdash;principal, interest, property taxes, homeowners insurance, PMI, and HOA fees&mdash;this tool gives you a clearer picture of your full monthly housing cost, not just the base loan amount. You can explore different home prices, down payments, loan terms, and interest rates to see how each choice affects affordability and total interest over time.
            </p>
            <p>
              Whether you are comparing a 15-year versus 30-year mortgage, deciding how much to put down, or thinking about refinancing, this calculator is built to support side-by-side what-if scenarios. Use it early in your search to set realistic expectations, then revisit it as you receive rate quotes, adjust your budget, or consider alternative properties. The goal is not to replace professional advice, but to give you a structured way to run the numbers and feel more confident in the decisions you bring to your lender or financial advisor.
            </p>

            <h2>How to Use This Mortgage Calculator</h2>
            <p>
              Start by entering the estimated home price and your planned down payment. You can switch between entering a dollar amount or a percentage, which makes it easy to test scenarios like &ldquo;What if I put 20% down instead of 10%?&rdquo; Next, choose a loan term, such as 15 or 30 years, and enter the interest rate you expect based on lender quotes or current market averages.
            </p>
            <p>
              After that, refine the estimate by including property taxes, homeowners insurance, and any HOA fees you expect for the property. If your down payment is below 20%, you can add an estimate for PMI to see how it affects your total monthly payment. Once your inputs look right, review the monthly payment breakdown, amortization details, and total interest over the life of the loan. Adjust one input at a time&mdash;such as the rate, term, or down payment&mdash;to understand which levers make the biggest difference to both affordability today and long-term costs.
            </p>

            <h2>Mortgage Calculation Examples</h2>
            <p>
              Imagine a first-time homebuyer purchasing a $400,000 home with 10% down, a 30-year term, and a 6.5% interest rate. After including estimated taxes, insurance, and PMI, the calculator might show a monthly payment that is higher than expected, with a large share going to interest in the early years. This scenario can highlight how long it takes to build equity and how sensitive the payment is to interest rate changes.
            </p>
            <p>
              In a second scenario, consider a buyer with a similar budget but able to put 20% down on the same $400,000 home. By removing PMI and reducing the loan amount, the monthly payment drops, and total interest over 30 years decreases significantly. The calculator makes it easy to see how the larger upfront investment can pay off over time.
            </p>
            <p>
              Finally, think about a homeowner comparing a refinance from a 30-year mortgage at 6.5% to a new 15-year mortgage at a lower rate. The monthly payment may rise, but the total interest paid over the life of the loan could fall dramatically. By plugging both the current loan and the potential refinance terms into the calculator, you can quickly see whether the trade-off between higher monthly payments and lower long-term costs makes sense for your situation.
            </p>

            <h2>Common Mortgage Mistakes to Avoid</h2>
            <p>
              One of the most common mistakes is focusing only on the principal and interest portion of the payment and ignoring taxes, insurance, PMI, and HOA dues. This can lead to underestimating your true monthly housing cost and stretching your budget too far. Another mistake is basing affordability solely on the maximum amount a lender is willing to approve rather than what comfortably fits into your broader financial plan.
            </p>
            <p>
              Many borrowers also lock in a rate without comparing multiple lender offers, which can mean paying more in interest over the life of the loan than necessary. Failing to understand how rate buydowns, points, and closing costs affect the break-even point is another frequent oversight. Use this calculator to test different rate scenarios and payment levels before you commit, and revisit your numbers if your income, debts, or savings change during the homebuying process.
            </p>

            <h2>Understanding Key Mortgage Terms</h2>
            <p>
              The <strong>interest rate</strong> is the cost you pay to borrow money, expressed as a percentage of the loan balance. The <strong>APR</strong> (annual percentage rate) is a broader measure that can include certain lender fees in addition to the base rate. While this calculator focuses on the rate you enter for payment calculations, it is still helpful to compare APRs when reviewing lender offers.
            </p>
            <p>
              <strong>PMI</strong> (private mortgage insurance) is typically required when your down payment is below 20% and is an extra monthly cost on top of your base payment. <strong>Escrow</strong> refers to the account your lender may use to collect and hold property tax and insurance payments, bundling them into your monthly payment. Your <strong>DTI</strong> (debt-to-income ratio) is the percentage of your gross income that goes toward debt payments, including your mortgage. Lenders use DTI to assess how much you can reasonably afford to borrow.
            </p>

            <h2>Frequently Asked Questions</h2>
            <p><strong>How are mortgage payments calculated?</strong></p>
            <p>
              Mortgage payments are calculated using an amortization formula that considers the loan amount, interest rate, and term. The result is a fixed monthly payment that covers both principal and interest, with the mix shifting over time as you pay down the loan.
            </p>
            <p><strong>What is PMI and when does it apply?</strong></p>
            <p>
              PMI usually applies when you put less than 20% down on a conventional mortgage. It protects the lender in case of default and adds an additional monthly cost until you reach a certain equity threshold or refinance.
            </p>
            <p><strong>What is a good debt-to-income ratio for buying a home?</strong></p>
            <p>
              Many lenders prefer a total DTI at or below about 43%, though some programs allow higher depending on credit, reserves, and other factors. A lower DTI generally gives you more flexibility and can improve loan approval odds.
            </p>
            <p><strong>How do extra payments change my mortgage?</strong></p>
            <p>
              Extra payments reduce your principal faster, which can shorten your loan term and lower total interest. Even small recurring extra payments can make a noticeable difference over 15 or 30 years.
            </p>
            <p><strong>Is refinancing always a good idea?</strong></p>
            <p>
              Refinancing can be beneficial if you secure a lower rate or a term that better matches your goals, but it also comes with closing costs and a new timeline. Use this calculator to compare your current payment and payoff schedule with potential refinance options.
            </p>
            <p><strong>How does a shorter term affect total interest?</strong></p>
            <p>
              Shorter terms, such as 15-year mortgages, concentrate payments into a smaller window, which increases monthly payments but typically results in much lower total interest paid compared with longer terms like 30 years.
            </p>

            <h2>Related Tools at FinWorld</h2>
            <p>
              Once you understand your potential mortgage payment, you can explore other FinWorld tools to round out your decision-making. The{" "}
              <a href="/tools/home-affordability">Home Affordability Calculator</a> helps you estimate a comfortable price range based on your income and debts.
            </p>
            <p>
              To explore payoff strategies, try the{" "}
              <a href="/tools/extra-payment">Loan Payoff &amp; Extra Payment Calculator</a>, which models how additional principal payments can shorten your term and reduce interest. If you are evaluating a property as an investment, the{" "}
              <a href="/tools/rental-property-calculator">Rental Property Calculator</a> lets you project cash flow and returns.
            </p>
            <p>
              For broader planning, use the{" "}
              <a href="/tools/compounding-calculator">Compounding Calculator</a> to see how your savings grow over time, or the{" "}
              <a href="/tools/buy-vs-lease-auto">Buy vs Lease Auto Calculator</a> to compare borrowing decisions in other parts of your financial life. Together, these tools help you see how your mortgage fits into your overall money picture.
            </p>
          </section>
        </Box>
      </Layout>
    </Box>
    </>
  );
}
