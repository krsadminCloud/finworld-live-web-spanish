// src/pages/Home.jsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTheme } from "@mui/material/styles";
import FeaturedTools from "../components/FeaturedTools";
import ArticlesGrid from "../components/ArticlesGrid";
import { useLanguageRouting } from "../utils/langRouting";
import { useTranslation } from "react-i18next";

export default function Home() {
  const theme = useTheme();
  const { withLang } = useLanguageRouting();
  const { t } = useTranslation();

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Helmet>
        <title>FinWorld | Free Mortgage & Money Calculators</title>
        <meta
          name="description"
          content="Use FinWorld's free calculators to plan your mortgage, estimate take-home pay, compare loan payoff strategies, and analyze rental properties."
        />
        <link
          rel="canonical"
          href={
            typeof window !== "undefined"
              ? `${window.location.origin}/`
              : "https://www.finworld.live/"
          }
        />
      </Helmet>

      {/* Hero aligned with calculators hub tokens */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 380, md: 520 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          overflow: "hidden",
          backgroundColor: "#0b1220",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              'linear-gradient(135deg, rgba(7,11,21,0.94), rgba(5,34,33,0.9)), url("https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=1600&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(0.94)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(34,211,238,0.14), transparent 42%)",
            opacity: 0.9,
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", py: { xs: 6, md: 8 } }}>
          <Paper
            elevation={8}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: { xs: 3, md: 4 },
              textAlign: "center",
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(8,15,28,0.82)",
              border: "1px solid rgba(255,255,255,0.12)",
              maxWidth: 980,
              mx: "auto",
            }}
          >
            <Stack spacing={2.5} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                <Chip
                  label={t("common.badge.fresh")}
                  color="success"
                  size="small"
                  sx={{ fontWeight: 700, borderRadius: "999px", backgroundColor: "#22c55e" }}
                />
                <Chip
                  label={t("common.badge.nosignup.short")}
                  variant="outlined"
                  size="small"
                  sx={{
                    fontWeight: 700,
                    borderRadius: "999px",
                    borderColor: "rgba(255,255,255,0.6)",
                    color: "#e2e8f0",
                  }}
                />
              </Stack>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "2.4rem", md: "3.6rem" },
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                  color: "#f8fafc",
                  textShadow:
                    "0 14px 32px rgba(0,0,0,0.6), 0 1px 0 rgba(0,0,0,0.45), 0 0 18px rgba(20,184,166,0.25)",
                }}
              >
                {t("home.hero.title")}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  opacity: 0.95,
                  maxWidth: 760,
                  mx: "auto",
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: "rgba(236,244,255,0.95)",
                  textShadow: "0 10px 28px rgba(0,0,0,0.55)",
                }}
              >
                {t("home.hero.subtitle")}
              </Typography>

              {/* CTA Buttons */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ justifyContent: "center", pt: 1 }}
              >
                <Button
                  component={RouterLink}
                  to={withLang("/tools")}
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.3,
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 700,
                    bgcolor: "#14B8A6",
                    "&:hover": { bgcolor: "#0f948a" },
                    boxShadow: "0 12px 24px rgba(20,184,166,0.35)",
                  }}
                >
                  {t("home.cta.explore")}
                </Button>
                <Button
                  component={RouterLink}
                  to={withLang("/guides")}
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.3,
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 700,
                    color: "#e2e8f0",
                    borderColor: "rgba(255,255,255,0.5)",
                    "&:hover": {
                      borderColor: "#e2e8f0",
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  {t("home.cta.guides")}
                </Button>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1.5, sm: 3 }}
                sx={{ color: "rgba(226,232,240,0.9)", fontSize: ".95rem", pt: 0.5 }}
              >
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                    }}
                  />
                  <span>{t("home.stat.liveTools")}</span>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: "#38bdf8",
                    }}
                  />
                  <span>{t("home.stat.personalFinance")}</span>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Container>
      </Box>

      {/* Featured Tools Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 3,
            textAlign: "center",
            color: "text.primary",
          }}
        >
          {t("home.featured.title")}
        </Typography>
        <FeaturedTools />
      </Container>

      {/* Latest Articles Section */}
      <Box sx={{ bgcolor: "background.paper", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 3,
              textAlign: "center",
              color: "text.primary",
            }}
          >
            {t("home.articles.title")}
          </Typography>
          <ArticlesGrid />
        </Container>
      </Box>
    </Box>
  );
}
