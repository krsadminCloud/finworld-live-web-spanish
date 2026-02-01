import React from "react";
import { Box, Container, Typography, Stack, Card, CardContent, Button } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLanguageRouting } from "../utils/langRouting";
import { useTranslation } from "react-i18next";

export default function Guides() {
  const location = useLocation();
  const { withLang } = useLanguageRouting();
  const { t } = useTranslation();
  const canonical =
    typeof window !== "undefined"
      ? `${window.location.origin}${location.pathname}`
      : "https://www.finworld.live/en/guides";

  return (
    <Box>
      <Helmet>
        <title>Money Guides & Learning | FinWorld</title>
        <meta
          name="description"
          content="Explore upcoming FinWorld guidance on mortgages, taxes, investing, and take-home pay, paired with interactive calculators to run your own numbers."
        />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <Container sx={{ py: { xs: 6, md: 10 }, maxWidth: "lg" }}>
        <Stack spacing={4}>
          <Stack spacing={2}>
            <Typography variant="h3" fontWeight={800}>
              {t("guides.title")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("guides.intro")}
            </Typography>
          </Stack>

          <Stack spacing={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700}>
                  {t("guides.card1.title")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                  {t("guides.card1.desc")}
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
                    to={withLang("/tools/mortgage-calculator")}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                  >
                    Mortgage Calculator
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700}>
                  {t("guides.card2.title")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                  {t("guides.card2.desc")}
                </Typography>
                <Button
                  component={RouterLink}
                  to={withLang("/tools/take-home-pay")}
                  size="small"
                  variant="contained"
                  sx={{ textTransform: "none" }}
                >
                  {t("common.btn.openNamed", { name: "Take-Home Pay Calculator" })}
                </Button>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700}>
                  {t("guides.card3.title")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                  {t("guides.card3.desc")}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    component={RouterLink}
                    to={withLang("/tools/compounding-calculator")}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                  >
                    Compounding Calculator
                  </Button>
                  <Button
                    component={RouterLink}
                    to={withLang("/tools/retirement-calculator")}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                  >
                    Retirement Calculator
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
