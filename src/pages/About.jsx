import React from "react";
import { Box, Container, Typography, Stack, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function About() {
  const canonical =
    typeof window !== "undefined"
      ? `${window.location.origin}/about`
      : "https://www.finworld.live/about";

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
            About FinWorld
          </Typography>
          <Typography variant="body1" color="text.secondary">
            FinWorld is a collection of focused, high‑quality financial calculators
            designed to help you model real‑world decisions: which home you can afford,
            how much you actually take home after taxes, how quickly extra payments
            speed up a loan payoff, and how your investments grow with compounding.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Every calculator is built to be transparent and educational. Rather than
            hiding the math, we show you how the numbers come together so you can
            stress‑test assumptions and understand the trade‑offs behind each choice.
          </Typography>

          <Typography variant="h5" fontWeight={700} sx={{ mt: 4 }}>
            Start with these calculators
          </Typography>
          <Stack spacing={1}>
            <Typography>
              •{" "}
              <RouterLink to="/tools/mortgage-calculator">
                Mortgage Calculator
              </RouterLink>{" "}
              — estimate monthly payments and total interest.
            </Typography>
            <Typography>
              •{" "}
              <RouterLink to="/tools/take-home-pay">
                Take‑Home Pay Calculator
              </RouterLink>{" "}
              — see after‑tax income for different jobs and locations.
            </Typography>
            <Typography>
              •{" "}
              <RouterLink to="/tools/extra-payment">
                Loan Payoff / Extra Payment
              </RouterLink>{" "}
              — compare payoff strategies and interest savings.
            </Typography>
            <Typography>
              •{" "}
              <RouterLink to="/tools/compounding-calculator">
                Compounding Calculator
              </RouterLink>{" "}
              — visualize long‑term investment growth.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              component={RouterLink}
              to="/tools"
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Explore all calculators
            </Button>
            <Button
              component={RouterLink}
              to="/guides"
              variant="outlined"
              sx={{ textTransform: "none" }}
            >
              Read upcoming guides
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

