import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Grid,
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Layout from './components/Layout';
import { InfoChip } from './components/InfoChip';
import { TaxChart } from './components/TaxChart';
import { Tooltip } from './components/Tooltip';
import { STATES_LIST } from './utils/taxData';
import { calcFederalTax, calcStateTax, calcFicaTax, formatCurrency } from './utils/taxCalculations';

export default function TakeHomePayCalculator() {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [inputs, setInputs] = useState({
    income: 0,
    spouseIncome: 0,
    year: 2025,
    state: '',
    status: 'single',
    k401Percent: 0,
    spouseK401Percent: 0,
    rothAmount: 0,
    spouseRothAmount: 0,
    healthInsurance: 0,
    hsa: 0,
    traditionalIra: 0,
    studentLoanInterest: 0,
    fsaContribution: 0,
    otherPreTaxDeductions: 0,
    childTaxCredit: 0,
    dependentCareCredit: 0,
    childDependentCareExpenses: 0,
    localTaxRate: 0,
  });

  const [result, setResult] = useState(null);
  const [compareStates, setCompareStates] = useState(['', '']);
  const [bonusAmount, setBonusAmount] = useState(0);
  const [bonusResult, setBonusResult] = useState('');
  const [offer1Income, setOffer1Income] = useState(0);
  const [offer2Income, setOffer2Income] = useState(0);
  const [offerComparison, setOfferComparison] = useState('');

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputs]);

  const calculateResults = () => {
    const totalIncome = inputs.income + inputs.spouseIncome;
    if (!totalIncome) {
      return;
    }

    const k401_1 = Math.max(0, inputs.income * (inputs.k401Percent / 100));
    const k401_2 = Math.max(0, inputs.spouseIncome * (inputs.spouseK401Percent / 100));
    const k401Total = k401_1 + k401_2;

    const preTaxDeductions =
      k401Total +
      inputs.healthInsurance +
      inputs.hsa +
      inputs.traditionalIra +
      inputs.studentLoanInterest +
      inputs.fsaContribution +
      inputs.otherPreTaxDeductions;

    const adjustedIncome = Math.max(0, totalIncome - preTaxDeductions);
    const rothTotal = inputs.rothAmount + inputs.spouseRothAmount;

    const fedResult = calcFederalTax(inputs.year, adjustedIncome, inputs.status);
    const federalTax = Math.max(
      0,
      fedResult.tax - inputs.childTaxCredit - inputs.dependentCareCredit
    );

    let stateTax;
    let stateInfo;
    let stateMarginalRate;

    if (inputs.overrideStateRate !== undefined) {
      stateTax = adjustedIncome * (inputs.overrideStateRate / 100);
      stateInfo = `Override ${inputs.overrideStateRate.toFixed(2)}%`;
      stateMarginalRate = inputs.overrideStateRate / 100;
    } else {
      const stateResult = calcStateTax(adjustedIncome, inputs.state);
      stateTax = stateResult.tax;
      stateInfo = stateResult.info;
      stateMarginalRate = stateResult.marginalRate;
    }

    const ficaTax = calcFicaTax(inputs.year, totalIncome, inputs.status);
    const localTax = adjustedIncome * (inputs.localTaxRate / 100);
    const totalTax = federalTax + stateTax + ficaTax + localTax;
    const netPay = totalIncome - totalTax - preTaxDeductions;
    const finalNet = Math.max(0, netPay - rothTotal);

    setResult({
      grossIncome: totalIncome,
      preTaxDeductions,
      adjustedIncome,
      federalTax,
      stateTax,
      ficaTax,
      localTax,
      totalTax,
      netPay,
      finalNet,
      rothContributions: rothTotal,
      federalTaxable: fedResult.taxable,
      federalMarginalRate: fedResult.marginalRate,
      federalStdDeduction: fedResult.std,
      stateMarginalRate,
      stateInfo,
      k401Total,
      netMonthly: netPay / 12,
      netBiweekly: netPay / 26,
      netWeekly: netPay / 52,
      finalNetMonthly: finalNet / 12,
    });
  };

  const handleReset = () => {
    setInputs({
      income: 0,
      spouseIncome: 0,
      year: 2025,
      state: '',
      status: 'single',
      k401Percent: 0,
      spouseK401Percent: 0,
      rothAmount: 0,
      spouseRothAmount: 0,
      healthInsurance: 0,
      hsa: 0,
      traditionalIra: 0,
      studentLoanInterest: 0,
      fsaContribution: 0,
      otherPreTaxDeductions: 0,
      childTaxCredit: 0,
      dependentCareCredit: 0,
      childDependentCareExpenses: 0,
      localTaxRate: 0,
    });
    setResult(null);
    setCompareStates(['', '']);
    setBonusAmount(0);
    setBonusResult('');
    setOffer1Income(0);
    setOffer2Income(0);
    setOfferComparison('');
  };

  const calculateComparisonForState = (state) => {
    if (!result) return null;

    const stateResult =
      inputs.overrideStateRate !== undefined
        ? {
            tax: result.adjustedIncome * (inputs.overrideStateRate / 100),
            info: `Override ${inputs.overrideStateRate.toFixed(2)}%`,
          }
        : calcStateTax(result.adjustedIncome, state);

    const netS = result.grossIncome - result.federalTax - stateResult.tax - result.ficaTax - result.localTax - result.k401Total;
    const finalS = Math.max(0, netS - result.rothContributions);

    return {
      state,
      stateTax: stateResult.tax,
      netAnnual: netS,
      afterRothAnnual: finalS,
      monthly: finalS / 12,
      biweekly: finalS / 26,
      weekly: finalS / 52,
      info: stateResult.info,
    };
  };

  const calculateBonus = () => {
    if (!result || !bonusAmount) {
      setBonusResult('Please enter a bonus amount.');
      return;
    }

    const totalIncomeWithBonus = result.grossIncome + bonusAmount;
    const adjIncomeWithBonus = Math.max(0, totalIncomeWithBonus - result.preTaxDeductions);
    const fedResultWithBonus = calcFederalTax(inputs.year, adjIncomeWithBonus, inputs.status);
    const fedTaxWithBonus = Math.max(
      0,
      fedResultWithBonus.tax - inputs.childTaxCredit - inputs.dependentCareCredit
    );

    const stateTaxWithBonus =
      inputs.overrideStateRate !== undefined
        ? adjIncomeWithBonus * (inputs.overrideStateRate / 100)
        : calcStateTax(adjIncomeWithBonus, inputs.state).tax;

    const ficaTaxWithBonus = calcFicaTax(inputs.year, totalIncomeWithBonus, inputs.status);
    const localTaxWithBonus = adjIncomeWithBonus * (inputs.localTaxRate / 100);
    const totalTaxWithBonus = fedTaxWithBonus + stateTaxWithBonus + ficaTaxWithBonus + localTaxWithBonus;
    const netWithBonus = totalIncomeWithBonus - totalTaxWithBonus - result.preTaxDeductions;
    const finalNetWithBonus = Math.max(0, netWithBonus - result.rothContributions);

    const bonusTakeHome = finalNetWithBonus - result.finalNet;
    setBonusResult(`Original Annual Net: ${formatCurrency(result.finalNet)} | New Annual Net (with bonus): ${formatCurrency(finalNetWithBonus)} | Bonus Take-Home: ${formatCurrency(bonusTakeHome)}`);
  };

  const compareOffers = () => {
    if (!offer1Income || !offer2Income) {
      setOfferComparison('Please enter both offer incomes.');
      return;
    }

    const calculateOfferNet = (offerIncome) => {
      const offerAdjIncome = Math.max(0, offerIncome - (result?.preTaxDeductions || 0));
      const offerFedResult = calcFederalTax(inputs.year, offerAdjIncome, inputs.status);
      const offerFedTax = Math.max(
        0,
        offerFedResult.tax - inputs.childTaxCredit - inputs.dependentCareCredit
      );

      const offerStateTax =
        inputs.overrideStateRate !== undefined
          ? offerAdjIncome * (inputs.overrideStateRate / 100)
          : calcStateTax(offerAdjIncome, inputs.state).tax;

      const offerFicaTax = calcFicaTax(inputs.year, offerIncome, inputs.status);
      const offerLocalTax = offerAdjIncome * (inputs.localTaxRate / 100);
      const offerTotalTax = offerFedTax + offerStateTax + offerFicaTax + offerLocalTax;
      const offerNet = offerIncome - offerTotalTax - (result?.preTaxDeductions || 0);
      return Math.max(0, offerNet - (result?.rothContributions || 0));
    };

    const offer1Net = calculateOfferNet(offer1Income);
    const offer2Net = calculateOfferNet(offer2Income);

    setOfferComparison(
      `Offer 1: ${formatCurrency(offer1Income)} → ${formatCurrency(offer1Net)} net (${formatCurrency(offer1Net / 12)}/mo) | ` +
      `Offer 2: ${formatCurrency(offer2Income)} → ${formatCurrency(offer2Net)} net (${formatCurrency(offer2Net / 12)}/mo)`
    );
  };

  const comparisonResults = compareStates
    .filter((state) => state)
    .map((state) => calculateComparisonForState(state))
    .filter((r) => r !== null);

  return (
    <Layout
      inputs={inputs}
      onInputChange={handleInputChange}
      onReset={handleReset}
      advancedOpen={advancedOpen}
      setAdvancedOpen={setAdvancedOpen}
    >
      <Box sx={{ width: '100%', maxWidth: 960 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: '-0.02em' }}>
            U.S. Take-Home Pay Calculator
          </Typography>
        </Box>

        <Stack spacing={3}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Annual Take-Home Pay
                  </Typography>
                  <Typography variant="h3" color="success.main" fontWeight={700} sx={{ mt: 1 }}>
                    {result ? formatCurrency(result.netPay) : '$0'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Primary State: {inputs.state || '—'}
                  </Typography>

                  {result && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" sx={{ mt: 2 }}>
                      <InfoChip>
                        <span>
                          Std Deduction
                          <Tooltip text="A fixed dollar amount that reduces your taxable income." />
                        </span>
                        {' '}{formatCurrency(result.federalStdDeduction)}
                      </InfoChip>
                      <InfoChip>
                        <span>
                          Taxable
                          <Tooltip text="Your income after standard deduction." />
                        </span>
                        {' '}{formatCurrency(result.federalTaxable)}
                      </InfoChip>
                      <InfoChip>
                        <span>
                          Federal Marginal
                          <Tooltip text="The tax rate on your last dollar of federal taxable income." />
                        </span>
                        {' '}{(result.federalMarginalRate * 100).toFixed(2)}%
                      </InfoChip>
                      <InfoChip>
                        <span>
                          401(k) per paycheck
                          <Tooltip text="Estimated 401(k) contribution per paycheck." />
                        </span>
                        {' '}{formatCurrency(result.k401Total / 26)}
                      </InfoChip>
                      <InfoChip>
                        <span>
                          State Marginal
                          <Tooltip text="The tax rate on your last dollar of state taxable income." />
                        </span>
                        {' '}{(result.stateMarginalRate * 100).toFixed(2)}%
                      </InfoChip>
                      <InfoChip>{result.stateInfo}</InfoChip>
                    </Stack>
                  )}
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight={600} mb={2}>
                  Breakdown
                </Typography>

                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Gross Income
                      <Tooltip text="Total income before any deductions or taxes." />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" fontWeight={600} textAlign="right">
                      {result ? formatCurrency(result.grossIncome) : '$0'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Federal Tax
                      <Tooltip text="Estimated federal income tax." />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" fontWeight={600} textAlign="right">
                      {result ? formatCurrency(result.federalTax) : '$0'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Pre-Tax 401(k)
                      <Tooltip text="Total pre-tax 401(k) contributions." />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" fontWeight={600} textAlign="right">
                      {result ? formatCurrency(result.k401Total) : '$0'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      State Tax
                      <Tooltip text="Estimated state income tax." />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" fontWeight={600} textAlign="right">
                      {result ? formatCurrency(result.stateTax) : '$0'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Local Tax
                      <Tooltip text="Estimated local income tax." />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" fontWeight={600} textAlign="right">
                      {result ? formatCurrency(result.localTax) : '$0'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total Tax Paid
                      <Tooltip text="Sum of all taxes paid." />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" fontWeight={600} textAlign="right">
                      {result ? formatCurrency(result.totalTax) : '$0'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Taxable Income
                      <Tooltip text="Your income after deductions." />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" fontWeight={600} textAlign="right">
                      {result ? formatCurrency(result.adjustedIncome) : '$0'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Marginal Rate
                      <Tooltip text="Combined federal and state marginal tax rate." />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" fontWeight={600} textAlign="right">
                      {result ? `${((result.federalMarginalRate + result.stateMarginalRate) * 100).toFixed(2)}%` : '0.00%'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight={700} color="success.main">
                      Take-Home Pay
                      <Tooltip text="Your net pay after all deductions and taxes." />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight={700} color="success.main" textAlign="right">
                      {result ? formatCurrency(result.netPay) : '$0'}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {result && (
                  <TaxChart
                    federalTax={result.federalTax}
                    stateTax={result.stateTax}
                    ficaTax={result.ficaTax}
                    localTax={result.localTax}
                    preTaxDeductions={result.preTaxDeductions}
                    rothContributions={result.rothContributions}
                    netPay={result.netPay}
                  />
                )}

                {result && (
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={2}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper', border: 1, borderColor: 'divider', height: '100%' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Monthly
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {formatCurrency(result.netMonthly)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={2}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper', border: 1, borderColor: 'divider', height: '100%' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Biweekly
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {formatCurrency(result.netBiweekly)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={2}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper', border: 1, borderColor: 'divider', height: '100%' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Weekly
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {formatCurrency(result.netWeekly)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={2}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper', border: 1, borderColor: 'divider', height: '100%' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Roth IRA (annual)
                          <Tooltip text="Total post-tax Roth IRA contributions." />
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {formatCurrency(result.rothContributions)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={2}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper', border: 1, borderColor: 'divider', height: '100%' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Final Net (Annual)
                          <Tooltip text="Your total take-home pay after all deductions and Roth contributions." />
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {formatCurrency(result.finalNet)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={2}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper', border: 1, borderColor: 'divider', height: '100%' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Final Net (Monthly)
                          <Tooltip text="Your monthly take-home pay after all deductions and Roth contributions." />
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {formatCurrency(result.finalNetMonthly)}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                )}
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  Compare with...
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={5}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={compareStates[0]}
                        onChange={(e) => setCompareStates([e.target.value, compareStates[1]])}
                        displayEmpty
                      >
                        <MenuItem value="">— Select —</MenuItem>
                        {STATES_LIST.map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      And...
                    </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={compareStates[1]}
                        onChange={(e) => setCompareStates([compareStates[0], e.target.value])}
                        displayEmpty
                      >
                        <MenuItem value="">— Select —</MenuItem>
                        {STATES_LIST.map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Pick up to two states to compare. Tip: Use the override-tax-rate to force a single effective rate to compare apples-to-apples.
                    </Typography>
                  </Grid>
                </Grid>

                {comparisonResults.length > 0 && (
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {comparisonResults.map((comp) => (
                      <Grid item xs={12} md={6} key={comp.state}>
                        <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                          <Typography variant="subtitle1" fontWeight={700} mb={1}>
                            {comp.state}
                          </Typography>
                          <Stack spacing={0.5}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">State tax</Typography>
                              <Typography variant="body2" fontWeight={600}>{formatCurrency(comp.stateTax)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Net (annual)</Typography>
                              <Typography variant="body2" fontWeight={600}>{formatCurrency(comp.netAnnual)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">After Roth (annual)</Typography>
                              <Typography variant="body2" fontWeight={600}>{formatCurrency(comp.afterRothAnnual)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Monthly</Typography>
                              <Typography variant="body2" fontWeight={600}>{formatCurrency(comp.monthly)}</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                              {comp.info}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Paper>

              <MuiAccordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" fontWeight={600}>
                    What-If Scenarios
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} mb={2}>
                        Bonus Impact Calculator
                      </Typography>
                      <TextField
                        label="Bonus Amount ($)"
                        type="number"
                        fullWidth
                        value={bonusAmount || ''}
                        onChange={(e) => setBonusAmount(Number(e.target.value))}
                        placeholder="e.g. 5000"
                        inputProps={{ min: 0, step: 100 }}
                        sx={{ mb: 2 }}
                      />
                      <Button variant="contained" onClick={calculateBonus}>
                        Calculate Bonus Impact
                      </Button>
                      {bonusResult && (
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          {bonusResult}
                        </Typography>
                      )}
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} mb={2}>
                        Job Offer Comparison
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            label="Offer 1 Annual Income ($)"
                            type="number"
                            fullWidth
                            value={offer1Income || ''}
                            onChange={(e) => setOffer1Income(Number(e.target.value))}
                            placeholder="e.g. 100000"
                            inputProps={{ min: 0, step: 100 }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Offer 2 Annual Income ($)"
                            type="number"
                            fullWidth
                            value={offer2Income || ''}
                            onChange={(e) => setOffer2Income(Number(e.target.value))}
                            placeholder="e.g. 110000"
                            inputProps={{ min: 0, step: 100 }}
                          />
                        </Grid>
                      </Grid>
                      <Button variant="contained" onClick={compareOffers} sx={{ mt: 2 }}>
                        Compare Offers
                      </Button>
                      {offerComparison && (
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          {offerComparison}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </AccordionDetails>
              </MuiAccordion>

              <MuiAccordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" fontWeight={600}>
                    How Your Take-Home Pay is Calculated
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Typography variant="body2">
                      Your take-home pay is calculated by starting with your gross income and subtracting various taxes and deductions:
                    </Typography>
                    <Box component="ol" sx={{ pl: 2, '& li': { mb: 1 } }}>
                      <Typography component="li" variant="body2">
                        <strong>Gross Income:</strong> Your total annual salary before any deductions
                      </Typography>
                      <Typography component="li" variant="body2">
                        <strong>Pre-Tax Deductions:</strong> Items like 401(k) contributions, HSA, FSA, and health insurance are subtracted before calculating taxes
                      </Typography>
                      <Typography component="li" variant="body2">
                        <strong>Federal Income Tax:</strong> Calculated using progressive tax brackets based on your filing status
                      </Typography>
                      <Typography component="li" variant="body2">
                        <strong>State Income Tax:</strong> Varies by state; some states have no income tax while others use progressive or flat rates
                      </Typography>
                      <Typography component="li" variant="body2">
                        <strong>FICA Taxes:</strong> Social Security (6.2% up to wage base) and Medicare (1.45%, plus 0.9% for high earners)
                      </Typography>
                      <Typography component="li" variant="body2">
                        <strong>Local Taxes:</strong> Some cities and municipalities impose additional income taxes
                      </Typography>
                      <Typography component="li" variant="body2">
                        <strong>Post-Tax Deductions:</strong> Roth IRA contributions come out after taxes are calculated
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Note: This calculator provides estimates. Actual withholding may vary based on W-4 elections, additional income sources, and other factors. Consult a tax professional for precise calculations.
                    </Typography>
                  </Stack>
                </AccordionDetails>
              </MuiAccordion>
        </Stack>
      </Box>
    </Layout>
  );
}
