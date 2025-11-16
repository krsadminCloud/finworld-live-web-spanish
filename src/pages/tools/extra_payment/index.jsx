// src/pages/tools/extra_payment/index.jsx
import * as React from "react";
import { Helmet } from "react-helmet-async";
import Layout from "./components/Layout";
import PayoffChart from "./components/PayoffChart";
import SummaryPanel from "./components/SummaryPanel";
import AmortizationTable from "./components/AmortizationTable";
import InputCard from "./components/InputCard";
import calculateLoanDetails from "./utils/calculateLoanDetails";
import { Box, Typography, FormControlLabel, Switch, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ensureLoanPayoffThemeCss } from "./themeCssLoader";
import { trackEvent } from "../../../utils/analytics";

const fmtCurrency = (v) =>
  typeof v === "number"
    ? v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "$0.00";

export default function ExtraPayment() {
  const [compare1Visible, setCompare1Visible] = React.useState(true);
  const [compare2Visible, setCompare2Visible] = React.useState(true);
  const [matchAnnual, setMatchAnnual] = React.useState(false);
  const theme = useTheme();

  // === Input State ===
  const [inputs, setInputs] = React.useState({
    amount: "500000",
    rate: "6.5",
    years: "30",
    frequency: "Monthly",
    compare1: { extra: "200", frequency: "Monthly" },
    compare2: { extra: "300", frequency: "Monthly" },
  });

  // === Results State ===
  const [results, setResults] = React.useState({
    original: null,
    base: null,
    compare1: null,
    compare2: null,
  });

  // === Calculation Logic ===
  const handleCalculate = React.useCallback(() => {
    const paymentsPerYear = { Monthly: 12, Biweekly: 26, Weekly: 52 };

    const amount = parseFloat(inputs.amount.replace(/,/g, "")) || 0;
    const rate = parseFloat(inputs.rate) || 0;
    const years = parseFloat(inputs.years) || 0;
    const extra = parseFloat(inputs.extra) || 0;
    const baseFreq = inputs.frequency || "Monthly";

    const baseYearlyExtra = extra * paymentsPerYear[baseFreq];

    const getAdjustedExtra = (extra, freq) => {
      const val = parseFloat(extra) || 0;
      if (!matchAnnual) return val;
      const annualized = baseYearlyExtra / paymentsPerYear[freq];
      return parseFloat(annualized.toFixed(2));
    };

    const c1Extra = getAdjustedExtra(
      inputs.compare1.extra,
      inputs.compare1.frequency
    );
    const c2Extra = getAdjustedExtra(
      inputs.compare2.extra,
      inputs.compare2.frequency
    );

    const original = calculateLoanDetails(amount, rate, years, 0, baseFreq);
    const base = calculateLoanDetails(amount, rate, years, extra, baseFreq);
    const compare1 = calculateLoanDetails(
      amount,
      rate,
      years,
      c1Extra,
      inputs.compare1.frequency
    );
    const compare2 = calculateLoanDetails(
      amount,
      rate,
      years,
      c2Extra,
      inputs.compare2.frequency
    );

    setResults({ original, base, compare1, compare2 });
    trackEvent("loan_payoff_calculated", {
      calculator: "loan_payoff",
      amount,
      rate,
      years,
      baseFrequency: baseFreq,
    });
  }, [inputs, matchAnnual]);

  React.useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  React.useEffect(() => {
    ensureLoanPayoffThemeCss(theme.palette.mode);
  }, [theme.palette.mode]);

  const initialAmount = parseFloat(inputs.amount.replace(/,/g, "")) || 0;
  const loc = typeof window !== "undefined" && window.location ? window.location : null;
  const canonical =
    loc?.origin && loc?.pathname
      ? `${loc.origin}${loc.pathname}`
      : "https://www.finworld.live/tools/extra-payment";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much can I save with extra mortgage payments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The calculator compares your original loan to different extra payment strategies and shows how much interest you save and how many years you can shave off your term.",
        },
      },
      {
        "@type": "Question",
        name: "How often should I make extra payments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can model monthly, biweekly, or weekly extra payments. Matching annual spending keeps comparisons fair and shows which cadence accelerates payoff the most.",
        },
      },
      {
        "@type": "Question",
        name: "Does this calculator support different loan types?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can use it for mortgages, auto loans, personal loans, or any fixed-rate amortizing loan by adjusting the balance, term, and interest rate.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use this extra payment calculator for non-mortgage debt?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can use the calculator for auto loans, personal loans, and other installment debt by entering the balance, rate, term, and extra payment structure you want to analyze.",
        },
      },
      {
        "@type": "Question",
        name: "Is it better to build savings or make extra payments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "There is no one-size-fits-all answer. Extra payments reduce interest and shorten your payoff timeline, while savings build a cash buffer. This tool helps you quantify the payoff benefits so you can weigh them against your need for liquidity and other goals.",
        },
      },
      {
        "@type": "Question",
        name: "What happens if I stop making extra payments later?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "If you pause extra payments, your loan simply reverts to the original schedule. The calculator makes it easy to test more conservative extra strategies so you choose an amount you can sustain over time.",
        },
      },
    ],
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "FinWorld Loan Payoff & Extra Payment Calculator",
    operatingSystem: "All",
    applicationCategory: "FinanceApplication",
    browserRequirements: "Requires JavaScript",
    url: canonical,
    description:
      "Interactive extra payment calculator that compares multiple payoff strategies, shows amortization schedules, and quantifies total interest savings for mortgages and other loans.",
  };

  return (
    <Box
      className="loan-payoff"
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
      <Helmet>
        <title>Loan Payoff & Extra Payment Calculator | FinWorld</title>
        <meta
          name="description"
          content="Use the FinWorld extra payment calculator to compare payoff strategies, see how much interest you can save, and estimate how quickly you can become debt free."
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Loan Payoff & Extra Payment Calculator | FinWorld"
        />
        <meta
          property="og:description"
          content="Model extra payments on your mortgage or other loans, visualize payoff timelines, and quantify total interest savings across multiple strategies."
        />
        <meta property="og:url" content={canonical} />
        <meta
          property="og:image"
          content="https://www.finworld.live/assets/finworld-preview.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Loan Payoff & Extra Payment Calculator | FinWorld"
        />
        <meta
          name="twitter:description"
          content="Free, interactive extra payment calculator to test payoff strategies and see how much interest you can save."
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
      <Layout>
        <Stack
          spacing={{ xs: 3, md: 4 }}
          sx={{
            width: "100%",
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <Box
            textAlign="center"
            sx={{
              py: { xs: 2.5, md: 3 },
              mt: { xs: 0, md: 0 },
              px: { xs: 2, md: 4 },
            }}
          >
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{ color: "text.primary", mb: 1 }}
            >
              Loan Payoff Calculator
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", maxWidth: 600, mx: "auto" }}
            >
              Use extra principal payments, biweekly schedules, and side-by-side
              comparisons to see how quickly you can become debt free and how
              much interest you can avoid paying.
            </Typography>
            <Box
              sx={{
                width: 96,
                height: 4,
                bgcolor: "#14B8A6",
                borderRadius: 999,
                mx: "auto",
                mt: 2,
              }}
            />
          </Box>

          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={{ xs: 3, md: 4 }}
            alignItems="stretch"
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <InputCard
                inputs={inputs}
                setInputs={setInputs}
                compare1Visible={compare1Visible}
                compare2Visible={compare2Visible}
                setCompare1Visible={setCompare1Visible}
                setCompare2Visible={setCompare2Visible}
              />
            </Box>

            <Stack sx={{ flex: 1, minWidth: 0 }} spacing={3}>
              <Box>
                <PayoffChart
                  results={results}
                  compare1Visible={compare1Visible}
                  compare2Visible={compare2Visible}
                  initialAmount={initialAmount}
                />
              </Box>

              <Box>
                <SummaryPanel
                  results={results}
                  fmtCurrency={fmtCurrency}
                  compare1Visible={compare1Visible}
                  compare2Visible={compare2Visible}
                />
              </Box>
            </Stack>
          </Stack>

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={matchAnnual}
                  onChange={(e) => setMatchAnnual(e.target.checked)}
                />
              }
              label="Match Annual Spending"
              sx={{
                mb: 1,
                gap: 1,
                alignItems: "center",
              }}
            />
            <Typography
              variant="caption"
              sx={{ opacity: 0.75, display: "block", mb: 2 }}
            >
              When enabled, extra payments are adjusted so each plan spends the
              same total extra amount per year.
            </Typography>

            <AmortizationTable results={results} fmtCurrency={fmtCurrency} />

            <Box sx={{ mt: 6, textAlign: "center" }}>
              <a
                href="/guides/how-to-use-extra-payment-calculator"
                className="text-blue-600 underline"
              >
                📘 View the Full Extra Payment Strategy Guide
              </a>
            </Box>

            {/* Long-form SEO content block */}
            <Box sx={{ mt: 6 }}>
              <Typography
                component="h2"
                variant="h5"
                sx={{ fontWeight: 700, mb: 2 }}
              >
                Extra Payment Calculator Overview
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                The FinWorld Loan Payoff &amp; Extra Payment Calculator is built
                to answer a simple but powerful question: &ldquo;What happens if
                I pay a little extra toward my loan each month?&rdquo; By
                modeling your current balance, interest rate, term, and
                different extra payment strategies, this tool shows how much
                faster you can become debt free and how much interest you could
                save along the way. You can adjust extra amounts, switch between
                monthly, biweekly, and weekly frequencies, and compare multiple
                payoff plans side by side.
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Whether you are focused on a mortgage, auto loan, student loan,
                or another installment debt, the goal is to give you a clear,
                visual way to test ideas before you commit. Use the charts and
                amortization table to see how quickly your balance falls under
                each strategy, how much interest you avoid, and how your payoff
                date moves forward. This context can make it easier to choose an
                extra payment amount that is ambitious but still realistic for
                your budget.
              </Typography>

              <Typography
                component="h2"
                variant="h5"
                sx={{ fontWeight: 700, mb: 2, mt: 4 }}
              >
                How to Use This Extra Payment Calculator
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Start by entering your loan balance, interest rate, and
                remaining term. These values are often listed on your statement
                or in your lender&apos;s online portal. Next, choose how often
                you make payments&mdash;monthly, biweekly, or weekly&mdash;so
                the calculator can align with your real payment schedule. In the
                main &ldquo;base&rdquo; extra payment section, add the amount
                you are considering paying on top of your regular payment.
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Then, use the comparison lanes to experiment with alternative
                strategies. For example, you might compare a smaller monthly
                extra to a larger quarterly lump sum, or test a biweekly
                schedule against a flat monthly overpayment. The &ldquo;Match
                Annual Spending&rdquo; option keeps your total yearly extra
                dollars the same across plans, making it easier to see which
                pattern gives you the best payoff for the same budget.
              </Typography>

              <Typography
                component="h2"
                variant="h5"
                sx={{ fontWeight: 700, mb: 2, mt: 4 }}
              >
                Extra Payment Strategy Examples
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Imagine a homeowner with a $500,000 mortgage at 6.5% interest
                over 30 years. Making only the scheduled payment leads to a long
                payoff timeline and a large total interest bill. If they add an
                extra $200 each month, the calculator may show that they can
                shave several years off the term and save tens of thousands of
                dollars in interest.
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                In another scenario, consider someone who prefers to align extra
                payments with bonus or tax refund season. They might set a small
                recurring extra monthly amount and add one or two larger
                lump-sum payments each year. The comparison view makes it easy
                to see whether this approach performs better or worse than a
                steady monthly overpayment for the same total annual dollars.
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Finally, a borrower with multiple debts could use this tool to
                explore debt snowball or debt avalanche strategies. After paying
                off a smaller balance, they can redirect that payment toward a
                larger loan and use the calculator to see how quickly the
                combined extra amount accelerates the payoff schedule.
              </Typography>

              <Typography
                component="h2"
                variant="h5"
                sx={{ fontWeight: 700, mb: 2, mt: 4 }}
              >
                Common Extra Payment Mistakes to Avoid
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                A common mistake is sending extra money to your lender without
                clearly designating it as a principal-only payment. If the funds
                are applied incorrectly, they may simply prepay future interest
                instead of lowering your balance. Always check your statement to
                confirm how extra payments are credited and contact your lender
                if anything looks off.
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Another pitfall is overcommitting to an aggressive extra payment
                schedule without leaving room for emergencies or other goals
                like retirement savings. While paying debt off faster is
                attractive, a thin cash cushion can create stress when
                unexpected expenses arise. Use this calculator to find a balance
                between speed and flexibility, and adjust your plan as your
                income or expenses change.
              </Typography>

              <Typography
                component="h2"
                variant="h5"
                sx={{ fontWeight: 700, mb: 2, mt: 4 }}
              >
                Understanding Key Terms
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Your <strong>principal</strong> is the amount you still owe on
                the loan, while <strong>interest</strong> is the cost you pay to
                borrow that money. The <strong>term</strong> is the length of
                the loan in years, and the <strong>amortization schedule</strong>
                shows how each payment is split between principal and interest
                over time. Extra payments work by reducing principal faster than
                scheduled, which lowers the interest portion of future payments.
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                You may also encounter terms like <strong>APR</strong> (annual
                percentage rate), which includes certain fees in addition to the
                nominal interest rate, and <strong>prepayment penalty</strong>,
                which is a fee some lenders charge if you pay off your loan
                early. Always review your loan documents to understand whether
                penalties apply before committing to a very aggressive extra
                payment plan.
              </Typography>

              <Typography
                component="h2"
                variant="h5"
                sx={{ fontWeight: 700, mb: 2, mt: 4 }}
              >
                Frequently Asked Questions
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>How much can I save with extra mortgage payments?</strong>
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                The calculator compares your original loan to different extra
                payment strategies and shows how much interest you save and how
                many years you can shave off your term. Even small recurring
                extras can lead to meaningful savings over a 15- or 30-year
                loan.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Is it better to pay extra monthly or switch to biweekly payments?</strong>
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Biweekly payments effectively add the equivalent of one extra
                monthly payment each year, while a fixed extra amount lets you
                control the exact dollars you commit. The comparison view helps
                you see which pattern works best for your situation and budget.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Can I use this tool for non-mortgage loans?</strong>
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Yes. As long as your loan has a fixed rate and regular payment
                schedule, you can apply the same math to auto loans, personal
                loans, or student loans by entering the appropriate balance,
                rate, and term.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>What if I need to stop making extra payments later?</strong>
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                You can generally reduce or pause extra payments at any time.
                Your loan will revert to the original schedule, but any past
                extra principal you&apos;ve paid still counts. You can update
                the calculator with a more conservative extra amount to find a
                sustainable long-term plan.
              </Typography>

              <Typography
                component="h2"
                variant="h5"
                sx={{ fontWeight: 700, mb: 2, mt: 4 }}
              >
                Related Tools at FinWorld
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Once you&apos;ve explored extra payment strategies, you can use
                the{" "}
                <a href="/tools/mortgage-calculator">Mortgage Calculator</a> to
                see how different home prices, rates, and terms affect your base
                payment before extra amounts.
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                If you&apos;re still deciding how much house to buy, the{" "}
                <a href="/tools/home-affordability">
                  Home Affordability Calculator
                </a>{" "}
                can help you estimate a comfortable price range based on your
                income and existing debts.
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                For broader planning, the{" "}
                <a href="/tools/compounding-calculator">
                  Compounding Calculator
                </a>{" "}
                shows how redirecting interest savings into investments can grow
                over time, and the{" "}
                <a href="/tools/buy-vs-lease-auto">Buy vs Lease Auto Calculator</a>{" "}
                can help you evaluate other borrowing decisions alongside your
                mortgage payoff goals.
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Layout>
    </Box>
  );
}
