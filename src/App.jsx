// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🏠 Main Page
import Home from "./pages/Home";

// 💵 Financial Tools
import FinancialCalculators from "./pages/tools";
import ExtraPayment from "./pages/tools/extra_payment";
import TakeHomePayCalculator from "./pages/tools/take_home_pay";
import MortgageCalculator from "./pages/tools/Mortgage_calculator";

export default function App() {
  return (
    <Router>
      {/* 🌐 Global layout wrapper */}
      <div className="min-h-screen bg-gray-50 text-gray-900">
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
        </Routes>
      </div>
    </Router>
  );
}
