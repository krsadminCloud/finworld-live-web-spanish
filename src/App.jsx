import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import i18n, { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, toCanonicalLanguage } from "./i18n";
import { normalizeLanguage } from "./utils/langRouting";

// ?? Main Page
import Home from "./pages/Home";
import FinancialCalculators from "./pages/tools";
import About from "./pages/About";
import Guides from "./pages/Guides";
import Comparisons from "./pages/Comparisons";
import ArticlePage from "./pages/ArticlePage";
import ArticlesIndex from "./pages/ArticlesIndex";

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

const LegacyRedirect = () => {
  const location = useLocation();
  const targetPath = location.pathname === "/" ? "" : location.pathname;
  return (
    <Navigate
      to={`/${DEFAULT_LANGUAGE}${targetPath}${location.search}${location.hash}`}
      replace
    />
  );
};

function LanguageBoundary() {
  const { lang: rawLang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const lang = normalizeLanguage(rawLang);
  const canonical = toCanonicalLanguage(lang);

  // Sync i18n with route language (single source of truth: URL)
  React.useEffect(() => {
    if (i18n.resolvedLanguage !== canonical) {
      console.log("[LangSync] route:", lang, "canonical:", canonical, "current:", i18n.resolvedLanguage);
      i18n.changeLanguage(canonical);
    }
  }, [canonical, lang]);

  React.useEffect(() => {
    if (!SUPPORTED_LANGUAGES.includes((rawLang || "").toLowerCase())) {
      const strippedPath = location.pathname.replace(/^\/[^/]+/, "");
      navigate(`/${DEFAULT_LANGUAGE}${strippedPath}${location.search}${location.hash}`, { replace: true });
      return;
    }
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [rawLang, lang, location.pathname, location.search, location.hash, navigate]);

  return (
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
        <Route path="" element={<Home />} />

        {/* ?? Financial Calculators Directory */}
        <Route path="tools" element={<FinancialCalculators />} />

        {/* ?? Learn / Static Pages */}
        <Route path="about" element={<About />} />
        <Route path="guides" element={<Guides />} />
        <Route path="comparisons" element={<Comparisons />} />
        <Route path="articles" element={<ArticlesIndex />} />
        <Route path="articles/:slug" element={<ArticlePage />} />

        {/* ?? Individual Tools - canonical kebab-case routes */}
        <Route path="tools/extra-payment" element={<ExtraPayment />} />
        <Route path="tools/take-home-pay" element={<TakeHomePayCalculator />} />
        <Route path="tools/mortgage-calculator" element={<MortgageCalculator />} />
        <Route path="tools/auto-loan-calculator" element={<AutoLoanCalculator />} />
        <Route path="tools/retirement-calculator" element={<RetirementCalculator />} />
        <Route path="tools/home-affordability" element={<HomeAffordabilityCalculator />} />
        <Route path="tools/mortgage-calculator/allrates" element={<AllRates />} />
        <Route path="tools/compounding-calculator" element={<CompoundingCalculator />} />
        <Route path="tools/buy-vs-lease-auto" element={<BuyVsLeaseAuto />} />
        <Route path="tools/rental-property-calculator" element={<RentalPropertyCalculator />} />

        {/* ?? Backwards-compatible underscore routes (client redirect) */}
        <Route path="tools/extra_payment" element={<Navigate to="../tools/extra-payment" replace />} />
        <Route path="tools/take_home_pay" element={<Navigate to="../tools/take-home-pay" replace />} />
        <Route path="tools/mortgage_calculator" element={<Navigate to="../tools/mortgage-calculator" replace />} />
        <Route path="tools/auto_loan_calculator" element={<Navigate to="../tools/auto-loan-calculator" replace />} />
        <Route path="tools/retirement_calculator" element={<Navigate to="../tools/retirement-calculator" replace />} />
        <Route path="tools/home_affordability" element={<Navigate to="../tools/home-affordability" replace />} />
        <Route path="tools/compounding_calculator" element={<Navigate to="../tools/compounding-calculator" replace />} />
        <Route path="tools/buy_vs_lease_auto" element={<Navigate to="../tools/buy-vs-lease-auto" replace />} />
        <Route path="tools/rental_property_calculator" element={<Navigate to="../tools/rental-property-calculator" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to={`/${DEFAULT_LANGUAGE}`} replace />} />
          <Route path="/:lang/*" element={<LanguageBoundary />} />
          <Route path="*" element={<LegacyRedirect />} />
        </Routes>
      </div>
    </Router>
  );
}
