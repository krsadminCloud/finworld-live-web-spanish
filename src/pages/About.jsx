import React from "react";
import { Box, Container, Typography, Stack, Button } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLanguageRouting } from "../utils/langRouting";
import { useTranslation } from "react-i18next";

export default function About() {
  const location = useLocation();
  const { withLang } = useLanguageRouting();
  const { t } = useTranslation();
  const canonical =
    typeof window !== "undefined"
      ? `${window.location.origin}${location.pathname}`
      : "https://www.finworld.live/en/about";

  return (
    <Box>
      <Helmet>
        <title>About FinWorld | Smart Financial Calculators</title>
        <meta
          name="description"
          content="Learn what FinWorld is, how our free mortgage, tax, and investing calculators work, and how to use them to make smarter money decisions."
        />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <Container sx={{ py: { xs: 6, md: 10 }, maxWidth: "lg" }}>
        <Stack spacing={3}>
          <Typography variant="h3" fontWeight={800}>
            {t("about.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("about.p1")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("about.p2")}
          </Typography>

          <Typography variant="h5" fontWeight={700} sx={{ mt: 4 }}>
            {t("about.start.title")}
          </Typography>
          <Stack spacing={1}>
            <Typography>
              •{" "}
              <RouterLink to={withLang("/tools/mortgage-calculator")}>
                Mortgage Calculator
              </RouterLink>{" "}
              — estimate monthly payments and total interest.
            </Typography>
            <Typography>
              •{" "}
              <RouterLink to={withLang("/tools/take-home-pay")}>
                Take‑Home Pay Calculator
              </RouterLink>{" "}
              — see after‑tax income for different jobs and locations.
            </Typography>
            <Typography>
              •{" "}
              <RouterLink to={withLang("/tools/extra-payment")}>
                Loan Payoff / Extra Payment
              </RouterLink>{" "}
              — compare payoff strategies and interest savings.
            </Typography>
            <Typography>
              •{" "}
              <RouterLink to={withLang("/tools/compounding-calculator")}>
                Compounding Calculator
              </RouterLink>{" "}
              — visualize long‑term investment growth.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              component={RouterLink}
              to={withLang("/tools")}
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              {t("about.cta.explore")}
            </Button>
            <Button
              component={RouterLink}
              to={withLang("/guides")}
              variant="outlined"
              sx={{ textTransform: "none" }}
            >
              {t("about.cta.guides")}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
