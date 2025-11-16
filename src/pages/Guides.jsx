import React from "react";
import { Box, Container, Typography, Stack, Card, CardContent, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Guides() {
  const canonical =
    typeof window !== "undefined"
      ? `${window.location.origin}/guides`
      : "https://www.finworld.live/guides";

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
              Learn with FinWorld Guides
            </Typography>
            <Typography variant="body1" color="text.secondary">
              This section will host step‑by‑step guides that pair real‑world money
              questions with interactive calculators. While the long‑form articles are
              still being written, you can already use the tools below to start
              exploring your own scenarios.
            </Typography>
          </Stack>

          <Stack spacing={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700}>
                  How much house can I really afford?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                  Combine the Home Affordability and Mortgage calculators to understand
                  comfortable payment ranges, DTI ratios, and long‑term interest costs.
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
                    to="/tools/mortgage-calculator"
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
                  Estimating take‑home pay on a new job
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                  Use the Take‑Home Pay calculator to compare offers across states,
                  filing statuses, and benefit assumptions before you negotiate.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/tools/take-home-pay"
                  size="small"
                  variant="contained"
                  sx={{ textTransform: "none" }}
                >
                  Open Take‑Home Pay Calculator
                </Button>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700}>
                  Planning long‑term investing and retirement
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                  Pair the Compounding and Retirement calculators to see how today&apos;s
                  savings decisions translate into future retirement income.
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    component={RouterLink}
                    to="/tools/compounding-calculator"
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                  >
                    Compounding Calculator
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/tools/retirement-calculator"
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

