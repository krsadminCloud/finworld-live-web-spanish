// src/pages/tools/extra_payment/index.jsx
import * as React from "react";
import Layout from "./components/Layout";
import PayoffChart from "./components/PayoffChart";
import SummaryPanel from "./components/SummaryPanel";
import AmortizationTable from "./components/AmortizationTable";
import InputCard from "./components/InputCard";
import calculateLoanDetails from "./utils/calculateLoanDetails";
import { Box, Typography, FormControlLabel, Switch, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ensureLoanPayoffThemeCss } from "./themeCssLoader";

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
  }, [inputs, matchAnnual]);

  React.useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  React.useEffect(() => {
    ensureLoanPayoffThemeCss(theme.palette.mode);
  }, [theme.palette.mode]);

  const initialAmount = parseFloat(inputs.amount.replace(/,/g, "")) || 0;

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
              Compare payoff strategies and extra payments to see how quickly you
              can become debt free.
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
          </Box>
        </Stack>
      </Layout>
    </Box>
  );
}
