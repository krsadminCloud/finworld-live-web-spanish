// src/pages/Home.jsx
import React from "react";
import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import FeaturedTools from "../components/FeaturedTools";
import ArticlesGrid from "../components/ArticlesGrid";

export default function Home() {
  return (
    <Box>
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
      {/* 🌅 Hero Section */}
      <Box
        sx={{
          minHeight: { xs: 360, md: 500 },
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          textAlign: "center",
          p: 4,
          color: "#fff",
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.65)), url("https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Stack spacing={2} sx={{ maxWidth: 880, pb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2.2rem", md: "3.5rem" },
              lineHeight: 1.2,
            }}
          >
            Make Smart Money Moves
          </Typography>

          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              maxWidth: 700,
              mx: "auto",
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            Get personalized insights and tools to help you reach your financial
            goals with confidence.
          </Typography>

          {/* CTA Buttons */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "center", pt: 2 }}
          >
            <Button
              component={RouterLink}
              to="/tools"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Explore Tools
            </Button>
            <Button
              component={RouterLink}
              to="/guides"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Read Guides
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* 💡 Featured Tools Section */}
      <Container sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 4,
            textAlign: "center",
            color: "text.primary",
          }}
        >
          Featured Tools
        </Typography>
        <FeaturedTools />
      </Container>

      {/* 📰 Latest Articles Section */}
      <Box sx={{ bgcolor: "background.paper", py: { xs: 6, md: 10 } }}>
        <Container>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 4,
              textAlign: "center",
              color: "text.primary",
            }}
          >
            Latest Articles
          </Typography>
          <ArticlesGrid />
        </Container>
      </Box>
    </Box>
  );
}
