// src/pages/tools/extra_payment/utils/calculateLoanDetails.js
// Bank-style, frequency-aware amortization that returns ONE plan.
// Signature matches index.jsx usage:
//   calculateLoanDetails(amount, rate, years, extraPerPeriod, frequency)

const FREQ_TO_PPY = { Monthly: 12, Biweekly: 26, Weekly: 52 };

function toNumber(x, fallback = 0) {
  if (x === null || x === undefined) return fallback;
  const n = Number(String(x).toString().replace(/,/g, ""));
  return Number.isFinite(n) ? n : fallback;
}

export default function calculateLoanDetails(
  amount,
  aprPercent,
  years,
  extraPerPeriod = 0,
  frequency = "Monthly"
) {
  const P   = toNumber(amount, 0);
  const APR = toNumber(aprPercent, 0) / 100;
  const Y   = toNumber(years, 0);
  const ppy = FREQ_TO_PPY[frequency] || 12;

  // periodic rate & periods
  const r = APR / ppy;
  const n = Math.round(Y * ppy);

  // base payment (no extra)
  let basePayment;
  if (r === 0) basePayment = n > 0 ? P / n : 0;
  else basePayment = (r * P) / (1 - Math.pow(1 + r, -n));

  const extra = Math.max(0, toNumber(extraPerPeriod, 0));

  // amortize
  const schedule = [];
  let balance = P;
  let totalInterest = 0;
  let totalPaid = 0;
  let period = 0;

  // safety cap: allow a lot more periods than planned if extra is tiny
  while (balance > 0 && period < n + 12000) {
    period += 1;

    const interest = balance * r;
    let principal  = basePayment - interest;
    let extraPaid  = extra;

    // prevent overpaying on last period
    if (principal + extraPaid > balance) {
      const needed = Math.max(0, balance);
      principal = Math.min(principal, needed);
      extraPaid = Math.max(0, needed - principal);
    }

    const paymentThisPeriod = principal + interest + extraPaid;

    balance       -= (principal + extraPaid);
    if (balance < 1e-6) balance = 0;

    totalInterest += interest;
    totalPaid     += paymentThisPeriod;

    schedule.push({
      period,
      principal: Number(principal.toFixed(2)),
      interest:  Number(interest.toFixed(2)),
      extraPaid: Number(extraPaid.toFixed(2)),
      balance:   Number(balance.toFixed(2)),
      payment:   Number(paymentThisPeriod.toFixed(2)), // per-period outflow
    });

    if (balance <= 0) break;
  }

  const periodsToPayoff = schedule.length;
  const yearsToPayoff   = periodsToPayoff / ppy;
  const monthsToPayoff  = Math.round((periodsToPayoff * 12) / ppy);

  return {
    schedule,
    totals: {
      totalInterest: Number(totalInterest.toFixed(2)),
      totalPayments: Number(totalPaid.toFixed(2)),
      yearsToPayoff: Number(yearsToPayoff.toFixed(2)),
      monthsToPayoff,
    },
    meta: { paymentsPerYear: ppy },
  };
}
