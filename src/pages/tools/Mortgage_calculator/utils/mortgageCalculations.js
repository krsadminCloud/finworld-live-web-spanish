export function calculateMortgage({
  homePrice,
  downPayment,
  loanTerm,
  interestRate,
  propertyTax,
  homeInsurance,
  pmi,
  hoaFees,
}) {
  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  let principalAndInterest = 0;
  if (monthlyRate === 0) {
    principalAndInterest = loanAmount / numberOfPayments;
  } else {
    principalAndInterest =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  const monthlyPropertyTax = propertyTax / 12;
  const monthlyInsurance = homeInsurance / 12;
  const monthlyPMI = pmi;
  const monthlyHOA = hoaFees;

  const totalMonthlyPayment =
    principalAndInterest +
    monthlyPropertyTax +
    monthlyInsurance +
    monthlyPMI +
    monthlyHOA;

  const totalInterest =
    principalAndInterest * numberOfPayments - loanAmount;

  const totalCost =
    totalMonthlyPayment * numberOfPayments + downPayment;

  const downPaymentPercentage = (downPayment / homePrice) * 100;

  const amortizationSchedule = generateAmortizationSchedule(
    loanAmount,
    monthlyRate,
    numberOfPayments,
    principalAndInterest
  );

  return {
    loanAmount,
    principalAndInterest,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyPMI,
    monthlyHOA,
    totalMonthlyPayment,
    totalInterest,
    totalCost,
    downPaymentPercentage,
    amortizationSchedule,
  };
}

function generateAmortizationSchedule(
  loanAmount,
  monthlyRate,
  numberOfPayments,
  monthlyPayment
) {
  const schedule = [];
  let remainingBalance = loanAmount;

  for (let month = 1; month <= numberOfPayments; month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingBalance -= principalPayment;

    if (month <= 360) {
      schedule.push({
        month,
        principalPayment,
        interestPayment,
        totalPayment: monthlyPayment,
        remainingBalance: Math.max(0, remainingBalance),
      });
    }
  }

  return schedule;
}

export function formatCurrency(value) {
  if (typeof value !== "number") return "$0";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatCurrencyDetailed(value) {
  if (typeof value !== "number") return "$0.00";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function calculatePayoffDate(loanTerm) {
  const currentDate = new Date();
  const payoffDate = new Date(currentDate);
  payoffDate.setFullYear(payoffDate.getFullYear() + loanTerm);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[payoffDate.getMonth()]} ${payoffDate.getFullYear()}`;
}

export function prepareLoanEstimateChartData(amortizationSchedule, loanAmount) {
  const years = [];
  const principalPaidData = [];
  const interestPaidData = [];
  const loanBalanceData = [];

  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;

  const totalMonths = amortizationSchedule.length;
  const yearInterval = Math.ceil(totalMonths / 12 / 4);

  amortizationSchedule.forEach((payment, index) => {
    cumulativePrincipal += payment.principalPayment;
    cumulativeInterest += payment.interestPayment;

    if (index === 0 || (index + 1) % (yearInterval * 12) === 0 || index === totalMonths - 1) {
      const year = Math.floor(new Date().getFullYear() + (index + 1) / 12);
      years.push(year);
      principalPaidData.push(cumulativePrincipal);
      interestPaidData.push(cumulativeInterest);
      loanBalanceData.push(payment.remainingBalance);
    }
  });

  return {
    years,
    principalPaidData,
    interestPaidData,
    loanBalanceData,
    cumulativePrincipal,
    cumulativeInterest,
    finalBalance: amortizationSchedule[amortizationSchedule.length - 1]?.remainingBalance || 0,
  };
}
