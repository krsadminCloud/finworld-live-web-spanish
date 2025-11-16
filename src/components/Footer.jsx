import * as React from 'react';
import { Box, Container, Link, Typography, Stack, Divider, Grid } from '@mui/material';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 8 }}>
      <Container sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              FinWorld
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
              Free, modern financial calculators to help you model mortgages, take-home pay,
              investments, and rental properties with confidence.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Financial Calculators
            </Typography>
            <Stack spacing={0.5}>
              <Link href="/tools/mortgage-calculator" underline="hover" color="text.secondary">
                Mortgage Calculator
              </Link>
              <Link href="/tools/extra-payment" underline="hover" color="text.secondary">
                Loan Payoff / Extra Payment
              </Link>
              <Link href="/tools/home-affordability" underline="hover" color="text.secondary">
                Home Affordability
              </Link>
              <Link href="/tools/rental-property-calculator" underline="hover" color="text.secondary">
                Rental Property
              </Link>
              <Link href="/tools/compounding-calculator" underline="hover" color="text.secondary">
                Compounding Calculator
              </Link>
              <Link href="/tools/retirement-calculator" underline="hover" color="text.secondary">
                Retirement Calculator
              </Link>
              <Link href="/tools/auto-loan-calculator" underline="hover" color="text.secondary">
                Auto Loan Payoff
              </Link>
              <Link href="/tools/buy-vs-lease-auto" underline="hover" color="text.secondary">
                Buy vs Lease Car
              </Link>
              <Link href="/tools/take-home-pay" underline="hover" color="text.secondary">
                Take-Home Pay
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Learn & Guides
            </Typography>
            <Stack spacing={0.5}>
              <Link href="/guides" underline="hover" color="text.secondary">
                Guides (coming soon)
              </Link>
              <Link href="/comparisons" underline="hover" color="text.secondary">
                Comparisons
              </Link>
              <Link href="/about" underline="hover" color="text.secondary">
                About FinWorld
              </Link>
              <Link href="/tools" underline="hover" color="text.secondary">
                All Calculators
              </Link>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Stack direction="row" spacing={3}>
            <Link href="#" underline="hover" color="text.secondary">
              Privacy
            </Link>
            <Link href="#" underline="hover" color="text.secondary">
              Terms
            </Link>
            <Link href="#" underline="hover" color="text.secondary">
              Contact
            </Link>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            © {year} FinWorld. For informational purposes only, not financial advice.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

