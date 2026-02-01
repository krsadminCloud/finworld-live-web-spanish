import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Paper,
  TextField,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { formatCurrency } from "../utils/mortgageCalculations";

export default function AdvancedSection() {
  const { t } = useTranslation();
  // Option A: teal backgrounds for Advanced wrappers (disabled by default)
  const OPTION_A_TEAL = false;
  const allowNumeric = (val) => val === "" || /^[0-9]*\.?[0-9]*$/.test(val);
  const formatWithCommas = (value) => {
    if (!value) return "";
    const num = Number(value.toString().replace(/,/g, ""));
    return isNaN(num) ? "" : num.toLocaleString();
  };

  const [loanA, setLoanA] = React.useState({ loanAmount: "", loanTerm: "30", interestRate: "" });
  const [loanB, setLoanB] = React.useState({ loanAmount: "", loanTerm: "15", interestRate: "" });

  const compute = React.useCallback((loanAmount, termYears, ratePct) => {
    const principal = parseFloat((loanAmount || "").toString().replace(/,/g, "")) || 0;
    const term = parseFloat(termYears) || 0;
    const rate = parseFloat(ratePct) || 0;
    const n = term * 12;
    const r = rate / 100 / 12;
    let monthly = 0;
    if (n > 0) {
      monthly = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    const totalPaid = monthly * n;
    const totalInterest = totalPaid - principal;
    return { monthly, totalPaid, totalInterest };
  }, []);

  const resultA = React.useMemo(() => compute(loanA.loanAmount, loanA.loanTerm, loanA.interestRate), [loanA, compute]);
  const resultB = React.useMemo(() => compute(loanB.loanAmount, loanB.loanTerm, loanB.interestRate), [loanB, compute]);

  // Income-based affordability inputs
  const [afford, setAfford] = React.useState({
    incomeAnnual: "",
    ratioPct: "28",
    ratePct: "",
    termYears: "30",
    downMode: "percent",
    downPercent: "20",
    downAmount: "",
    taxMode: "percent",
    taxRatePct: "1.0",
    taxAnnual: "",
    insuranceAnnual: "",
    hoaMonthly: "",
    debtMonthly: "",
  });

  const affordability = React.useMemo(() => {
    const incomeAnnual = parseFloat(afford.incomeAnnual.toString().replace(/,/g, "")) || 0;
    const ratio = (parseFloat(afford.ratioPct) || 0) / 100;
    const rate = (parseFloat(afford.ratePct) || 0) / 100 / 12;
    const term = (parseFloat(afford.termYears) || 0) * 12;
    const taxRateMonthly = (parseFloat(afford.taxRatePct) || 0) / 100 / 12;
    const insuranceMonthly = (parseFloat(afford.insuranceAnnual) || 0) / 12;
    const hoaMonthly = parseFloat(afford.hoaMonthly) || 0;
    const otherDebtMonthly = parseFloat(afford.debtMonthly.toString().replace(/,/g, "")) || 0;

    const monthlyTarget = Math.max(0, (incomeAnnual / 12) * ratio - otherDebtMonthly);
    const factor = term > 0 ? (rate === 0 ? 1 / term : (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)) : 0;

    let a = 0; // coefficient on Home Price
    let b = 0; // constant
    const p = (parseFloat(afford.downPercent) || 0) / 100;
    const D = parseFloat(afford.downAmount.toString().replace(/,/g, "")) || 0;
    const taxFixedMonthly = (parseFloat(afford.taxAnnual.toString().replace(/,/g, "")) || 0) / 12;
    const useTaxPercent = afford.taxMode === "percent";

    if (afford.downMode === "percent") {
      a = factor * (1 - p) + (useTaxPercent ? taxRateMonthly : 0);
      b = insuranceMonthly + hoaMonthly + (useTaxPercent ? 0 : taxFixedMonthly);
    } else {
      a = factor + (useTaxPercent ? taxRateMonthly : 0);
      b = insuranceMonthly + hoaMonthly + (useTaxPercent ? 0 : taxFixedMonthly) - factor * D;
    }

    let homePrice = 0;
    if (a > 0) {
      homePrice = Math.max(0, (monthlyTarget - b));
      homePrice = homePrice / a;
    }

    const downAmount = afford.downMode === "percent"
      ? homePrice * ((parseFloat(afford.downPercent) || 0) / 100)
      : (parseFloat(afford.downAmount.toString().replace(/,/g, "")) || 0);

    const loanAmount = Math.max(0, homePrice - downAmount);
    const principalAndInterest = factor * loanAmount;
    const monthlyPropertyTax = useTaxPercent ? (taxRateMonthly * homePrice) : taxFixedMonthly;
    const totalMonthly = principalAndInterest + monthlyPropertyTax + insuranceMonthly + hoaMonthly;
    const downPercent = homePrice > 0 ? (downAmount / homePrice) * 100 : 0;

    return {
      homePrice,
      loanAmount,
      principalAndInterest,
      monthlyPropertyTax,
      insuranceMonthly,
      hoaMonthly,
      totalMonthly,
      downAmount,
      downPercent,
    };
  }, [afford]);

  // Option B helpers: embedded toggle inside the input adornment (not active by default)
  const renderDownPaymentEmbedded = () => (
    <TextField
      label={t("mortgage.advanced.downPayment")}
      value={afford.downMode === 'percent' ? afford.downPercent : formatWithCommas(afford.downAmount)}
      onChange={(e) => {
        const raw = e.target.value;
        if (afford.downMode === 'percent') {
          if (allowNumeric(raw)) setAfford({ ...afford, downPercent: raw });
        } else {
          const val = raw.replace(/,/g, '');
          if (allowNumeric(val)) setAfford({ ...afford, downAmount: val });
        }
      }}
      InputProps={{
        startAdornment: afford.downMode === 'amount' ? <span style={{ marginRight: 8 }}>$</span> : null,
        endAdornment: (
          <InputAdornment position="end" sx={{ mr: -1 }}>
            <ToggleButtonGroup
              size="small"
              color="primary"
              exclusive
              value={afford.downMode}
              onChange={(e, val) => { if (val) setAfford({ ...afford, downMode: val }); }}
              sx={{
                height: 40,
                borderRadius: '0 20px 20px 0',
                overflow: 'hidden',
                '& .MuiToggleButton-root': { px: 1.25, py: 0.25, minWidth: 36, height: '100%', border: 'none', borderRadius: 0 },
              }}
            >
              <ToggleButton value="percent">%</ToggleButton>
              <ToggleButton value="amount">$</ToggleButton>
            </ToggleButtonGroup>
          </InputAdornment>
        ),
      }}
      sx={{ '& .MuiInputBase-root': { pr: 0 } }}
      size="small"
      fullWidth
    />
  );

  const renderPropertyTaxEmbedded = () => (
    <TextField
      label={t("mortgage.advanced.propertyTax")}
      value={afford.taxMode === 'percent' ? afford.taxRatePct : formatWithCommas(afford.taxAnnual)}
      onChange={(e) => {
        const raw = e.target.value;
        if (afford.taxMode === 'percent') {
          if (allowNumeric(raw)) setAfford({ ...afford, taxRatePct: raw });
        } else {
          const val = raw.replace(/,/g, '');
          if (allowNumeric(val)) setAfford({ ...afford, taxAnnual: val });
        }
      }}
      InputProps={{
        startAdornment: afford.taxMode === 'amount' ? <span style={{ marginRight: 8 }}>$</span> : null,
        endAdornment: (
          <InputAdornment position="end" sx={{ mr: -1 }}>
            <ToggleButtonGroup
              size="small"
              color="primary"
              exclusive
              value={afford.taxMode}
              onChange={(e, val) => { if (val) setAfford({ ...afford, taxMode: val }); }}
              sx={{ height: 40, borderRadius: '0 20px 20px 0', overflow: 'hidden', '& .MuiToggleButton-root': { px: 1.25, py: 0.25, minWidth: 36, height: '100%', border: 'none', borderRadius: 0 } }}
            >
              <ToggleButton value="percent">%</ToggleButton>
              <ToggleButton value="amount">$</ToggleButton>
            </ToggleButtonGroup>
          </InputAdornment>
        ),
      }}
      sx={{ '& .MuiInputBase-root': { pr: 0 } }}
      size="small"
      fullWidth
    />
  );

  return (
    <Paper sx={{ p: 3, borderRadius: 2, overflow: 'hidden', ...(OPTION_A_TEAL && { bgcolor: '#E9F9F8' }) }}>
      <Box sx={{ bgcolor: '#1976d2', color: '#ffffff', mx: -3, mt: -3, px: 3, py: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
          {t("tools.advancedFeatures")} ({t("tools.advancedFeaturesHint")})
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box>
        <Accordion sx={{ borderRadius: 2, boxShadow: 'none', ...(OPTION_A_TEAL && { bgcolor: '#E9F9F8' }) }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              borderRadius: 2,
              pr: 1,
              '& .MuiAccordionSummary-content': { m: 0 },
              // Make the expand button stand out
              '& .MuiAccordionSummary-expandIconWrapper': {
                width: 36,
                height: 36,
                borderRadius: '9999px',
                bgcolor: '#1976d2',
                color: '#fff',
                border: '2px solid #1565c0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all .2s ease',
              },
              '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                bgcolor: '#1565c0',
                borderColor: '#0d47a1',
              },
              '& .MuiAccordionSummary-expandIconWrapper:hover': {
                filter: 'brightness(1.05)',
              },
              '& .MuiSvgIcon-root': { fontSize: '1.25rem' },
              ...(OPTION_A_TEAL && { bgcolor: '#E9F9F8' }),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
              <Typography sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {t("tools.compareLoans")}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ borderRadius: 2, ...(OPTION_A_TEAL && { bgcolor: '#E9F9F8' }) }}>
        <Divider sx={{ mb: 2 }} />
        <Box>
          {/* Cards row directly under the summary */}
          <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
                borderWidth: 2,
                borderStyle: 'solid',
                // Loan 1 uses a teal scheme
                borderColor: '#14b8a6',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(20,184,166,0.08)' : '#ccfbf1'),
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 2 }}>{t("mortgage.advanced.loan1")}</Typography>
              <Stack spacing={2}>
                <TextField
                  label={t("mortgage.advanced.loanAmount")}
                  value={formatWithCommas(loanA.loanAmount)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/,/g, "");
                    if (allowNumeric(val)) setLoanA({ ...loanA, loanAmount: val });
                  }}
                  InputProps={{ startAdornment: <span style={{ marginRight: 8 }}>$</span> }}
                  fullWidth
                />
                <TextField
                  label={t("mortgage.advanced.loanTermYears")}
                  value={loanA.loanTerm}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (allowNumeric(val)) setLoanA({ ...loanA, loanTerm: val });
                  }}
                  fullWidth
                />
                <TextField
                  label={t("mortgage.advanced.interestRatePercent")}
                  value={loanA.interestRate}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (allowNumeric(val)) setLoanA({ ...loanA, interestRate: val });
                  }}
                  InputProps={{ endAdornment: <span style={{ marginLeft: 8 }}>%</span> }}
                  fullWidth
                />

                <Divider sx={{ my: 1 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>{t("mortgage.advanced.estimatedMonthly")}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {formatCurrency(resultA.monthly)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>{t("mortgage.advanced.totalInterest")}</Typography>
                    <Typography sx={{ fontWeight: 700, color: '#14b8a6' }}>{formatCurrency(resultA.totalInterest)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>{t("mortgage.advanced.totalPaid")}</Typography>
                    <Typography sx={{ fontWeight: 700, color: '#14b8a6' }}>{formatCurrency(resultA.totalPaid)}</Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: '#1976d2', // teal-500
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(20,184,166,0.08)' : '#e3f2fd'), // teal-100
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 2 }}>{t("mortgage.advanced.loan2")}</Typography>
              <Stack spacing={2}>
                <TextField
                  label={t("mortgage.advanced.loanAmount")}
                  value={formatWithCommas(loanB.loanAmount)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/,/g, "");
                    if (allowNumeric(val)) setLoanB({ ...loanB, loanAmount: val });
                  }}
                  InputProps={{ startAdornment: <span style={{ marginRight: 8 }}>$</span> }}
                  fullWidth
                />
                <TextField
                  label={t("mortgage.advanced.loanTermYears")}
                  value={loanB.loanTerm}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (allowNumeric(val)) setLoanB({ ...loanB, loanTerm: val });
                  }}
                  fullWidth
                />
                <TextField
                  label={t("mortgage.advanced.interestRatePercent")}
                  value={loanB.interestRate}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (allowNumeric(val)) setLoanB({ ...loanB, interestRate: val });
                  }}
                  InputProps={{ endAdornment: <span style={{ marginLeft: 8 }}>%</span> }}
                  fullWidth
                />

                <Divider sx={{ my: 1 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>{t("mortgage.advanced.estimatedMonthly")}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {formatCurrency(resultB.monthly)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>{t("mortgage.advanced.totalInterest")}</Typography>
                    <Typography sx={{ fontWeight: 700, color: '#1976d2' }}>{formatCurrency(resultB.totalInterest)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>{t("mortgage.advanced.totalPaid")}</Typography>
                    <Typography sx={{ fontWeight: 700, color: '#1976d2' }}>{formatCurrency(resultB.totalPaid)}</Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Grid>

        </Grid>

          {/* Summary row */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: 'flex',
                  gap: 6,
                  flexWrap: 'wrap',
                  bgcolor: '#1976d2', // teal-500
                  color: '#ffffff',
                  p: 2.5,
                  borderRadius: 2,
                  alignItems: 'baseline',
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 700 }}>
                    {t("mortgage.advanced.monthlyDifference")}
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatCurrency(resultB.monthly - resultA.monthly)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 700 }}>
                    {t("mortgage.advanced.interestDifference")}
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatCurrency(resultB.totalInterest - resultA.totalInterest)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
          </AccordionDetails>
        </Accordion>

        {/* Income-Based Maximum Purchase Price section */}
        <Accordion sx={{ borderRadius: 2, boxShadow: 'none', mt: 2, ...(OPTION_A_TEAL && { bgcolor: '#E9F9F8' }) }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              borderRadius: 2,
              pr: 1,
              '& .MuiAccordionSummary-content': { m: 0 },
              '& .MuiAccordionSummary-expandIconWrapper': {
                width: 36,
                height: 36,
                borderRadius: '9999px',
                bgcolor: '#1976d2',
                color: '#fff',
                border: '2px solid #1565c0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all .2s ease',
              },
              '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                bgcolor: '#1565c0',
                borderColor: '#0d47a1',
              },
              '& .MuiAccordionSummary-expandIconWrapper:hover': {
                filter: 'brightness(1.05)',
              },
              '& .MuiSvgIcon-root': { fontSize: '1.25rem' },
              ...(OPTION_A_TEAL && { bgcolor: '#E9F9F8' }),
            }}
          >
            <Typography sx={{ fontWeight: 700 }}>
              {t("tools.affordability")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ borderRadius: 2, ...(OPTION_A_TEAL && { bgcolor: '#E9F9F8' }) }}>
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                alignItems: 'flex-start',
                // Allow wrapping until large screens to avoid overflow on mid widths
                flexWrap: { xs: 'wrap', lg: 'nowrap' },
              }}
            >
              <Box
                sx={{
                  // Inputs take full width on small/medium, constrain on large
                  flex: { xs: '1 1 100%', lg: '1 1 500px' },
                  width: { xs: '100%', lg: 'auto' },
                  maxWidth: { lg: 560 },
                  minWidth: { sm: 280, lg: 360 },
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(140px, 1fr))' },
                  columnGap: 2,
                  rowGap: 2,
                }}
              >
                <TextField
                  label={t("mortgage.advanced.annualGrossIncome")}
                  value={formatWithCommas(afford.incomeAnnual)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/,/g, "");
                    if (allowNumeric(val)) setAfford({ ...afford, incomeAnnual: val });
                  }}
                  InputProps={{ startAdornment: <span style={{ marginRight: 8 }}>$</span> }}
                  size="small"
                  fullWidth
                />
                <TextField
                  label={t("mortgage.advanced.maxHousingRatio")}
                  value={afford.ratioPct}
                  onChange={(e) => { const v=e.target.value; if (allowNumeric(v)) setAfford({ ...afford, ratioPct: v }); }}
                  size="small"
                  fullWidth
                />
                <TextField
                  label={t("mortgage.advanced.loanTermYearsLabel")}
                  value={afford.termYears}
                  onChange={(e) => { const v=e.target.value; if (allowNumeric(v)) setAfford({ ...afford, termYears: v }); }}
                  size="small"
                  fullWidth
                />
                <TextField
                  label={t("mortgage.advanced.interestRateLabel")}
                  value={afford.ratePct}
                  onChange={(e) => { const v=e.target.value; if (allowNumeric(v)) setAfford({ ...afford, ratePct: v }); }}
                  InputProps={{ endAdornment: <span style={{ marginLeft: 8 }}>%</span> }}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                />
                <TextField
                  label={t("mortgage.advanced.totalHouseholdDebt")}
                  value={formatWithCommas(afford.debtMonthly)}
                  onChange={(e) => { const v=e.target.value.replace(/,/g,''); if (allowNumeric(v)) setAfford({ ...afford, debtMonthly: v }); }}
                  InputProps={{ startAdornment: <span style={{ marginRight: 8 }}>$</span> }}
                  placeholder={t("mortgage.advanced.sumOfMonthlyPayments")}
                  size="small"
                  sx={{ '& .MuiInputBase-input::placeholder': { fontSize: '0.75rem' } }}
                  fullWidth
                />
                {renderDownPaymentEmbedded()}
                <TextField
                  label={t("mortgage.advanced.annualInsurance")}
                  value={formatWithCommas(afford.insuranceAnnual)}
                  onChange={(e) => { const v=e.target.value.replace(/,/g,''); if (allowNumeric(v)) setAfford({ ...afford, insuranceAnnual: v }); }}
                  InputProps={{ startAdornment: <span style={{ marginRight: 8 }}>$</span> }}
                  size="small"
                  fullWidth
                />
                {renderPropertyTaxEmbedded()}
                <TextField
                  label={t("mortgage.advanced.hoaFeesMonthly")}
                  value={formatWithCommas(afford.hoaMonthly)}
                  onChange={(e) => { const v=e.target.value.replace(/,/g,''); if (allowNumeric(v)) setAfford({ ...afford, hoaMonthly: v }); }}
                  InputProps={{ startAdornment: <span style={{ marginRight: 8 }}>$</span> }}
                  size="small"
                  fullWidth
                />
              </Box>

              <Box
                sx={{
                  // Summary card spans full width when wrapped; fixed column on large screens
                  flex: { xs: '1 1 100%', lg: '0 0 360px' },
                  width: { xs: '100%', lg: 360 },
                  minWidth: { lg: 320 },
                  maxWidth: { lg: 360 },
                  alignSelf: 'flex-start',
                  // Keep visible while scrolling on large screens
                  position: { lg: 'sticky' },
                  top: { lg: 16 },
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    borderWidth: 2,
                    borderStyle: 'solid',
                    borderColor: '#E5E7EB',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'background.paper' : '#F9FAFB'),
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ bgcolor: '#1976d2', color: '#fff', mx: -2, mt: -2, px: 2, py: 1.5 }}>
                    <Typography sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>{t("mortgage.advanced.maxPurchasePrice")}</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 0 }}>
                      {formatCurrency(affordability.homePrice)}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>

                  <Divider sx={{ my: 1 }} />

                  <Stack direction="row" spacing={4} sx={{ mb: 1, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t("mortgage.advanced.estimatedLoanAmount")}</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{formatCurrency(affordability.loanAmount)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t("mortgage.advanced.downPaymentLabel")}</Typography>
                      <Typography sx={{ fontWeight: 700 }}>
                        {formatCurrency(affordability.downAmount)} ({affordability.downPercent.toFixed(1)}%)
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 1 }} />

                  <Typography sx={{ fontWeight: 700, mb: 1 }}>{t("mortgage.advanced.estimatedMonthlyPayment")}</Typography>
                  <Stack spacing={0.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>{t("mortgage.advanced.principalInterest")}</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{formatCurrency(affordability.principalAndInterest)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>{t("mortgage.advanced.taxes")}</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{formatCurrency(affordability.monthlyPropertyTax)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>{t("mortgage.advanced.insurance")}</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{formatCurrency(affordability.insuranceMonthly)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>{t("mortgage.advanced.hoa")}</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{formatCurrency(affordability.hoaMonthly)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>{t("mortgage.advanced.total")}</Typography>
                      <Typography sx={{ fontWeight: 800 }}>{formatCurrency(affordability.totalMonthly)}</Typography>
                    </Box>
                  </Stack>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Paper>
  );
}
