import * as React from "react";
import Layout from "./components/Layout";
import PaymentBreakdown from "./components/PaymentBreakdown";
import RateCards from "./components/RateCards";
import LenderPartners from "./components/LenderPartners";
import { calculateMortgage } from "./utils/mortgageCalculations";
import { Box } from "@mui/material";

const initialInputs = {
  homePrice: "",
  downPayment: "",
  loanTerm: "30",
  interestRate: "",
  zipCode: "",
  propertyTax: "",
  homeInsurance: "",
  pmi: "",
  hoaFees: "",
  creditScore: "Excellent (740+)",
};

export default function MortgageCalculator() {
  const [inputs, setInputs] = React.useState(initialInputs);
  const [results, setResults] = React.useState(null);

  const handleCalculate = React.useCallback(() => {
    const homePrice = parseFloat(inputs.homePrice.replace(/,/g, "")) || 0;
    const downPayment = parseFloat(inputs.downPayment.replace(/,/g, "")) || 0;
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
            maxWidth: { xs: "100%", md: "70%" },
            width: "100%",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <PaymentBreakdown results={results} />
          <RateCards />
          <LenderPartners />
        </Box>
      </Layout>
    </Box>
  );
}
