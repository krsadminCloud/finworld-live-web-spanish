import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation, Trans } from "react-i18next";
import Layout from "./components/Layout";
import PaymentBreakdown from "./components/PaymentBreakdown";
import AdvancedSection from "./components/AdvancedSection";
import RateCards from "./components/RateCards";
import LenderPartners from "./components/LenderPartners";
import { calculateMortgage } from "./utils/mortgageCalculations";
import { Box } from "@mui/material";
import i18n from "../../../i18n";

const initialInputs = {
  homePrice: "",
  downPayment: "",
  downPaymentMode: "percent", // 'amount' | 'percent'
  downPaymentPercent: "",
  loanTerm: "30",
  interestRate: "",
  state: "",
  propertyTax: "",
  homeInsurance: "",
  pmi: "",
  hoaFees: "",
  creditScore: "Excellent (740+)",
};

export default function MortgageCalculator() {
  const { t } = useTranslation();
  console.log("[CalcPage] i18n.language:", i18n.language, "sample nav.home:", t("nav.home"));
  const [inputs, setInputs] = React.useState(initialInputs);
  const [results, setResults] = React.useState(null);
  const loc = typeof window !== "undefined" && window.location ? window.location : null;
  const canonicalUrl = loc ? `${loc.origin}${loc.pathname}` : "https://www.finworld.live/tools/mortgage-calculator";

  const handleCalculate = React.useCallback(() => {
    const homePrice = parseFloat(inputs.homePrice.replace(/,/g, "")) || 0;
    const downPayment =
      inputs.downPaymentMode === "percent"
        ? (homePrice * (parseFloat(inputs.downPaymentPercent) || 0)) / 100
        : parseFloat(inputs.downPayment.replace(/,/g, "")) || 0;
    const loanTerm = parseFloat(inputs.loanTerm) || 30;
    const interestRate = parseFloat(inputs.interestRate) || 0;
    const propertyTax = parseFloat(inputs.propertyTax) || 0;
    const homeInsurance = parseFloat(inputs.homeInsurance) || 0;
    const pmi = parseFloat(inputs.pmi) || 0;
    const hoaFees = parseFloat(inputs.hoaFees) || 0;

    const calculationResults = calculateMortgage({
      homePrice,
      downPayment,
      loanTerm,
      interestRate,
      propertyTax,
      homeInsurance,
      pmi,
      hoaFees,
    });

    setResults(calculationResults);
  }, [inputs]);

  const handleReset = React.useCallback(() => {
    setInputs(initialInputs);
    setResults(null); // Clear results when inputs are reset
  }, []);

  React.useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <>
      <Helmet>
        <title>{t('tools_mortgage.meta.title')}</title>
        <meta
          name="description"
          content={t('tools_mortgage.meta.desc')}
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t('tools_mortgage.meta.title')} />
        <meta
          property="og:description"
          content={t('tools_mortgage.meta.desc')}
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://www.finworld.live/assets/finworld-preview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('tools_mortgage.meta.title')} />
        <meta
          name="twitter:description"
          content={t('tools_mortgage.meta.desc')}
        />
        <meta name="twitter:image" content="https://www.finworld.live/assets/finworld-preview.png" />
        <script
          type="application/ld+json"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "FinWorld Mortgage Calculator",
            operatingSystem: "All",
            applicationCategory: "FinanceApplication",
            browserRequirements: "Requires JavaScript",
            url: canonicalUrl,
            description: t('tools_mortgage.meta.desc'),
          })}
        </script>
        <script
          type="application/ld+json"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: t('tools_mortgage.faq.q1'),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: t('tools_mortgage.faq.a1'),
                },
              },
              {
                "@type": "Question",
                name: t('tools_mortgage.faq.q2'),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: t('tools_mortgage.faq.a2'),
                },
              },
              {
                "@type": "Question",
                name: t('tools_mortgage.faq.q3'),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: t('tools_mortgage.faq.a3'),
                },
              },
              {
                "@type": "Question",
                name: t('tools_mortgage.faq.q4'),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: t('tools_mortgage.faq.a4'),
                },
              },
              {
                "@type": "Question",
                name: t('tools_mortgage.faq.q5'),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: t('tools_mortgage.faq.a5'),
                },
              },
              {
                "@type": "Question",
                name: t('tools_mortgage.faq.q6'),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: t('tools_mortgage.faq.a6'),
                },
              },
              {
                "@type": "Question",
                name: t('tools_mortgage.faq.q7'),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: t('tools_mortgage.faq.a7'),
                },
              },
            ],
          })}
        </script>
      </Helmet>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)"
              : "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
        }}
      >
        <Layout inputs={inputs} setInputs={setInputs} onCalculate={handleCalculate} onReset={handleReset}>
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: '100%', md: '90%', lg: '70%' },
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2, sm: 3, md: 6 },
          }}
        >
          <PaymentBreakdown results={results} inputs={inputs} />
          <AdvancedSection />
          <RateCards />
          <LenderPartners />
          <div className="mt-8 text-center">
            <a
              href="/guides/how-to-use-mortgage-calculator"
              className="text-blue-600 underline"
            >
              {t('tools_mortgage.guide_link')}
            </a>
          </div>
          <section className="mt-12 prose max-w-none">
            <h2>{t('tools_mortgage.sections.overview_title')}</h2>
            <p>
              {t('tools_mortgage.sections.overview_p1')}
            </p>
            <p>
              {t('tools_mortgage.sections.overview_p2')}
            </p>

            <h2>{t('tools_mortgage.sections.howto_title')}</h2>
            <p>
              {t('tools_mortgage.sections.howto_p1')}
            </p>
            <p>
              {t('tools_mortgage.sections.howto_p2')}
            </p>

            <h2>{t('tools_mortgage.sections.examples_title')}</h2>
            <p>
              {t('tools_mortgage.sections.examples_p1')}
            </p>
            <p>
              {t('tools_mortgage.sections.examples_p2')}
            </p>
            <p>
              {t('tools_mortgage.sections.examples_p3')}
            </p>

            <h2>{t('tools_mortgage.sections.mistakes_title')}</h2>
            <p>
              {t('tools_mortgage.sections.mistakes_p1')}
            </p>
            <p>
              {t('tools_mortgage.sections.mistakes_p2')}
            </p>

            <h2>{t('tools_mortgage.sections.terms_title')}</h2>
            <p>
              <Trans i18nKey="tools_mortgage.sections.terms_p1" />
            </p>
            <p>
              <Trans i18nKey="tools_mortgage.sections.terms_p2" />
            </p>

            <h2>{t('tools_mortgage.sections.faq_title')}</h2>
            <p><strong>{t('tools_mortgage.faq.q1')}</strong></p>
            <p>
              {t('tools_mortgage.faq.a1')}
            </p>
            <p><strong>{t('tools_mortgage.faq.q2')}</strong></p>
            <p>
              {t('tools_mortgage.faq.a2')}
            </p>
            <p><strong>{t('tools_mortgage.faq.q3')}</strong></p>
            <p>
              {t('tools_mortgage.faq.a3')}
            </p>
            <p><strong>{t('tools_mortgage.faq.q4')}</strong></p>
            <p>
              {t('tools_mortgage.faq.a4')}
            </p>
            <p><strong>{t('tools_mortgage.faq.q5')}</strong></p>
            <p>
              {t('tools_mortgage.faq.a5')}
            </p>
            <p><strong>{t('tools_mortgage.faq.q6')}</strong></p>
            <p>
              {t('tools_mortgage.faq.a6')}
            </p>

            <h2>{t('tools_mortgage.sections.related_title')}</h2>
            <p>
              <Trans i18nKey="tools_mortgage.sections.related_p1">
                Once you understand your potential mortgage payment, you can explore other FinWorld tools to round out your decision-making. The <a href="/tools/home-affordability">Home Affordability Calculator</a> helps you estimate a comfortable price range based on your income and debts.
              </Trans>
            </p>
            <p>
              <Trans i18nKey="tools_mortgage.sections.related_p2">
                To explore payoff strategies, try the <a href="/tools/extra-payment">Loan Payoff &amp; Extra Payment Calculator</a>, which models how additional principal payments can shorten your term and reduce interest. If you are evaluating a property as an investment, the <a href="/tools/rental-property-calculator">Rental Property Calculator</a> lets you project cash flow and returns.
              </Trans>
            </p>
            <p>
              <Trans i18nKey="tools_mortgage.sections.related_p3">
                For broader planning, use the <a href="/tools/compounding-calculator">Compounding Calculator</a> to see how your savings grow over time, or the <a href="/tools/buy-vs-lease-auto">Buy vs Lease Auto Calculator</a> to compare borrowing decisions in other parts of your financial life. Together, these tools help you see how your mortgage fits into your overall money picture.
              </Trans>
            </p>
          </section>
        </Box>
        </Layout>
      </Box>
    </>
  );
}
