// temporary test comment to trigger preview build
// src/pages/tools/index.jsx
import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Stack,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Container,
  Paper,
  Divider,
  Card,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { ColorModeContext } from "../../context/ColorModeContext";

// ===== Icons =====
import CalculateIcon from "@mui/icons-material/Calculate";
import SearchIcon from "@mui/icons-material/Search";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PaidIcon from "@mui/icons-material/Paid";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import RealEstateAgentIcon from "@mui/icons-material/RealEstateAgent";
import HouseIcon from "@mui/icons-material/House";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SavingsIcon from "@mui/icons-material/Savings";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import SchoolIcon from "@mui/icons-material/School";
import HomeIcon from "@mui/icons-material/Home";

export default function FinancialCalculators() {
  const theme = useTheme();
  const navigate = useNavigate();
  const colorMode = React.useContext(ColorModeContext);

  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("Mortgage");

  // === Mortgage Calculators (Cool Pastel Palette) ===
  const mortgageCalculators = [
    { title: "Mortgage Calculator", icon: <PaymentsIcon sx={{ color: "#A5F3FC" }} fontSize="large" />, to: "/tools/mortgage_calculator", disabled: false, cat: "Mortgage" },
    { title: "Loan Payoff Calculator", icon: <PaidIcon sx={{ color: "#6EE7B7" }} fontSize="large" />, to: "/tools/extra_payment", disabled: false, cat: "Mortgage" },
    { title: "Mortgage Affordability Calculator", icon: <AttachMoneyIcon sx={{ color: "#86EFAC" }} fontSize="large" />, to: "/tools/home_affordability", disabled: false, cat: "Mortgage" },
    { title: "Mortgage Amortization Calculator", icon: <ReceiptLongIcon sx={{ color: "#93C5FD" }} fontSize="large" />, disabled: true, cat: "Mortgage" },
    { title: "Bi-Weekly Payment Calculator", icon: <EventRepeatIcon sx={{ color: "#C4B5FD" }} fontSize="large" />, disabled: true, cat: "Mortgage" },
    { title: "Interest-Only Mortgage Calculator", icon: <MoneyOffIcon sx={{ color: "#FCA5A5" }} fontSize="large" />, disabled: true, cat: "Mortgage" },
    { title: "Adjustable Rate (ARM) Calculator", icon: <TrendingUpIcon sx={{ color: "#FCD34D" }} fontSize="large" />, disabled: true, cat: "Mortgage" },
    { title: "Balloon Mortgage Calculator", icon: <RocketLaunchIcon sx={{ color: "#FDBA74" }} fontSize="large" />, disabled: true, cat: "Mortgage" },
    { title: "Mortgage Refinance Calculator", icon: <RealEstateAgentIcon sx={{ color: "#93C5FD" }} fontSize="large" />, disabled: true, cat: "Mortgage" },
    { title: "Home Equity Loan Calculator", icon: <HouseIcon sx={{ color: "#A7F3D0" }} fontSize="large" />, disabled: true, cat: "Mortgage" },
    { title: "Mortgage Comparison Calculator", icon: <CompareArrowsIcon sx={{ color: "#C7D2FE" }} fontSize="large" />, disabled: true, cat: "Mortgage" },
    { title: "Rent vs. Buy Calculator", icon: <ApartmentIcon sx={{ color: "#BAE6FD" }} fontSize="large" />, disabled: true, cat: "Mortgage" },
    { title: "Rental Property Calculator", icon: <RealEstateAgentIcon sx={{ color: "#00C1B0" }} fontSize="large" />, to: "/tools/rental_property_calculator", disabled: false, cat: "Mortgage" },
  ];

  // === Personal Finance Calculators (Warm Pastel Palette) ===
  const personalFinanceCalculators = [
    // Active calculators in requested order
    { title: "Compounding Calculator", icon: <TrendingUpIcon sx={{ color: "#FCD34D" }} fontSize="large" />, to: "/tools/compounding_calculator", disabled: false, cat: "Personal Finance" },
    { title: "Retirement Saving", icon: <SavingsIcon sx={{ color: "#93C5FD" }} fontSize="large" />, to: "/tools/retirement_calculator", disabled: false, cat: "Personal Finance" },
    { title: "Take Home Pay", icon: <AttachMoneyIcon sx={{ color: "#F9A8D4" }} fontSize="large" />, to: "/tools/take_home_pay", disabled: false, cat: "Personal Finance" },
    { title: "Car Loan", icon: <DirectionsCarIcon sx={{ color: "#A5F3FC" }} fontSize="large" />, to: "/tools/auto_loan_calculator", disabled: false, cat: "Personal Finance" },
    { title: "Buy vs Lease", icon: <DirectionsCarIcon sx={{ color: "#86EFAC" }} fontSize="large" />, to: "/tools/buy_vs_lease_auto", disabled: false, cat: "Personal Finance" },
    // Remaining (coming soon) items
    { title: "Budget Planner", icon: <CalculateIcon sx={{ color: "#FDE68A" }} fontSize="large" />, disabled: true, cat: "Personal Finance" },
    { title: "Net Worth", icon: <AccountBalanceIcon sx={{ color: "#A7F3D0" }} fontSize="large" />, disabled: true, cat: "Personal Finance" },
    { title: "Debt Payoff", icon: <MoneyOffIcon sx={{ color: "#FCA5A5" }} fontSize="large" />, disabled: true, cat: "Personal Finance" },
    { title: "Home Affordability", icon: <HomeIcon sx={{ color: "#FDBA74" }} fontSize="large" />, disabled: true, cat: "Personal Finance" },
    { title: "Savings Goal", icon: <SavingsIcon sx={{ color: "#86EFAC" }} fontSize="large" />, disabled: true, cat: "Personal Finance" },
    { title: "Credit Card Payoff", icon: <CreditCardIcon sx={{ color: "#FBBF24" }} fontSize="large" />, disabled: true, cat: "Personal Finance" },
    { title: "Emergency Fund", icon: <HealthAndSafetyIcon sx={{ color: "#FBCFE8" }} fontSize="large" />, disabled: true, cat: "Personal Finance" },
    { title: "College Savings", icon: <SchoolIcon sx={{ color: "#C7D2FE" }} fontSize="large" />, disabled: true, cat: "Personal Finance" },
  ];

  // === Investment Calculators ===
  const investmentCalculators = [
    { title: "Rental Property Calculator", icon: <RealEstateAgentIcon sx={{ color: "#00C1B0" }} fontSize="large" />, to: "/tools/rental_property_calculator", disabled: false, cat: "Investment" },
  ];

  // === Combine Categories ===
  const calculators = [...mortgageCalculators, ...personalFinanceCalculators, ...investmentCalculators];

  const filtered = calculators.filter(
    (c) =>
      c.cat === category &&
      (!query || c.title.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* ===== AppBar ===== */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 6 }, minHeight: { xs: 72, md: 64 } }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CalculateIcon color="primary" />
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: "-0.02em" }}>
              FinCalc
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Stack
            direction="row"
            spacing={{ xs: 0.5, md: 1.5 }}
            alignItems="center"
            flexWrap={{ xs: "wrap", md: "nowrap" }}
            justifyContent={{ xs: "flex-end", md: "flex-start" }}
            useFlexGap
            sx={{ rowGap: { xs: 1, md: 0 } }}
          >
            <IconButton
              onClick={colorMode.toggleColorMode}
              color="inherit"
              size="small"
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              {theme.palette.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            {/** Rental Calculator button removed per request */}
            <Button
              size="small"
              variant="contained"
              color="primary"
              sx={{ borderRadius: 50, fontWeight: 700, px: { xs: 1.25, md: 2.5 }, py: { xs: 0.5, md: 1 }, whiteSpace: 'nowrap' }}
            >
              My Account
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* ===== Main Content ===== */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero */}
        <Stack spacing={1.5} alignItems="center" textAlign="center" sx={{ mb: 6, px: 2 }}>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              letterSpacing: "-0.03em",
              fontSize: { xs: "2rem", sm: "2.25rem", md: "3rem" },
              lineHeight: { xs: 1.2, md: 1.2 },
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(90deg,#34d399,#2dd4bf)"
                  : "linear-gradient(90deg,#10b981,#14b8a6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Financial Calculators
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 720 }}>
            Fresh, friendly, and trustworthy tools to manage your finances.
          </Typography>
        </Stack>

        {/* Search Bar */}
        <Paper elevation={1} sx={{ mx: { xs: 2, sm: "auto" }, mb: 4, maxWidth: 700, borderRadius: 50, p: 1 }}>
          <TextField
            fullWidth
            placeholder="Search for a calculator..."
            variant="standard"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { px: 2, py: 1, fontSize: "1rem" },
            }}
          />
        </Paper>

        {/* === Popular Calculators Section === */}
        <Stack alignItems="center" sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', mb: 1 }}
          >
            Popular:
          </Typography>

          <Stack direction="row" spacing={{ xs: 1, md: 1.5 }} flexWrap="wrap" justifyContent="center" useFlexGap sx={{ rowGap: { xs: 1.5, md: 1.5 } }}>
            <Box
              sx={{ backgroundColor: "#A7F3D0", color: "#065F46", px: { xs: 1.25, md: 2 }, py: { xs: 0.25, md: 0.5 }, borderRadius: "999px", fontWeight: 700, fontSize: { xs: "0.8rem", md: "0.9rem" }, cursor: "pointer" }}
              onClick={() => navigate("/tools/mortgage_calculator")}
            >
              Mortgage Calculator
            </Box>
            <Box
              sx={{ backgroundColor: "#D1FAE5", color: "#065F46", px: { xs: 1.25, md: 2 }, py: { xs: 0.25, md: 0.5 }, borderRadius: "999px", fontWeight: 700, fontSize: { xs: "0.8rem", md: "0.9rem" }, cursor: "pointer" }}
              onClick={() => navigate("/tools/extra_payment")}
            >
              Loan Payoff
            </Box>
            <Box
              sx={{ backgroundColor: "#BAE6FD", color: "#1E3A8A", px: { xs: 1.25, md: 2 }, py: { xs: 0.25, md: 0.5 }, borderRadius: "999px", fontWeight: 700, fontSize: { xs: "0.8rem", md: "0.9rem" }, cursor: "pointer" }}
              onClick={() => navigate("/tools/take_home_pay")}
            >
              Take Home Pay
            </Box>
            <Box sx={{ backgroundColor: "#FDE68A", color: "#78350F", px: { xs: 1.25, md: 2 }, py: { xs: 0.25, md: 0.5 }, borderRadius: "999px", fontWeight: 700, fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
              Savings Goal
            </Box>
            <Box
              sx={{ backgroundColor: "#FBCFE8", color: "#831843", px: { xs: 1.25, md: 2 }, py: { xs: 0.25, md: 0.5 }, borderRadius: "999px", fontWeight: 700, fontSize: { xs: "0.8rem", md: "0.9rem" }, cursor: "pointer" }}
              onClick={() => navigate("/tools/retirement_calculator")}
            >
              Retirement Saving
            </Box>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 4 }} />

        {/* === Category Chips === */}
        <Stack direction="row" spacing={{ xs: 0.75, md: 1 }} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ mb: 6, rowGap: { xs: 1.25, md: 1 } }}>
          {["Mortgage", "Personal Finance", "Investment", "Retirement", "Taxes", "Auto"].map((c) => (
            <Chip
              key={c}
              label={c}
              onClick={() => setCategory(c)}
              color={c === category ? "primary" : "default"}
              variant={c === category ? "filled" : "outlined"}
              sx={{
                borderRadius: "999px",
                height: { xs: 28, md: 32 },
                fontSize: { xs: ".8rem", md: ".875rem" },
                px: { xs: 0.5, md: 1 },
                fontWeight: 600,
                boxShadow: c === category ? "0 4px 10px rgba(16,185,129,0.3)" : "none",
                "&:hover": {
                  boxShadow:
                    c === category
                      ? "0 6px 16px rgba(16,185,129,0.35)"
                      : "0 4px 8px rgba(0,0,0,0.05)",
                },
              }}
            />
          ))}
        </Stack>

        <Divider sx={{ mb: 4 }} />

        {/* === Updated Grid Layout (Uniform Tiles) === */}
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={{ xs: 1.5, md: 2.5 }}>
          {filtered.map((item) => (
            <Card
              key={item.title}
              onClick={() => !item.disabled && item.to && navigate(item.to)}
              sx={{
                flex: "1 1 230px",
                maxWidth: "230px",
                height: { xs: 148, md: 160 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
                textAlign: "center",
                cursor: item.disabled ? "default" : "pointer",
                opacity: item.disabled ? 0.55 : 1,
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(180deg,#1f2937,#0f172a)"
                    : "linear-gradient(180deg,#ffffff,#f3f4f6)",
                border: `1px solid ${
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.06)"
                }`,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 4px 12px rgba(0,0,0,0.3)"
                    : "0 6px 20px rgba(0,0,0,0.04)",
                transition:
                  "transform .18s ease, box-shadow .18s ease, background .2s ease",
                "&:hover": {
                  transform: item.disabled ? "none" : "translateY(-4px)",
                  boxShadow: item.disabled
                    ? undefined
                    : theme.palette.mode === "dark"
                    ? "0 12px 30px rgba(0,0,0,0.4)"
                    : "0 12px 30px rgba(16,185,129,0.2)",
                  background: item.disabled
                    ? undefined
                    : theme.palette.mode === "dark"
                    ? "linear-gradient(180deg,#1e3a34,#064e3b)"
                    : "linear-gradient(180deg,#ecfdf5,#d1fae5)",
                },
              }}
            >
              {item.icon}
              <Typography fontWeight={700} sx={{ mt: 1 }}>
                {item.title}
              </Typography>
              {item.disabled && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  (Coming soon)
                </Typography>
              )}
            </Card>
          ))}
        </Box>

        {/* === Footer === */}
        <Box component="footer" sx={{ borderTop: `1px solid ${theme.palette.divider}`, mt: 8, py: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
            © 2025 FinCalc. All Rights Reserved.
          </Typography>
          <Stack direction="row" spacing={3} justifyContent="center">
            <Button size="small" color="inherit">About Us</Button>
            <Button size="small" color="inherit">Contact</Button>
            <Button size="small" color="inherit">Help &amp; Guidance</Button>
            <Button size="small" color="inherit">Terms of Service</Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
