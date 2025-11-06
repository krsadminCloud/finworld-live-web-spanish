import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🏠 Main Page
import Home from "./pages/Home";

// 💵 Financial Tools
import FinancialCalculators from "./pages/tools";
import ExtraPayment from "./pages/tools/extra_payment";
import TakeHomePayCalculator from "./pages/tools/take_home_pay";
import MortgageCalculator from "./pages/tools/Mortgage_calculator";
import AutoLoanCalculator from "./pages/tools/auto_loan_calculator/App";
import RetirementCalculator from "./pages/tools/retirement_calculator";
import AllRates from "./pages/tools/Mortgage_calculator/allrates";
import HomeAffordabilityCalculator from "./pages/tools/home_affordability";
import CompoundingCalculator from "./pages/tools/compounding_calculator";
import BuyVsLeaseAuto from "./pages/tools/buy_vs_lease_auto";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* 🏠 Home Page */}
          <Route path="/" element={<Home />} />

          {/* 💰 Financial Calculators Directory */}
          <Route path="/tools" element={<FinancialCalculators />} />

          {/* 🧾 Extra-Payment / Loan-Payoff Calculator */}
          <Route path="/tools/extra_payment" element={<ExtraPayment />} />

          {/* 🧮 Take-Home-Pay Calculator */}
          <Route path="/tools/take_home_pay" element={<TakeHomePayCalculator />} />

          {/* 🏠 Mortgage Calculator */}
<Route path="/tools/mortgage_calculator" element={<MortgageCalculator />} />
<Route path="/tools/auto_loan_calculator" element={<AutoLoanCalculator />} />

          {/* 💼 Retirement Calculator */}
          <Route path="/tools/retirement_calculator" element={<RetirementCalculator />} />

          {/* 🏡 Home Affordability Calculator */}
          <Route path="/tools/home_affordability" element={<HomeAffordabilityCalculator />} />

          {/* 📊 All Rates Comparison */}
          <Route path="/tools/mortgage_calculator/allrates" element={<AllRates />} />
          {/* ?? Compounding Calculator */}
          <Route path="/tools/compounding_calculator" element={<CompoundingCalculator />} />
          {/* Buy vs Lease Auto */}
          <Route path="/tools/buy_vs_lease_auto" element={<BuyVsLeaseAuto />} />
        </Routes>
      </div>
    </Router>
  );
}
