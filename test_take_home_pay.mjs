import { calcFederalTax, calcStateTax, calcFicaTax } from "./src/pages/tools/take_home_pay/utils/taxCalculations.js";

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
  const result = {totalIncome, k401Total, preTaxDeductions, adjustedIncome, rothTotal, federalTax, stateTax, stateInfo, stateMarginalRate, ficaTax, localTax, totalTax, netPay, finalNet, finalNetMonthly: finalNet/12, netMonthly: netPay/12, netBiweekly: netPay/26, netWeekly: netPay/52, federalTaxable: fedResult.taxable, federalMarginalRate: fedResult.marginalRate, federalStdDeduction: fedResult.std};
  return result;
}

const scenario = runScenario({year:2025,state:'NY',status:'mfj',income:120000,spouseIncome:80000,k401Percent:5,spouseK401Percent:5,healthInsurance:4800,hsa:3850,localTaxRate:0,rothAmount:7000,spouseRothAmount:7000});
console.log(JSON.stringify(scenario, null, 2));
