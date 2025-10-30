// src/pages/tools/extra_payment/index.jsx
import * as React from "react";
import Layout from "./components/Layout";
import PayoffChart from "./components/PayoffChart";
import SummaryPanel from "./components/SummaryPanel";
import AmortizationTable from "./components/AmortizationTable";
import calculateLoanDetails from "./utils/calculateLoanDetails";
import { Box, Typography, FormControlLabel, Switch } from "@mui/material";

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
  }, [inputs, matchAnnual]);

  React.useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  const initialAmount = parseFloat(inputs.amount.replace(/,/g, "")) || 0;

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
      <Layout
        compare1Visible={compare1Visible}
        compare2Visible={compare2Visible}
        setCompare1Visible={setCompare1Visible}
        setCompare2Visible={setCompare2Visible}
        inputs={inputs}
        setInputs={setInputs}
        onCalculate={handleCalculate}
      >
        {/* === Payoff Chart === */}
        <Box
          sx={{
            maxWidth: { xs: "100%", md: "40%" },
            width: "100%",
            mx: "auto",
            mb: 3,
          }}
        >
          <PayoffChart
            results={results}
            compare1Visible={compare1Visible}
            compare2Visible={compare2Visible}
            initialAmount={initialAmount}
          />
        </Box>

        {/* === Summary Panel === */}
        <Box
          sx={{
            maxWidth: { xs: "100%", md: "40%" },
            width: "100%",
            mx: "auto",
            mb: 3,
          }}
        >
          <SummaryPanel
            results={results}
            fmtCurrency={fmtCurrency}
            compare1Visible={compare1Visible}
            compare2Visible={compare2Visible}
          />
        </Box>

        {/* === Amortization Table Section === */}
        <Box
          sx={{
            maxWidth: { xs: "100%", md: "40%" },
            width: "100%",
            mx: "auto",
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={matchAnnual}
                onChange={(e) => setMatchAnnual(e.target.checked)}
              />
            }
            label="Match Annual Spending"
            sx={{ mb: 1 }}
          />
          <Typography
            variant="caption"
            sx={{ opacity: 0.75, display: "block", mb: 2 }}
          >
            When enabled, extra payments are adjusted so each plan spends the
            same total extra amount per year.
          </Typography>

          <AmortizationTable results={results} fmtCurrency={fmtCurrency} />
        </Box>
      </Layout>
    </Box>
  );
}
