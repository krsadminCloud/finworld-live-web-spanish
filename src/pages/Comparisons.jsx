import React from "react";
import { Box, Container, Typography, Stack, Card, CardContent, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Comparisons() {
  const canonical =
    typeof window !== "undefined"
      ? `${window.location.origin}/comparisons`
      : "https://www.finworld.live/comparisons";

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
              Financial Comparisons
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Some of the most important money decisions are trade‑offs: renting vs
              buying, leasing vs financing a car, paying down debt vs investing more.
              This section highlights calculators that are especially useful for
              comparing those choices side by side.
            </Typography>
          </Stack>

          <Stack spacing={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700}>
                  Buy vs Lease a Car
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                  Use the Buy vs Lease Auto Calculator to compare total cost of
                  ownership, including depreciation, lease fees, APR, and miles.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/tools/buy-vs-lease-auto"
                  size="small"
                  variant="contained"
                  sx={{ textTransform: "none" }}
                >
                  Open Buy vs Lease Calculator
                </Button>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700}>
                  Pay Off Debt vs Invest
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                  Combine the Loan Payoff and Compounding calculators to see how
                  extra payments compare to investing the same dollars over time.
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    component={RouterLink}
                    to="/tools/extra-payment"
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                  >
                    Loan Payoff
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/tools/compounding-calculator"
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
                  Renting vs Owning a Home
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                  Use the Home Affordability and Rental Property calculators together
                  to understand the trade‑offs between renting and owning, including
                  monthly cash flow and long‑term equity.
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    component={RouterLink}
                    to="/tools/home-affordability"
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                  >
                    Home Affordability
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/tools/rental-property-calculator"
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

