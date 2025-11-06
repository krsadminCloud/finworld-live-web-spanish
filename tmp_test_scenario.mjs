import { FICA_LIMITS, FED_STD, FED_BRACKETS, STATE_MODELS } from "./src/pages/tools/take_home_pay/utils/taxData.js";

function calcFederalTax(year, agi, status) {
  const std = (FED_STD[year] || FED_STD[2025])[status] || 0;
  const taxable = Math.max(0, agi - std);
  const brackets = (FED_BRACKETS[year] || FED_BRACKETS[2025])[status] || FED_BRACKETS[2025].single;
  let tax = 0, last = 0, marginalRate = 0;
  for (const [upto, rate] of brackets) {
    const span = Math.min(taxable, upto) - last;
    if (span > 0) { tax += span * rate; last = upto; marginalRate = rate; }
    if (taxable <= upto) break;
  }
  return { tax, taxable, marginalRate, std };
}

function calcStateTax(agi, state) {
  const m = STATE_MODELS[state];
  if (!m) {
    const eff = Math.max(0, Math.min(0.05, (agi - 40000) / 400000));
    return { tax: agi * eff, info: `Estimated ${Math.round(eff * 1000) / 10}%`, marginalRate: eff };
  }
  if (m.type === 'flat') {
    return { tax: agi * (m.rate || 0), info: `Flat ${((m.rate || 0) * 100).toFixed(2)}%`, marginalRate: m.rate || 0 };
  }
  let tax = 0, last = 0, marginal = 0; const taxable = agi - (m.std || 0);
  if (m.brackets) {
    for (const [upto, rate] of m.brackets) {
      const span = Math.min(taxable, upto) - last;
      if (span > 0) { tax += span * rate; last = upto; marginal = rate; }
      if (taxable <= upto) break;
    }
  }
  return { tax, info: `Marginal ${(marginal * 100).toFixed(2)}%`, marginalRate: marginal };
}

function calcFicaTax(year, income, status) {
  const limits = FICA_LIMITS[year] || FICA_LIMITS[2025];
  let socialSecurityTax = Math.min(income, limits.ss_limit) * limits.ss_rate;
  let medicareTax = income * limits.med_rate;
  if (income > limits.add_med_threshold[status]) {
    medicareTax += (income - limits.add_med_threshold[status]) * 0.009;
  }
  return socialSecurityTax + medicareTax;
}

function runScenario({year=2025,state='NY',status='mfj',income=120000,spouseIncome=80000,k401Percent=5,spouseK401Percent=5,healthInsurance=4800,hsa=3850,traditionalIra=0,studentLoanInterest=0,fsaContribution=0,otherPreTaxDeductions=0,localTaxRate=0,overrideStateRate=undefined,rothAmount=7000,spouseRothAmount=7000}){
  const totalIncome = (Number(income)||0) + (Number(spouseIncome)||0);
  const k401_1 = Math.max(0, (Number(income)||0) * ((Number(k401Percent)||0)/100));
  const k401_2 = Math.max(0, (Number(spouseIncome)||0) * ((Number(spouseK401Percent)||0)/100));
  const k401Total = k401_1 + k401_2;
  const preTaxDeductions = k401Total + (Number(healthInsurance)||0) + (Number(hsa)||0) + (Number(traditionalIra)||0) + (Number(studentLoanInterest)||0) + (Number(fsaContribution)||0) + (Number(otherPreTaxDeductions)||0);
  const adjustedIncome = Math.max(0, totalIncome - preTaxDeductions);
  const rothTotal = (Number(rothAmount)||0) + (Number(spouseRothAmount)||0);
  const fedResult = calcFederalTax(year, adjustedIncome, status);
  const federalTax = Math.max(0, fedResult.tax);
  let stateTax, stateInfo, stateMarginalRate;
  if (overrideStateRate !== undefined && overrideStateRate !== null && overrideStateRate !== '') {
    const rate = Number(overrideStateRate) / 100;
    stateTax = adjustedIncome * rate;
    stateInfo = `Override ${Number(overrideStateRate).toFixed(2)}%`;
    stateMarginalRate = rate;
  } else {
    const sres = calcStateTax(adjustedIncome, state);
    stateTax = sres.tax; stateInfo = sres.info; stateMarginalRate = sres.marginalRate;
  }
  const ficaTax = calcFicaTax(year, totalIncome, status);
  const localTax = adjustedIncome * ((Number(localTaxRate)||0)/100);
  const totalTax = federalTax + stateTax + ficaTax + localTax;
  const netPay = totalIncome - totalTax - preTaxDeductions;
  const finalNet = Math.max(0, netPay - rothTotal);
  const result = {grossIncome: totalIncome, preTaxDeductions, adjustedIncome, federalTax, stateTax, ficaTax, localTax, totalTax, netPay, finalNet, rothContributions: rothTotal, federalTaxable: fedResult.taxable, federalMarginalRate: fedResult.marginalRate, federalStdDeduction: fedResult.std, stateMarginalRate, stateInfo, k401Total, netMonthly: netPay/12, netBiweekly: netPay/26, netWeekly: netPay/52, finalNetMonthly: finalNet/12};
  return result;
}

const scenario = runScenario({year:2025,state:'NY',status:'mfj',income:120000,spouseIncome:80000,k401Percent:5,spouseK401Percent:5,healthInsurance:4800,hsa:3850,localTaxRate:0,rothAmount:7000,spouseRothAmount:7000});
console.log(JSON.stringify(scenario, null, 2));
