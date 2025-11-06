import { calcFederalTax, calcStateTax, calcFicaTax } from "./src/pages/tools/take_home_pay/utils/taxCalculations.js";

function calc({year=2025,state='NY',status='mfj',income=120000,spouseIncome=80000,yourBonus=10000,spouseBonus=5000,k401Percent=5,spouseK401Percent=5,k401BaseSelf='salary_plus_bonus',k401BaseSpouse='salary_plus_bonus',healthInsurance=4800,hsa=3850,traditionalIra=0,studentLoanInterest=0,fsaContribution=0,otherPreTaxDeductions=0,localTaxRate=0,rothAmount=7000,spouseRothAmount=7000}){
  const baseSelf = Number(income)||0; const baseSpouse = Number(spouseIncome)||0;
  const bonusSelf = Number(yourBonus)||0; const bonusSpouse = Number(spouseBonus)||0;
  const totalIncome = baseSelf + baseSpouse + bonusSelf + bonusSpouse;
  const your401Base = baseSelf + (k401BaseSelf==='salary_plus_bonus'? bonusSelf : 0);
  const spouse401Base = baseSpouse + (k401BaseSpouse==='salary_plus_bonus'? bonusSpouse : 0);
  const k401_1 = your401Base * ((Number(k401Percent)||0)/100);
  const k401_2 = spouse401Base * ((Number(spouseK401Percent)||0)/100);
  const k401Total = k401_1 + k401_2;
  const preTaxDeductions = k401Total + (Number(healthInsurance)||0) + (Number(hsa)||0) + (Number(traditionalIra)||0) + (Number(studentLoanInterest)||0) + (Number(fsaContribution)||0) + (Number(otherPreTaxDeductions)||0);
  const adjustedIncome = Math.max(0, totalIncome - preTaxDeductions);
  const rothTotal = (Number(rothAmount)||0) + (Number(spouseRothAmount)||0);
  const fedResult = calcFederalTax(year, adjustedIncome, status);
  const federalTax = Math.max(0, fedResult.tax);
  const sres = calcStateTax(adjustedIncome, state); const stateTax = sres.tax;
  const ficaTax = calcFicaTax(year, totalIncome, status);
  const localTax = adjustedIncome * ((Number(localTaxRate)||0)/100);
  const totalTax = federalTax + stateTax + ficaTax + localTax;
  const netPay = totalIncome - totalTax - preTaxDeductions;
  const finalNet = Math.max(0, netPay - rothTotal);
  return {totalIncome,k401_1,k401_2,k401Total,preTaxDeductions,adjustedIncome,federalTax,stateTax,ficaTax,localTax,totalTax,netPay,finalNet};
}

console.log('A Salary+Bonus 401k');
console.log(calc({}).finalNet);
console.log('B Salary only 401k');
console.log(calc({k401BaseSelf:'salary',k401BaseSpouse:'salary'}).finalNet);
