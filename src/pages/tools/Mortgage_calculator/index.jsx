import * as React from "react";
import { Helmet } from 'react-helmet-async';
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
    { q: 'What’s the difference between APR and rate?', a: 'APR can include certain fees; the nominal rate is just interest. This tool uses your entered rate for payment math.' }
  ];
  const [inputs, setInputs] = React.useState(initialInputs);
  const [results, setResults] = React.useState(null);

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

  // SEO block
  

  React.useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <>
      <Helmet>
  <title>Mortgage Calculator | FinWorld</title>
  <meta name="description" content="Fast mortgage calculator with amortization schedule, total interest, and optional extra payments." />
  <link rel="canonical" href={typeof window !== 'undefined' ? (window.location.origin + window.location.pathname) : 'https://www.finworld.live/tools/mortgage-calculator'} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Mortgage Calculator | FinWorld" />
  <meta property="og:description" content="Fast mortgage calculator with amortization schedule, total interest, and optional extra payments." />
  <meta property="og:url" content={typeof window !== 'undefined' ? (window.location.origin + window.location.pathname) : 'https://www.finworld.live/tools/mortgage-calculator'} />
  <meta property="og:image" content="https://www.finworld.live/assets/finworld-preview.png" />
  <script type="application/ld+json">{JSON.stringify({ '@context':'https://schema.org','@type':'FAQPage', mainEntity: [ { '@type':'Question', name:'How are mortgage payments calculated?', acceptedAnswer:{'@type':'Answer', text:'Payments are based on principal, interest rate (APR), and term. This tool computes amortization and total interest.'}}, { '@type':'Question', name:'Can I include extra payments?', acceptedAnswer:{'@type':'Answer', text:'Yes. Adding extras reduces overall interest and shortens the term.'}}, { '@type':'Question', name:"What's the difference between APR and rate?", acceptedAnswer:{'@type':'Answer', text:'APR can include certain fees; the nominal rate is just interest. This tool uses your entered rate for payment math.'}} ] })}</script>
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
        </Box>
      </Layout>
    </Box>
    </>
  );
}