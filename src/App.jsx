import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🏠 Main Page
import Home from "./pages/Home";
import FinancialCalculators from "./pages/tools";

// 💵 Lazy-load calculators
const ExtraPayment = lazy(() => import("./pages/tools/extra_payment"));
const TakeHomePayCalculator = lazy(() => import("./pages/tools/take_home_pay"));
const MortgageCalculator = lazy(() => import("./pages/tools/Mortgage_calculator"));
const AutoLoanCalculator = lazy(() => import("./pages/tools/auto_loan_calculator/App"));
const RetirementCalculator = lazy(() => import("./pages/tools/retirement_calculator"));
const AllRates = lazy(() => import("./pages/tools/Mortgage_calculator/allrates"));
const HomeAffordabilityCalculator = lazy(() => import("./pages/tools/home_affordability"));
const CompoundingCalculator = lazy(() => import("./pages/tools/compounding_calculator"));
const BuyVsLeaseAuto = lazy(() => import("./pages/tools/buy_vs_lease_auto"));

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Suspense
          fallback={
            <div
              style={{
                textAlign: "center",
                marginTop: "80px",
                color: "#555",
                fontSize: "1.1rem",
              }}
            >
              Loading calculator...
            </div>
          }
        >
          <Routes>
            {/* 🏠 Home Page */}
            <Route path="/" element={<Home />} />

            {/* 💰 Financial Calculators Directory */}
            <Route path="/tools" element={<FinancialCalculators />} />

            {/* 💵 Individual Tools */}
            <Route path="/tools/extra_payment" element={<ExtraPayment />} />
            <Route path="/tools/take_home_pay" element={<TakeHomePayCalculator />} />
            <Route path="/tools/mortgage_calculator" element={<MortgageCalculator />} />
            <Route path="/tools/auto_loan_calculator" element={<AutoLoanCalculator />} />
            <Route path="/tools/retirement_calculator" element={<RetirementCalculator />} />
            <Route path="/tools/home_affordability" element={<HomeAffordabilityCalculator />} />
            <Route path="/tools/mortgage_calculator/allrates" element={<AllRates />} />
            <Route path="/tools/compounding_calculator" element={<CompoundingCalculator />} />
            <Route path="/tools/buy_vs_lease_auto" element={<BuyVsLeaseAuto />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}
