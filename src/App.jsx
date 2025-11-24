import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ?? Main Page
import Home from "./pages/Home";
import FinancialCalculators from "./pages/tools";
import About from "./pages/About";
import Guides from "./pages/Guides";
import Comparisons from "./pages/Comparisons";
import ArticlePage from "./pages/ArticlePage";

// ?? Lazy-load calculators
const ExtraPayment = lazy(() => import("./pages/tools/extra_payment"));
const TakeHomePayCalculator = lazy(
  () => import("./pages/tools/take_home_pay")
);
const MortgageCalculator = lazy(
  () => import("./pages/tools/Mortgage_calculator")
);
const AutoLoanCalculator = lazy(
  () => import("./pages/tools/auto_loan_calculator/App")
);
const RetirementCalculator = lazy(
  () => import("./pages/tools/retirement_calculator")
);
const AllRates = lazy(
  () => import("./pages/tools/Mortgage_calculator/allrates")
);
const HomeAffordabilityCalculator = lazy(
  () => import("./pages/tools/home_affordability")
);
const CompoundingCalculator = lazy(
  () => import("./pages/tools/compounding_calculator")
);
const BuyVsLeaseAuto = lazy(() => import("./pages/tools/buy_vs_lease_auto"));
const RentalPropertyCalculator = lazy(
  () => import("./pages/tools/rental_property_calculator")
);

// Support legacy underscore routes while aligning with kebab-case SEO slugs
const Redirect = ({ to }) => {
  if (typeof window !== "undefined") {
    window.history.replaceState(null, "", to);
  }
  return null;
};

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
            {/* ?? Home Page */}
            <Route path="/" element={<Home />} />

            {/* ?? Financial Calculators Directory */}
            <Route path="/tools" element={<FinancialCalculators />} />

            {/* ?? Learn / Static Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/comparisons" element={<Comparisons />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />

            {/* ?? Individual Tools - canonical kebab-case routes */}
            <Route path="/tools/extra-payment" element={<ExtraPayment />} />
            <Route
              path="/tools/take-home-pay"
              element={<TakeHomePayCalculator />}
            />
            <Route
              path="/tools/mortgage-calculator"
              element={<MortgageCalculator />}
            />
            <Route
              path="/tools/auto-loan-calculator"
              element={<AutoLoanCalculator />}
            />
            <Route
              path="/tools/retirement-calculator"
              element={<RetirementCalculator />}
            />
            <Route
              path="/tools/home-affordability"
              element={<HomeAffordabilityCalculator />}
            />
            <Route
              path="/tools/mortgage-calculator/allrates"
              element={<AllRates />}
            />
            <Route
              path="/tools/compounding-calculator"
              element={<CompoundingCalculator />}
            />
            <Route
              path="/tools/buy-vs-lease-auto"
              element={<BuyVsLeaseAuto />}
            />
            <Route
              path="/tools/rental-property-calculator"
              element={<RentalPropertyCalculator />}
            />

            {/* ?? Backwards-compatible underscore routes (client redirect) */}
            <Route
              path="/tools/extra_payment"
              element={<Redirect to="/tools/extra-payment" />}
            />
            <Route
              path="/tools/take_home_pay"
              element={<Redirect to="/tools/take-home-pay" />}
            />
            <Route
              path="/tools/mortgage_calculator"
              element={<Redirect to="/tools/mortgage-calculator" />}
            />
            <Route
              path="/tools/auto_loan_calculator"
              element={<Redirect to="/tools/auto-loan-calculator" />}
            />
            <Route
              path="/tools/retirement_calculator"
              element={<Redirect to="/tools/retirement-calculator" />}
            />
            <Route
              path="/tools/home_affordability"
              element={<Redirect to="/tools/home-affordability" />}
            />
            <Route
              path="/tools/compounding_calculator"
              element={<Redirect to="/tools/compounding-calculator" />}
            />
            <Route
              path="/tools/buy_vs_lease_auto"
              element={<Redirect to="/tools/buy-vs-lease-auto" />}
            />
            <Route
              path="/tools/rental_property_calculator"
              element={<Redirect to="/tools/rental-property-calculator" />}
            />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}
