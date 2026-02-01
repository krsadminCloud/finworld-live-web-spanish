import React from "react";
import { Box, Container, Typography, Stack, Card, CardContent, Button } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLanguageRouting } from "../utils/langRouting";
import { useTranslation } from "react-i18next";

export default function Comparisons() {
  const location = useLocation();
  const { withLang } = useLanguageRouting();
  const { t } = useTranslation();
  const canonical =
    typeof window !== "undefined"
      ? `${window.location.origin}${location.pathname}`
      : "https://www.finworld.live/en/comparisons";

  return (
    <Box>
      <Helmet>
        <title>Financial Comparisons | FinWorld Tools</title>
        <meta
          name="description"
          content="Compare key financial decisions side by side, such as buy vs lease, renting vs owning, and extra payments vs investing, using FinWorld calculators."
        />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <Container sx={{ py: { xs: 6, md: 10 }, maxWidth: "lg" }}>
        <Stack spacing={4}>
        <Stack spacing={2}>
          <Typography variant="h3" fontWeight={800}>
            {t("comparisons.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("comparisons.intro")}
          </Typography>
        </Stack>

          <Stack spacing={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700}>
                  {t("comparisons.card1.title")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                  {t("comparisons.card1.desc")}
                </Typography>
                <Button
                  component={RouterLink}
                  to={withLang("/tools/buy-vs-lease-auto")}
                  size="small"
                  variant="contained"
                  sx={{ textTransform: "none" }}
                >
                  {t("comparisons.card1.cta")}
                </Button>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700}>
                  {t("comparisons.card2.title")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                  {t("comparisons.card2.desc")}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    component={RouterLink}
                    to={withLang("/tools/extra-payment")}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                  >
                    Loan Payoff
                  </Button>
                  <Button
                    component={RouterLink}
                    to={withLang("/tools/compounding-calculator")}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                  >
                    Compounding
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700}>
                  {t("comparisons.card3.title")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                  {t("comparisons.card3.desc")}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    component={RouterLink}
                    to={withLang("/tools/home-affordability")}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                  >
                    Home Affordability
                  </Button>
                  <Button
                    component={RouterLink}
                    to={withLang("/tools/rental-property-calculator")}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                  >
                    Rental Property
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
